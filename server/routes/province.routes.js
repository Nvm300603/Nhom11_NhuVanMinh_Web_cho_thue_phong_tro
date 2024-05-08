const express = require('express');
const provinceController = require('../controllers/province.controller');
const router = express.Router();

router.get('/provinces', provinceController.getProvinces);
router.get('/provinces/:province_code/districts', provinceController.getDistrictsByProvinceCode);

module.exports = router;
