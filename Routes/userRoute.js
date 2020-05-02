const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const { check } = require('express-validator')

// @access public
router.post('/',  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter password with 6 or more character').isLength({ min: 6 })
    ], userController.createUser)


// router.post('/',  [
//     check('name', 'Name is required').not().isEmpty(),
//     check('email', 'Please include a valid email').isEmail(),
//     check('password', 'Please enter password with 6 or more character').isLength({ min: 6 })], (req, res)=>{
//         res.send("hello user")
//     } )

module.exports = router