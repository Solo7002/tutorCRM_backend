const express = require('express');
const multer = require('multer');
const { uploadFile, uploadFileAndRetunLink, deleteFile, downloadFile,deleteFileByURL } = require('../controllers/fileController');

const router = express.Router();
const upload = multer();

/**
 * @swagger
 * tags:
 *   name: Files
 *   description: File management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UploadFileResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Success message
 *         url:
 *           type: string
 *           description: The URL of the uploaded file
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message
 */

/**
 * @swagger
 * /api/files/upload:
 *   post:
 *     summary: Upload a file
 *     tags: [Files]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadFileResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/upload', upload.single('file'), uploadFile);

router.post('/uploadAndReturnLink', upload.single('file'), uploadFileAndRetunLink);

/**
 * @swagger
 * /api/files/delete/{fileName}:
 *   delete:
 *     summary: Delete a file
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: fileName
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the file to delete
 *     responses:
 *       200:
 *         description: File deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/delete/:fileName', deleteFile);

/**
 * @swagger
 * /api/files/download/{fileName}:
 *   get:
 *     summary: Generate a download link for a file
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: fileName
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the file to download
 *     responses:
 *       200:
 *         description: Download link generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: The URL for downloading the file
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/download/:fileName', downloadFile);

module.exports = router;