const Profile = require('../Models/ProfileSchema')
const User = require('../Models/UserSchema')
const { validationResult } = require('express-validator')
const config = require('config')
const stripe = require("stripe")(config.get('stripe_secrete_key'));

// @desc  View Profile
exports.getMyProfile = async (req, res, next)=> {
    try {
        const profile = await Profile.findOne({user: req.user.id})
            .populate({
                path: "user",
                select: ['-password', '-createdAt', '-updatedAt']
            })
        res.json(profile)
    } catch (error) {
        console.log(error)
        res.status(500).send('Server Down')
    }
}

// @desc  Create / Update profile
exports.UpdateProfile = async (req, res, next)=> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        home,
        work,
        street,
        state,
        country
    } = req.body

// build profile object
    const profileFields = {};
    profileFields.user = req.user.id

    profileFields.contact = {}
    if(home) profileFields.contact.home = home
    if(work) profileFields.contact.work = work

    profileFields.location = {}
        if(street) profileFields.location.street = street
        if(state) profileFields.location.state = state
        if(country) profileFields.location.country = country

    try {
        let profile = await Profile.findOne({user:  req.user.id})

        // update Profile
        if(profile){
            profile = await Profile.findOneAndUpdate(
                {user: req.user.id},
                {$set: profileFields},
                {new: true}
            )
            return res.json(profile)
        }

        // create if not found
        profile = new Profile(profileFields)
        await profile.save()
        res.json(profile)
    } catch (error) {
        console.log(error)
        res.status(500).send('Server Down')
    }
}

// Add Location
exports.addLocation = async (req, res, next)=> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        street,
        state,
        country
    } = req.body

    const newLocation = { street, state, country }
    try {
        const profile = await Profile.findOne({user: req.user.id})
        console.log(profile)

        // check if the length is more than 3
        if(profile.location.length > 2){
            return res.status(400).json({errors: [{msg: "You cant have more than 3 address"}]})
        }

        // Add New Location if less than 3
        profile.location.unshift(newLocation)
        profile.save()
        res.json(profile)
    } catch (error) {
        console.log(error)
        res.status(500).send('Server Down')
    }
}


// Delete Location
exports.deleteLocation = async (req, res, next)=> {
    try {
        const profile = await Profile.findOne({ user: req.user.id })

        const removeIndex = profile.location.map(item=>item._id).indexOf(req.params.id)
        if(!removeIndex) return res.status(400).json({ errors: [{msg: 'location id not found'}] })

        profile.location.splice(removeIndex, 1)

        await profile.save()
        res.json(profile)
    } catch (error) {
        console.log(error)
        res.status(500).send('Server Down')
    }

}

// Add new car or create car
exports.addCar = async(req, res, next)=> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        brand,
        color,
        plate_no
    } = req.body
    const newCar = {
        brand, color, plate_no
    }

    try {
        const profile = await Profile.findOne({ user: req.user.id })

        profile.car.unshift(newCar)
        await profile.save()
        res.json(profile)
    } catch (error) {
        console.log(error)
        res.status(500).send('Server Down')
    }
}

// Delete car
exports.deleteCar = async (req, res, next)=> {
    try {
        const profile = await Profile.findOne({ user: req.user.id })

        const removeIndex = profile.car.map(item=>item._id).indexOf(req.params.id)
        if(!removeIndex) return res.status(400).json({ errors: [{msg: 'car id not found'}] })
        profile.car.splice(removeIndex, 1)

        await profile.save()
        res.json(profile)
    } catch (error) {
        console.log(error)
        res.status(500).send('Server Down')
    }

}

// @Desc Request wash
exports.requestWash = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        package,
        date,
        carId,
        locationId,
        totalCost,
        token,
    } = req.body

    // create requestObject model
    const requestObj = {user: req.user.id, package, date}
        requestObj.payment = {}
        requestObj.payment.totalCost = totalCost

    // create paypal model
    const body = {
        source: token.id,
        amount: totalCost,
        currency: "usd"
    };

    const stripeChargeCallback = async (stripeErr, stripeRes) => {
        console.log("i am here")
        if (stripeErr) return res.status(500).send({ error: stripeErr });
        try {
            console.log("payment success")
                const profile = await Profile.findOne({ user: req.user.id })
                // find car properties
                let carObj = profile.car.find(ele=>  ele._id.toString() === carId)
                requestObj.car = carObj

                // find location properties
                let locationObj = profile.location.find(ele=>  ele._id.toString() === locationId)
                requestObj.location = locationObj

                profile.request.unshift(requestObj)

                await profile.save()
                res.json(profile)
        } catch (error) {
            console.log(error)
            res.status(500).send('Server Down')
        }
    }

    stripe.charges.create(body, stripeChargeCallback());
};

// @desc cancell request
exports.requestCancelled = async (req, res, next) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id })
        // find the object that needs update and check it status
        let cloneRequest = profile.request.find(ele => ele._id.toString() === req.params.id )
        if(!cloneRequest || cloneRequest.status !== 'pending') return res.status(400).json({ errors: [{msg: 'update cant be done'}] })

        const updatedField  = profile.request.map(ele => {
            if(ele._id.toString() === req.params.id){
                ele.status = "cancelled"
                }
                return ele
            })
        profile.request = updatedField
        await profile.save()
        res.json(profile)
        // update the object status

        // insert  back and save
    } catch (error) {
        console.log(error)
        res.status(500).send('Server Down')
    }
}

// @Desc delete account
exports.deleteAccount = async (req, res, next) => {
    try {
        const profile = await Profile.findOneAndDelete({user: req.user.id})
        const user = await User.findByIdAndDelete(req.user.id)
        res.json({msg: "user deleted succeccfully"})
    } catch (error) {
        console.log(error)
        res.status(500).send('Server Down')
    }
}

