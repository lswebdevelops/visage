// backend/middleware/uploadMiddleware.js
import multer from 'multer';
import path from 'path';

// Configuração de armazenamento para o Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define o diretório onde os arquivos serão salvos
    // Certifique-se de que esta pasta 'uploads' existe na raiz do seu backend
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    // Define o nome do arquivo para evitar colisões
    // Ex: nome-do-arquivo-123456789.jpg
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Filtro para aceitar apenas imagens
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/; // Tipos de arquivo permitidos
  const mimetype = filetypes.test(file.mimetype); // Verifica o mimetype
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); // Verifica a extensão

  if (mimetype && extname) {
    return cb(null, true); // Aceita o arquivo
  } else {
    cb(new Error('Somente imagens (JPG, JPEG, PNG, GIF) são permitidas!'), false); // Rejeita o arquivo
  }
};

// Inicializa o Multer com as configurações
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB por arquivo
});

export default upload;