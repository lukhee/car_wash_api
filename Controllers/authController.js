const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../Models/UserSchema')
const config = require('config')

exports.getUser = async (req, res, next)=> {
    const { id } = req.user
    try{
        const user = await User.findById(id).select("-password")
        res.status(201).json(user)
    } catch(err){
        console.error(err.message)
        res.status(500).json({
            msg: 'server down'
        })
    }
}

exports.login = async (req, res, next)=> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body

    try{
        let user = await User.findOne({ email })
        if(!user){
            return res.status(400).json({errors: [{msg: "invalid credential"}]})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch) {
            return res.status(400).json({errors: [{msg: "invalid credential"}]}) 
        }

        const payload = { 
            user: {
                id: user._id,
                isAdmin: user.isAdmin
            }
        }

        jwt.sign(
            payload, 
            config.get('jwtSecret'),
            {expiresIn: 6000}, 
            (err, token)=>{
                if(err) throw err;
                res.json({ token })
            } )
    } catch(err){
        console.error(err.message)
        res.status(500).send("server error")
    }
}