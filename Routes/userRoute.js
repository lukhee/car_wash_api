const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const userController = require('../Controllers/userController')
const { check } = require('express-validator')

// @access public
router.post('/',  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter password with 6 or more character').isLength({ min: 6 })
    ], userController.createUser)

//  @Desc update user info
router.put('/update_user', auth, userController.updateUser)

module.exports = router