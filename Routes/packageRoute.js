const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { check } = require('express-validator')
const packageController = require('../Controllers/packageController')

// @route Get api/booking
// @desc get all package
router.get('/', auth, packageController.getAllPackage)

// @create POST api/booking/package
// @desc   Create Package
router.post('/', [ auth, [
        check('name', 'Name field cant be empty').not().isEmpty(),
        check('type', 'Type field cant be empty').not().isEmpty(),
        check('price', 'price field is required').not().isEmpty(),
        ]], packageController.createPackage)

// @create POST api/booking/add_on
// @desc   Updating pakage
router.put('/:id', auth, packageController.updatePackage)

// @create DELETE api/booking/add_on
// @desc   Delete Package
router.delete('/:id', auth, packageController.deletePackage)

module.exports = router 