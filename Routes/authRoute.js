const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { check } = require('express-validator')
const authController = require('../controllers/authController')

router.get('/', auth, authController.getUser)

router.post('/login',  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password field can not be empty').not().isEmpty(),
    ], authController.login)

module.exports = router 