const { Location } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Op } = require('sequelize');

exports.createLocation = async (req, res) => {
  try {
    const location = await Location.create(req.body);
    res.status(201).json(location);
  } catch (error) {
    console.error('Error in createLocation:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getLocations = async (req, res) => {
  try {
    const { where, order } = parseQueryParams(req.query);
    const locations = await Location.findAll({
      where: where || undefined,
      order: order || undefined,
    });
    res.status(200).json(locations);
  } catch (error) {
    console.error('Error in getLocations:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getLocationById = async (req, res) => {
  try {
    const location = await Location.findByPk(req.params.id);
    if (!location) return res.status(404).json({ error: "Location not found" });
    res.status(200).json(location);
  } catch (error) {
    console.error('Error in getLocationById:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.searchLocations = async (req, res) => {
  try {
    const { city, country, latitude, longitude, address } = req.query;
    const whereConditions = {};

    if (city) whereConditions.City = { [Op.like]: `%${city}%` };
    if (country) whereConditions.Country = { [Op.like]: `%${country}%` };
    if (latitude) whereConditions.Latitude = parseFloat(latitude);
    if (longitude) whereConditions.Longitude = parseFloat(longitude);
    if (address) whereConditions.Address = { [Op.like]: `%${address}%` };

    const locations = await Location.findAll({
      where: whereConditions,
    });

    if (!locations.length) {
      return res.status(404).json({ success: false, message: 'No locations found matching the criteria.' });
    }

    return res.status(200).json({ success: true, data: locations });
  } catch (error) {
    console.error('Error in searchLocations:', error);
    return res.status(500).json({ success: false, message: 'Server error, please try again later.' });
  }
};

exports.updateLocation = async (req, res) => {
  try {
    const location = await Location.findByPk(req.params.id);
    if (!location) return res.status(404).json({ error: "Location not found" });
    
    await location.update(req.body);
    res.status(200).json(location);
  } catch (error) {
    console.error('Error in updateLocation:', error);
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
    console.error('Error in deleteLocation:', error);
    res.status(400).json({ error: error.message });
  }
};