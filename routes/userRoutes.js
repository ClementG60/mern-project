const router = require('express').Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const uploadController = require('../controllers/uploadController');
const multer = require('multer');
const upload = multer();

//authentification
router.post('/register', authController.signUp);
router.post('/login', authController.signIn);
router.get('/logout', authController.logout);

//utilisateur
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserInfo);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.patch('/follow/:id', userController.follow);
router.patch('/unfollow/:id', userController.unfollow);

//upload
//quand on upload une image via notre POST, on traite l'image à l'aide de multer puis on fait appel à notre controller
router.post('/upload', upload.single('file'), uploadController.uploadProfil);

//pour que le router soit dispo dans toute l'application
module.exports = router