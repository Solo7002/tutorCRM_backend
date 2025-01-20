const express = require('express');
const multer = require('multer');
const { uploadFile, deleteFile } = require('../controllers/fileController');

const router = express.Router();
const upload = multer();

router.post('/upload', upload.single('file'), uploadFile);
router.delete('/delete/:fileName', deleteFile);

module.exports = router;