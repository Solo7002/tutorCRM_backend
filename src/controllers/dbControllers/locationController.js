const { Location } = require('../../models/dbModels');

exports.createLocation = async (req, res) => {
  try {
    const location = await Location.create(req.body);
    res.status(201).json(location);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getLocations = async (req, res) => {
  try {
    const locations = await Location.findAll();
    res.status(200).json(locations);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getLocationById = async (req, res) => {
  try {
    const location = await Location.findByPk(req.params.id);
    if (!location) return res.status(404).json({ error: "Location not found" });
    res.status(200).json(location);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateLocation = async (req, res) => {
  try {
    const location = await Location.findByPk(req.params.id);
    if (!location) return res.status(404).json({ error: "Location not found" });
    
    await location.update(req.body);
    res.status(200).json(location);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteLocation = async (req, res) => {
  try {
    const location = await Location.findByPk(req.params.id);
    if (!location) return res.status(404).json({ error: "Location not found" });
    
    await location.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};