const { BlockedUser } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');

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
    const { where, order } = parseQueryParams(req.query);
    const blockedUsers = await BlockedUser.findAll({ where: where || undefined, order: order || undefined });
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