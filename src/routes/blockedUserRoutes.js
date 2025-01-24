const express = require('express');
const router = express.Router();
const blockedUserController = require('../controllers/blockedUserController');

router.post('/', blockedUserController.createBlockedUser);
router.get('/', blockedUserController.getBlockedUsers);
router.get('/:id', blockedUserController.getBlockedUserById);
router.put('/:id', blockedUserController.updateBlockedUser);
router.delete('/:id', blockedUserController.deleteBlockedUser);

module.exports = router;