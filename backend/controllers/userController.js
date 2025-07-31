import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js"; // Certifique-se de que o modelo User está importado
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

// @desc auth user & get token
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
      isAdmin: user.isAdmin,
      currentWorkoutIndex: user.currentWorkoutIndex,
      lastCompletedWorkout: user.lastCompletedWorkout,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc register user
// @route POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  const user = await User.create({
    name,
    email,
    password,
    currentWorkoutIndex: 0,
    lastCompletedWorkout: null,
  });
  if (user) {
    generateToken(res, user._id);

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      currentWorkoutIndex: user.currentWorkoutIndex,
      lastCompletedWorkout: user.lastCompletedWorkout,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc logout user / clear cookie
// @route POST /api/users/logout
// @access private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
});

// @desc get user profile
// @route GET /api/users/profile
// @access private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      currentWorkoutIndex: user.currentWorkoutIndex,
      lastCompletedWorkout: user.lastCompletedWorkout,
    });
  } else {
    res.status(404);
    throw new Error("User not found.");
  }
});

// @desc update user profile
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
    if (req.body.currentWorkoutIndex !== undefined) {
      user.currentWorkoutIndex = req.body.currentWorkoutIndex;
    }
    if (req.body.lastCompletedWorkout !== undefined) {
      user.lastCompletedWorkout = req.body.lastCompletedWorkout;
    }

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      currentWorkoutIndex: updatedUser.currentWorkoutIndex,
      lastCompletedWorkout: updatedUser.lastCompletedWorkout,
    });
  } else {
    res.status(404);
    throw new Error(" User not found.");
  }
});

// admin

// @desc get users
// @route GET /api/users/
// @access private/admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
});

// @desc get user by ID
// @route GET /api/users/:id
// @access private/admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc delete users
// @route DELETE /api/users/:id
// @access private/admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.isAdmin) {
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

// @desc update users (admin only)
// @route PUT /api/users/:id
// @access private/admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc get emails of users
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
    // console.log(`Envie o email para: ${user.email} com o link: ${resetUrl}`);
    res.status(200).json({
      message: "Instruções de redefinição de senha enviadas para seu e-mail.",
    });
  } catch (err) {
    // console.error("Erro ao enviar email de redefinição de senha:", err);
  
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.status(500);
    throw new Error("Ocorreu um erro ao enviar o email de redefinição de senha. Tente novamente mais tarde.");
  }
});

// POST /api/users/reset-password
const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  // Verifica se o token e senha foram fornecidos
  if (!token || !password) {
    res.status(400);
    throw new Error("Token e nova senha são obrigatórios");
  }

  // Hashes o token recebido do frontend para comparação com o token armazenado no DB
  const hashedTokenFromFrontend = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  // console.log("Incoming token (from frontend, unhashed):", token);
  // console.log("Hashed token for query:", hashedTokenFromFrontend);

  // >>> LINHA CORRIGIDA: Buscar o usuário pelo token hashed e validade <<<
  const user = await User.findOne({
    resetPasswordToken: hashedTokenFromFrontend,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    // console.error("Nenhum usuário encontrado para o token fornecido ou token expirado.");
    res.status(400);
    throw new Error("Token inválido ou expirado");
  }

  // Atribua a senha em texto simples. O hook pre-save no userModel irá fazer o hashing.
  user.password = password;

  user.resetPasswordToken = undefined; // Limpa o token após o uso
  user.resetPasswordExpire = undefined; // Limpa a expiração após o uso

  await user.save(); // Isto irá acionar o hook pre-save para fazer o hashing da nova senha

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
