const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const profileController = require('../controllers/profileCotroller')
const { check } = require('express-validator')

// @route  Get api/profile
// @access Pirvate
// @desc   Get current user profile
router.get('/', auth, profileController.getMyProfile)


// @route  Post api/profile
// @access Pirvate
// @desc   Create or Update profile
router.post('/',  [ auth, [
    check('home', 'Phone No is required').not().isEmpty(),
    check('street', 'Street is required').not().isEmpty(),
    check('state', 'State is required').not().isEmpty(),
    check('country', 'Country is required').not().isEmpty(), 
    ]], profileController.UpdateProfile)

// @route  Put api/Location
// @access Pirvate
// @desc   Put user laction
router.put('/location', auth, [
    check('street', 'street is required').not().isEmpty(),
    check('state', 'State is required').not().isEmpty(),
    check('country', 'country is required').not().isEmpty(),
], profileController.addLocation)

// @route  Delete api/Location
// @access Pirvate
// @desc   Delete user location
router.delete('/location/:id', auth,  profileController.deleteLocation)

// @route  Put api/car
// @access Pirvate
// @desc   Put user car
router.put('/car',  auth, [
    check('brand', 'Car brand is required').not().isEmpty(),
    check('color', 'Car color is required').not().isEmpty(),
    check('plate_no', 'plate_no is required').not().isEmpty()
], profileController.addCar)

// @route  Delete api/Car
// @access Pirvate
// @desc   Delete user car
router.delete('/car/:id', auth, profileController.deleteCar)

// @route  Post api/profile/request
// @access Pirvate
// @desc   Delete user car
router.post('/request_wash', [[auth],
    check('package', 'Package is required').not().isEmpty(),
    check('date', 'Date is required').not().isEmpty(),
    check('carId', 'You need to select a car').not().isEmpty(),
], profileController.requestWash)


// @route  Delete api/profile/
// @access Pirvate
// @desc   cancelled/delete a request
router.delete('/request_cancel/:id', auth, profileController.requestCancelled)


// @route  Post api/profile/payment
// @access public
// @desc   online payment using stript
router.post('/payment', profileController.payment)


module.exports = router