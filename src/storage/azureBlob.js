const { BlobServiceClient, StorageSharedKeyCredential } = require('@azure/storage-blob');
require('dotenv').config();

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;

if (!accountName || !accountKey) {
  throw new Error("Необходимо указать AZURE_STORAGE_ACCOUNT_NAME и AZURE_STORAGE_ACCOUNT_KEY в файле .env");
}

const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  sharedKeyCredential
);

const containerName = "file-storage";

async function createContainer() {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  await containerClient.createIfNotExists();
  console.log(`Container "${containerName}" создан или уже существует.`);
}

// Запуск, если файл запущен напрямую
if (require.main === module) {
  (async () => {
    try {
      await createContainer();
    } catch (error) {
      console.error("Ошибка при создании контейнера:", error.message);
    }
  })();
}

module.exports = {
  createContainer,
};
