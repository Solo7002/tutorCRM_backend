const { uploadFileToBlob, uploadFileToBlobAndReturnLink, deleteFileFromBlob, generateTemporaryUrl,deleteFileFromBlobByUrl } = require('../storage/azureBlob');
const logger = require('../utils/logger');

const createFile = async (req, res, file) => {
  try {
    if (!file) {
      logger.warn('Попытка загрузить файл без вложения');
      return res.status(400).json({ error: 'Файл не найден' });
    }

    const maxSize = parseInt(process.env.MAX_FILE_SIZE, 10);
    if (file.size > maxSize) {
      logger.warn(`Файл превышает допустимый размер: ${file.size} байт`);
      return res.status(400).json({ error: 'Размер файла превышает допустимый лимит' });
    }

    const fileUrl = await uploadFileToBlob(file);

    logger.info(`Файл успешно загружен: ${file.originalname}, URL: ${fileUrl}`);
    return fileUrl;
  } catch (error) {
    logger.error(`Ошибка при загрузке файла: ${error.message}`);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
};

const uploadFile = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      logger.warn('Попытка загрузить файл без вложения');
      return res.status(400).json({ error: 'Файл не найден' });
    }

    const maxSize = parseInt(process.env.MAX_FILE_SIZE, 10);
    if (file.size > maxSize) {
      logger.warn(`Файл превышает допустимый размер: ${file.size} байт`);
      return res.status(400).json({ error: 'Размер файла превышает допустимый лимит' });
    }

    const fileName = await uploadFileToBlob(file);
    const fileUrl = `https://blobstorage226122007.blob.core.windows.net/blob-storage-container/${fileName}`;

    logger.info(`Файл успешно загружен: ${file.originalname}, URL: ${fileUrl}`);
    res.status(201).json({ message: 'Файл успешно загружен', fileUrl });
  } catch (error) {
    logger.error(`Ошибка при загрузке файла: ${error.message}`);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
};

const uploadFileAndRetunLink = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      logger.warn('Попытка загрузить файл без вложения');
      return res.status(400).json({ error: 'Файл не найден' });
    }

    const maxSize = parseInt(process.env.MAX_FILE_SIZE, 10);
    if (file.size > maxSize) {
      logger.warn(`Файл превышает допустимый размер: ${file.size} байт`);
      return res.status(400).json({ error: 'Размер файла превышает допустимый лимит' });
    }

    const fileUrl = await uploadFileToBlobAndReturnLink(file);

    logger.info(`Файл успешно загружен: ${file.originalname}, URL: ${fileUrl}`);
    res.status(201).json({ message: 'Файл успешно загружен', fileUrl });
  } catch (error) {
    logger.error(`Ошибка при загрузке файла: ${error.message}`);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
};
  

const deleteFile = async (req, res) => {
  try {
    const { fileName } = req.params;

    if (!fileName) {
      logger.warn('Попытка удаления файла без указания имени');
      return res.status(400).json({ error: 'Имя файла не указано' });
    }

    await deleteFileFromBlob(fileName);
    logger.info(`Файл успешно удален: ${fileName}`);
    res.status(200).json({ message: `Файл "${fileName}" успешно удален` });
  } catch (error) {
    logger.error(`Ошибка при удалении файла "${req.params.fileName}": ${error.message}`);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
};

const deleteFileByURL=async(url)=>{
  try{
    if(!url){
      logger.warn('Попытка удаления файла без указания URL');
      return res.status(400).json({ error: 'URL не указано' });
    }
    await deleteFileFromBlobByUrl(url);
    logger.info(`Файл успешно удален: ${url}`);
    res.status(200).json({ message: `Файл "${url}" успешно удален` });
  }catch(error){
    logger.error(`Ошибка при удалении файла по URL "${url}": ${error.message}`);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }

}

const downloadFile = async (req, res) => {
  try {
    const { fileName } = req.params;

    if (!fileName) {
      logger.warn('Попытка создания ссылки для скачивания без указания имени файла');
      return res.status(400).json({ error: 'Имя файла не указано' });
    }

    const fileUrl = await generateTemporaryUrl(fileName);
    logger.info(`Создана ссылка для скачивания файла: ${fileName}, URL: ${fileUrl}`);
    res.status(200).json({ url: fileUrl });
  } catch (error) {
    logger.error(`Ошибка при создании ссылки для скачивания файла "${req.params.fileName}": ${error.message}`);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
};

module.exports = { uploadFile, uploadFileAndRetunLink, createFile, deleteFile, downloadFile,deleteFileByURL };
