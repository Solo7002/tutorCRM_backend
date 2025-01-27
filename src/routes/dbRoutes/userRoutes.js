const express = require('express');
const router = express.Router();
const userController = require('../../controllers/dbControllers/userController');

router.post('/', userController.createUser);
router.get('/', userController.getUsers);
router.get('/search', userController.searchUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;