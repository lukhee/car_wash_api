const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { check } = require('express-validator')
const adminController = require('../Controllers/adminController')

// @route Get api/admin
// @desc get all request
router.get('/request', auth, adminController.getAllRequest)

// @route Get api/admin/id
// @desc get user profile
router.get('/request/:id', auth, adminController.getProfile)

// @route put api/admin/id
// @desc get user profile
router.put('/request/:id', auth, adminController.updateRequest)

module.exports = router 