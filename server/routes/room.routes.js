const express = require('express');
const authenticateJWT = require('../middleware/jwt.middleware');
const roomController = require('../controllers/room.controller');
const router = express.Router();

router.get('/rooms', roomController.getRooms);
router.get('/admin/rooms', authenticateJWT({ requiredRole: 'admin' }), roomController.getAdminRooms);
router.post('/admin/rooms/:id/publish', authenticateJWT({ requiredRole: 'admin' }), roomController.updateRoomPublishStatus);
router.get('/rooms/my_rooms', authenticateJWT(), roomController.getMyRooms);
router.get('/rooms/my_rooms/:id', authenticateJWT(), roomController.getMyRoomById);
router.put('/rooms/my_rooms/:id', authenticateJWT(), roomController.updateMyRoom);
router.delete('/rooms/my_rooms/:id', authenticateJWT(), roomController.deleteMyRoom);
router.get('/rooms/:id', roomController.getRoom);
router.get('/rooms/slug/:slug', roomController.getRoomBySlug);
router.post('/rooms', roomController.createRoom);
router.put('/rooms/:id', authenticateJWT({ requiredRole: 'admin' }), roomController.updateRoom);
router.delete('/rooms/:id', authenticateJWT({ requiredRole: 'admin' }), roomController.deleteRoom);

module.exports = router;
