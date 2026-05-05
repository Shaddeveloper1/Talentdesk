import { config } from 'dotenv';
import express from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../../.env') });
const { BACKEND_PORT } = process.env;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDirectory = path.join(__dirname, '../uploads');

fs.mkdirSync(uploadsDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadsDirectory);
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, extension)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'upload';

    callback(null, `${Date.now()}-${baseName}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const app = express();

const validateSubmission = ({ name, message, file }) => {
  const errors = {};
  const trimmedName = name?.trim() || '';
  const trimmedMessage = message?.trim() || '';

  if (!trimmedName) {
    errors.name = 'Name is required.';
  } else if (trimmedName.length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  } else if (trimmedName.length > 80) {
    errors.name = 'Name must be 80 characters or fewer.';
  }

  if (!trimmedMessage) {
    errors.message = 'Message is required.';
  } else if (trimmedMessage.length < 10) {
    errors.message = 'Message must be at least 10 characters.';
  } else if (trimmedMessage.length > 500) {
    errors.message = 'Message must be 500 characters or fewer.';
  }

  if (!file) {
    errors.file = 'A file is required.';
  }

  return {
    errors,
    values: {
      name: trimmedName,
      message: trimmedMessage,
    },
  };
};

app.use(express.json());
app.use('/uploads', express.static(uploadsDirectory));

app.post('/api/submit', upload.single('file'), (req, res) => {
  const { errors, values } = validateSubmission({
    name: req.body?.name,
    message: req.body?.message,
    file: req.file,
  });

  if (Object.keys(errors).length > 0) {
    if (req.file?.path) {
      fs.rmSync(req.file.path, { force: true });
    }

    return res.status(400).json({
      message: 'Validation failed.',
      errors,
    });
  }

  return res.status(201).json({
    ...values,
    file: {
      originalName: req.file.originalname,
      path: `/uploads/${req.file.filename}`,
      size: req.file.size,
      type: req.file.mimetype,
    },
  });
});

app.use((error, _req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      message: 'Validation failed.',
      errors: {
        file: error.code === 'LIMIT_FILE_SIZE'
          ? 'File must be 5MB or smaller.'
          : 'Unable to process the uploaded file.',
      },
    });
  }

  return next(error);
});

if (process.env.NODE_ENV !== 'test') {
  // eslint-disable-next-line no-console
  app.listen(BACKEND_PORT, () => console.log(`Server running on port ${BACKEND_PORT}`));
}

export default app;
