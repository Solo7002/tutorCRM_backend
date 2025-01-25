const { BlockedUser } = require('../../models/dbModels');

exports.createBlockedUser = async (req, res) => {
  try {
    const blockedUser = await BlockedUser.create(req.body);
    res.status(201).json(blockedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getBlockedUsers = async (req, res) => {
  try {
    const blockedUsers = await BlockedUser.findAll();
    res.status(200).json(blockedUsers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getBlockedUserById = async (req, res) => {
  try {
    const blockedUser = await BlockedUser.findByPk(req.params.id);
    if (!blockedUser) return res.status(404).json({ error: "BlockedUser not found" });
    res.status(200).json(blockedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateBlockedUser = async (req, res) => {
  try {
    const blockedUser = await BlockedUser.findByPk(req.params.id);
    if (!blockedUser) return res.status(404).json({ error: "BlockedUser not found" });
    
    await blockedUser.update(req.body);
    res.status(200).json(blockedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteBlockedUser = async (req, res) => {
  try {
    const blockedUser = await BlockedUser.findByPk(req.params.id);
    if (!blockedUser) return res.status(404).json({ error: "BlockedUser not found" });
    
    await blockedUser.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};