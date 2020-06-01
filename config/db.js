const mongoose = require('mongoose')
const config = require('config')
const db = config.get('mongoURI')
const localDB = config.get('localURL')
const User = require('../Models/UserSchema')
const bcrypt = require('bcrypt')

const userObj = {
    name: "Olatunji Balogun",
    email: "lukheebalo@gmail.com",
    password: "password",
    isAdmin: true
}

const connectDB = async ()=> {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });

        let user = await User.findOne({ isAdmin: true })
        if(!user){
            const salt = await bcrypt.genSalt(10)
            userObj.password = await bcrypt.hash("password", salt)
            user = new User(userObj)
            await user.save()
        }

        console.log('mongodb connected ...')
    } catch(err) {
        console.error(err.message)
        // exit process on failure
        process.exit(1);
    }
}

module.exports = connectDB