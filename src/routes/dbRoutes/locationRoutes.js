const express = require('express');
const router = express.Router();
const locationController = require('../../controllers/dbControllers/locationController');

router.post('/', locationController.createLocation);
router.get('/', locationController.getLocations);
router.get('/search', locationController.searchLocations);
router.get('/:id', locationController.getLocationById);
router.put('/:id', locationController.updateLocation);
router.delete('/:id', locationController.deleteLocation);

module.exports = router;