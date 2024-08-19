const router = require('express').Router();
const userController = require('../controllers/user.controller');
const upload = require("../middlewares/upload");
const verifyUser = require("../middlewares/authentication");


router.post('/user' , upload.single("profileImage")  , userController.userSignUp);
router.post('/verifyOtp' , userController.verifyOtp)
router.delete('/deleteUser/:userId', verifyUser , userController.deleteUser);
router.get('/usersGetById/:userId', verifyUser , userController.getById);
router.post('/updateUser' , upload.single("profileImage") , userController.updateUser);
router.get('/getAllUsers' , verifyUser , userController.getAll)
router.post('/userSignin' , userController.userSignIn);


module.exports = router

