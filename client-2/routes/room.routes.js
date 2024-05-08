const express = require('express');
const authenticateJWT = require('../middleware/jwt.middleware');
const roomController = require('../controllers/room.controller');
const router = express.Router();

// router.get('/rooms', roomController.getRooms);
router.get('/rooms/:slug', roomController.getRoomBySlug);
router.get('/my_rooms/create', authenticateJWT(), roomController.createMyRoom);
router.get('/my_rooms/edit/:id', authenticateJWT(), roomController.editMyRoom);
router.delete('/my_rooms/:id', authenticateJWT(), roomController.deleteMyRoom);
router.get('/my_rooms', authenticateJWT(), roomController.getMyRooms);
// router.get('/rooms/:id', roomController.getRoom);
// router.get('/rooms/slug/:slug', roomController.getRoomBySlug);
router.post('/rooms', roomController.createRoom);
router.put('/rooms/:id', roomController.updateRoom);
// router.put('/rooms/:id', authenticateJWT({ requiredRole: 'admin' }), roomController.updateRoom);
// router.delete('/rooms/:id', authenticateJWT({ requiredRole: 'admin' }), roomController.deleteRoom);

module.exports = router;
