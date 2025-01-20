const { uploadFileToBlob, deleteFileFromBlob, generateTemporaryUrl } = require('../storage/azureBlob');

const uploadFile = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "Файл не найден" });
    }

    const allowedTypes = process.env.ALLOWED_FILE_TYPES.split(',');
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ error: "Недопустимый формат файла" });
    }

    const maxSize = parseInt(process.env.MAX_FILE_SIZE, 10);
    if (file.size > maxSize) {
      return res.status(400).json({ error: "Размер файла превышает допустимый лимит" });
    }

    const fileUrl = await uploadFileToBlob(file);
    res.status(201).json({ message: "Файл успешно загружен", url: fileUrl });
  } catch (error) {
    console.error("Ошибка при загрузке файла:", error.message);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
};

const deleteFile = async (req, res) => {
  try {
    const { fileName } = req.params;

    if (!fileName) {
      return res.status(400).json({ error: "Имя файла не указано" });
    }

    await deleteFileFromBlob(fileName);
    res.status(200).json({ message: `Файл "${fileName}" успешно удален` });
  } catch (error) {
    console.error("Ошибка при удалении файла:", error.message);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
};

const downloadFile = async (req, res) => {
  try {
    const { fileName } = req.params;

    if (!fileName) {
      return res.status(400).json({ error: "Имя файла не указано" });
    }

    const fileUrl = await generateTemporaryUrl(fileName);
    res.status(200).json({ url: fileUrl });
  } catch (error) {
    console.error("Ошибка при создании ссылки для скачивания:", error.message);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
};

module.exports = { uploadFile, deleteFile, downloadFile };
