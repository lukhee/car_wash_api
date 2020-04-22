const { validationResult } = require('express-validator')
const gravatar = require('gravatar')
const User = require('../Models/UserSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require("config")

exports.createUser = async  (req, res, next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body

    // search if user exist
    try{
        let user = await User.findOne({ email })
        if(user){
            return res.status(400).json({errors: [{msg: "user with email already exist"}]})
        }

        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        })

        user = new User({
            name, email, password, avatar
        })

        const salt = await bcrypt.genSalt(10)

        user.password = await bcrypt.hash(password, salt)

        await user.save() 

        const payload = { 
            user: {
                id: user._id
            }
        }

        jwt.sign(
            payload, 
            config.get('jwtSecret'),
            {expiresIn: 360000}, 
            (err, token)=>{
                if(err) throw err;
                res.json({ token })
            } )
    } catch(err){
        console.error(err.message)
        res.status(500).send("server error")
    }
}