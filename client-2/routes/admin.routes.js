const express = require('express');
const authenticateJWT = require('../middleware/jwt.middleware');
const adminController = require('../controllers/admin.controller');
const router = express.Router();

// router.get('/rooms', roomController.getRooms);
// router.get('/rooms/:slug', roomController.getRoomBySlug);
// router.get('/my_rooms/create', authenticateJWT(), roomController.createMyRoom);
// router.get('/my_rooms/edit/:id', authenticateJWT(), roomController.editMyRoom);
// router.delete('/my_rooms/:id', authenticateJWT(), roomController.deleteMyRoom);
router.get('/admin/rooms', authenticateJWT({ requiredRole: 'admin' }), adminController.getAllRooms);
// router.get('/rooms/:id', roomController.getRoom);
// router.get('/rooms/slug/:slug', roomController.getRoomBySlug);
// router.post('/rooms', roomController.createRoom);
router.post('/admin/rooms/:id/publish', authenticateJWT({ requiredRole: 'admin' }), adminController.updateRoomPublishStatus);
// router.put('/rooms/:id', authenticateJWT({ requiredRole: 'admin' }), roomController.updateRoom);
// router.delete('/rooms/:id', authenticateJWT({ requiredRole: 'admin' }), roomController.deleteRoom);

module.exports = router;
