
const { logger } = require('@azure/storage-blob');
const controllerDoneFiles=require('../controllers/dbControllers/doneHometaskFileController');
const {deleteFileByURL}=require('../controllers/fileController');
async function deleteOldFiles() {
    try{
        const arrayFiles = await controllerDoneFiles.getOldDoneHometaskFilePaths();

        console.log(arrayFiles);
        
        if(arrayFiles){
            arrayFiles.forEach(path => {
                deleteFileByURL(path);
            });
        }

    }
    catch(error){
        logger.error(`Ошибка при очистке ${error.message}`);
    }
}

module.exports={
    deleteOldFiles
}