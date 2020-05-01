const express = require('express')
const connectDB = require('./config/db')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const cors = require('cors')
const compression = require('compression')
const userRoute = require('./Routes/userRoute')
const authRoute = require('./Routes/authRoute')
const profileRoute = require('./Routes/profileRoute')
const packageRoute = require('./Routes/packageRoute')
const adminRoute = require('./Routes/adminRoute')

const app = express()

// Connect Database
connectDB()


app.use(helmet());
app.use(compression());

// Init Middleware
app.use(cors())

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Defined Routes
app.use('/api/package', packageRoute)
app.use('/api/user', userRoute)
app.use('/api/auth', authRoute)
app.use('/api/profile', profileRoute)
app.use('/api/admin', adminRoute)

// Page Not-found Route
app.use('*', (req, res, next)=> {
    res.status(500).json({msg: "Page not found"})
})

app.use(helmet());
app.use(compression())

const PORT = process.env.PORT || 6060

app.listen(PORT, ()=> console.log(`app listen at port ${PORT}`))