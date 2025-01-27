const express = require('express');
const router = express.Router();
const blockedUserController = require('../../controllers/dbControllers/blockedUserController');

router.post('/', blockedUserController.createBlockedUser);
router.get('/', blockedUserController.getBlockedUsers);
router.get('/search', blockedUserController.searchBlockedUsers);
router.get('/:id', blockedUserController.getBlockedUserById);
router.put('/:id', blockedUserController.updateBlockedUser);
router.delete('/:id', blockedUserController.deleteBlockedUser);

module.exports = router;