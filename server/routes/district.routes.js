const express = require('express');
const districtController = require('../controllers/district.controller');
const router = express.Router();

router.get('/districts/:district_code/wards', districtController.getWardsByDistrictCode);

module.exports = router;
