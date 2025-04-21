const { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions } = require('@azure/storage-blob');
require('dotenv').config();
require('url');
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
  const rawName = file.originalname;
  const decodedName = Buffer.from(rawName, 'binary').toString('utf8');

  let fileName = decodedName;
  const containerClient = blobServiceClient.getContainerClient(containerName);
  await containerClient.createIfNotExists();

  const blockBlobClient = containerClient.getBlockBlobClient(fileName);

  const exists = await blockBlobClient.exists();

  if (exists) {
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
    const fileExtension = decodedName.split('.').pop();
    const baseName = decodedName.replace(`.${fileExtension}`, '');
    fileName = `${baseName}_${timestamp}.${fileExtension}`;
  }

  const newBlockBlobClient = containerClient.getBlockBlobClient(fileName);
  await newBlockBlobClient.upload(file.buffer, file.buffer.length);

  return fileName;
}

async function uploadFileToBlobAndReturnLink(file) {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  await containerClient.createIfNotExists();

  let fileName = file.originalname;
  const blockBlobClient = containerClient.getBlockBlobClient(fileName);

  const exists = await blockBlobClient.exists();
  if (exists) {
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
    const fileExtension = file.originalname.split('.').pop();
    const baseName = file.originalname.replace(`.${fileExtension}`, '');
    fileName = `${baseName}${timestamp}.${fileExtension}`;
  }

  const newBlockBlobClient = containerClient.getBlockBlobClient(fileName);
  await newBlockBlobClient.upload(file.buffer, file.buffer.length);

  return `https://${accountName}.blob.core.windows.net/${containerName}/${fileName}`;
}

async function deleteFileFromBlob(fileName) {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(fileName);
  await blockBlobClient.deleteIfExists();
}

function generateTemporaryUrl(fileName, expiryTimeInMinutes = 60) {
  const now = new Date();
  const expiryTime = new Date(now);
  expiryTime.setMinutes(now.getMinutes() + expiryTimeInMinutes);

  const sasToken = generateBlobSASQueryParameters({
    containerName,
    blobName: fileName,
    permissions: BlobSASPermissions.parse("r"),
    startsOn: now,
    expiresOn: expiryTime,
  }, sharedKeyCredential).toString();

  return `https://${accountName}.blob.core.windows.net/${containerName}/${fileName}?${sasToken}`;
}

async function deleteFileFromBlobByUrl(fileUrl) {
  const url = new URL(fileUrl);
  const pathParts = url.pathname.split('/');
  const fileName = pathParts[pathParts.length - 1];

  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(fileName);
  await blockBlobClient.deleteIfExists();
}


module.exports = { uploadFileToBlob, uploadFileToBlobAndReturnLink, deleteFileFromBlob, generateTemporaryUrl,deleteFileFromBlobByUrl };
