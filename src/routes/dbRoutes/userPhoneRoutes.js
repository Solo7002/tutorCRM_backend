const express = require('express');
const router = express.Router();
const userPhoneController = require('../../controllers/dbControllers/userPhoneController');

router.post('/', userPhoneController.createUserPhone);
router.get('/', userPhoneController.getUserPhones);
router.get('/search', userPhoneController.searchUserPhones);
router.get('/:id', userPhoneController.getUserPhoneById);
router.put('/:id', userPhoneController.updateUserPhone);
router.delete('/:id', userPhoneController.deleteUserPhone);

module.exports = router;