const { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions } = require('@azure/storage-blob');
require('dotenv').config();

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const containerName = process.env.AZURE_STORAGE_CONTAINER;

if (!accountName || !accountKey) {
  throw new Error("Storage account name or key is not configured.");
}

const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  sharedKeyCredential
);

async function uploadFileToBlob(file) {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  await containerClient.createIfNotExists();

  const blockBlobClient = containerClient.getBlockBlobClient(file.originalname);
  await blockBlobClient.upload(file.buffer, file.buffer.length);

//   return `https://${accountName}.blob.core.windows.net/${containerName}/${file.originalname}`;
    return file.originalname;
}

async function deleteFileFromBlob(fileName) {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(fileName);
  await blockBlobClient.deleteIfExists();
}

// Генерация временной ссылки (SAS токена)
function generateTemporaryUrl(fileName, expiryTimeInMinutes = 60) {
  const now = new Date();
  const expiryTime = new Date(now);
  expiryTime.setMinutes(now.getMinutes() + expiryTimeInMinutes);

  const sasToken = generateBlobSASQueryParameters({
    containerName,
    blobName: fileName,
    permissions: BlobSASPermissions.parse("r"), // Только чтение
    startsOn: now,
    expiresOn: expiryTime,
  }, sharedKeyCredential).toString();

  return `https://${accountName}.blob.core.windows.net/${containerName}/${fileName}?${sasToken}`;
}

module.exports = { uploadFileToBlob, deleteFileFromBlob, generateTemporaryUrl };
