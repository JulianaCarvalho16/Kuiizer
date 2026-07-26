const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/dashboard', authController.verifyToken, (req, res) => {
    res.status(200).json({ message: 'Bem-vindo ao dashboard protegido!', userId: req.userId });
});
router.post('/result', authController.verifyToken, authController.saveResult);
router.get('/results', authController.verifyToken, authController.getUserResults);

module.exports = router;
