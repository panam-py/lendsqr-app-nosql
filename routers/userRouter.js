const express = require('express')
const authController = require('../controllers/authController')
const userController = require('../controllers/userController')

const router = express.Router()

router.post('/register', authController.signUp)
router.post('/login', authController.login)
router.get('/', userController.getAllUsers)
router.post('/', userController.getUser)

router.use(authController.protect)
router.patch('/fund', userController.fund)
router.patch('/withdraw', userController.withdraw)
router.patch('/transfer', userController.transfer)

module.exports = router