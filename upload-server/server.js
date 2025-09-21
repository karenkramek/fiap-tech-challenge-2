const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3035;

// Middleware
app.use(cors());
app.use(express.json());

// Configuração do multer para upload de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', 'uploads');

    // Cria a pasta se não existir
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const { transactionType } = req.body;
    const timestamp = Date.now();

    console.log('📁 Upload filename generation:');
    console.log('  - transactionType received:', transactionType);
    console.log('  - timestamp:', timestamp);
    console.log('  - original filename:', file.originalname);

    // Mapeia os tipos para nomes mais limpos
    const typeMapping = {
      'DEPOSIT': 'deposito',
      'WITHDRAWAL': 'saque',
      'TRANSFER': 'transferencia',
      'PAYMENT': 'pagamento'
    };

    const typeName = typeMapping[transactionType] || 'transacao';
    const fileExtension = file.originalname.split('.').pop();

    // Formato simples: timestamp_tipo.extensao
    const fileName = `${timestamp}_${typeName}.${fileExtension}`;

    console.log('  - final fileName:', fileName);

    cb(null, fileName);
  }
});

// Filtro para tipos de arquivo permitidos
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não permitido'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB
  }
});

// Endpoint para upload de arquivos
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const filePath = `/uploads/${req.file.filename}`;

    res.json({
      success: true,
      filePath: filePath,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Endpoint para deletar arquivos
app.delete('/api/upload/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '..', 'uploads', filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ success: true, message: 'Arquivo deletado com sucesso' });
    } else {
      res.status(404).json({ error: 'Arquivo não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao deletar arquivo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Endpoint para verificar se um arquivo existe
app.get('/api/file-exists/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '..', 'uploads', filename);

  res.json({ exists: fs.existsSync(filePath) });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor de upload funcionando' });
});

// Tratamento de erros do multer
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Arquivo muito grande. Máximo 2MB.' });
    }
  }

  if (error.message === 'Tipo de arquivo não permitido') {
    return res.status(400).json({ error: error.message });
  }

  res.status(500).json({ error: 'Erro interno do servidor' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor de upload rodando na porta ${PORT}`);
  console.log(`📁 Pasta de uploads: ${path.join(__dirname, '..', 'uploads')}`);
});
