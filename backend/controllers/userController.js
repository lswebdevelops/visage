import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

// @desc Autenticar usuário e obter token
// @route POST /api/users/login
// @access Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      // MUDANÇA: Retorna o campo 'role' em vez de 'isAdmin'
      role: user.role,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc Registrar novo usuário
// @route POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // MUDANÇA: O 'role' padrão será 'barbeiro' conforme definido no modelo.
  // Você não precisa passá-lo aqui a menos que queira um registro de admin.
  const user = await User.create({
    name,
    email,
    password,
    // Se você quiser registrar um admin via API, pode adicionar 'role: "admin"' aqui.
    // Mas para registros públicos, o padrão do modelo ('barbeiro') é suficiente.
  });

  if (user) {
    generateToken(res, user._id);

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      // MUDANÇA: Retorna o campo 'role' em vez de 'isAdmin'
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc Deslogar usuário / limpar cookie
// @route POST /api/users/logout
// @access private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
});

// @desc Obter perfil do usuário
// @route GET /api/users/profile
// @access private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      // MUDANÇA: Retorna o campo 'role' em vez de 'isAdmin'
      role: user.role,
    });
  } else {
    res.status(404);
    throw new Error("User not found.");
  }
});

// @desc Atualizar perfil do usuário
// @route PUT /api/users/profile
// @access private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    // IMPORTANTE: Usuário comum não deve conseguir alterar seu próprio role aqui.
    // O campo 'role' não é atualizado nesta rota.

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      // MUDANÇA: Retorna o campo 'role' em vez de 'isAdmin'
      role: updatedUser.role,
    });
  } else {
    res.status(404);
    throw new Error(" User not found.");
  }
});

// Admin Controllers
// @desc Obter todos os usuários
// @route GET /api/users/
// @access private/admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  // MUDANÇA: Garante que 'role' seja incluído nos resultados
  res.status(200).json(users.map(({ _id, name, email, role, createdAt, updatedAt }) => ({
    _id,
    name,
    email,
    role,
    createdAt,
    updatedAt
  })));
});

// @desc Obter usuário por ID
// @route GET /api/users/:id
// @access private/admin
const getUserById = asyncHandler(async (req, res) => {
  // MUDANÇA: Garante que 'role' é incluído (select('-password') já faz isso por padrão)
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc Deletar usuários
// @route DELETE /api/users/:id
// @access private/admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    // MUDANÇA: Verifica o campo 'role' para determinar se é admin
    if (user.role === 'admin') {
      res.status(400);
      throw new Error("Cannot delete admin user");
    }
    await User.deleteOne({ _id: user._id });
    res.status(200).json({ message: "User deleted successfully" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc Atualizar usuários (somente admin)
// @route PUT /api/users/:id
// @access private/admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    
    // MUDANÇA: Admin pode atualizar o 'role' do usuário
    // Valida se o 'role' fornecido é válido e atualiza
    if (req.body.role && ['barbeiro', 'admin'].includes(req.body.role)) {
      user.role = req.body.role;
    } else if (req.body.role) {
      // Se um role inválido for fornecido, pode-se lançar um erro ou ignorar
      res.status(400);
      throw new Error("Invalid user role provided.");
    }
    // OBS: O campo 'isAdmin' (se ainda existisse) não seria mais usado aqui.

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      // MUDANÇA: Retorna o campo 'role'
      role: updatedUser.role,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc Obter emails de usuários
// @route GET /api/users/emails
// @access private/admin
const getEmails = asyncHandler(async (req, res) => {
  const users = await User.find({});
  const emails = users.map((user) => user.email);
  res.status(200).json(emails);
});

// @desc Iniciar processo de redefinição de senha
// @route POST /api/users/forgot-password
// @access Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Email é obrigatório.");
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("Usuário não encontrado.");
  }

  const resetToken = crypto.randomBytes(20).toString("hex");

  const resetTokenHashed = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordToken = resetTokenHashed;
  user.resetPasswordExpire = Date.now() + 3600000; // 1 hora em ms

  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  const message = `Você solicitou uma redefinição de senha. Por favor, acesse este link para redefinir sua senha:\n\n${resetUrl}\n\nEste link expirará em 1 hora.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Redefinição de Senha - Visage-App",
      message: message,
    });
    res.status(200).json({
      message: "Instruções de redefinição de senha enviadas para seu e-mail.",
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.status(500);
    throw new Error(
      "Ocorreu um erro ao enviar o email de redefinição de senha. Tente novamente mais tarde."
    );
  }
});

// @desc Redefinir senha
// @route POST /api/users/reset-password
// @access Public
const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    res.status(400);
    throw new Error("Token e nova senha são obrigatórios");
  }

  const hashedTokenFromFrontend = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedTokenFromFrontend,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Token inválido ou expirado");
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.json({ message: "Senha redefinida com sucesso" });
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  getEmails,
  forgotPassword,
  resetPassword,
};