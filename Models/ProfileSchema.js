const mongoose = require('mongoose')

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    contact: {
        home: {
            type: Number,
            required: true
        },
        work: {
            type: Number,
        }
    },
    car:[
        {
            brand: {
                type: String,
                required: true
            },
            color: {
                type: String,
                required: true
            },
            plate_no: {
                type: String,
                required: true
            }
        }
    ],
    location:[
        {
            street: {
                type: String,
                required: true
            },
            state: {
                type: String,
                required: true
            },
            country: {
                type: String,
                required: true
            }
        }
    ],
    request:[
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            },
            package: {
                type: String,
            },
            date: {
                type: Date,
            },
            car: 
                {
                    _id: {
                        type: mongoose.Schema.Types.ObjectId,
                    },
                    brand: {
                        type: String,
                    },
                    color: {
                        type: String,
                    },
                    plate_no: {
                        type: String,
                    }
                },
            location:
                {
                    _id: {
                        type: mongoose.Schema.Types.ObjectId,
                    },
                    street: {
                        type: String,
                        required: true
                    },
                    state: {
                        type: String,
                        required: true
                    },
                    country: {
                        type: String,
                        required: true
                    }
                },
            status: {
                type: String,
                default: "pending"
            },
            payment: {
                totalCost: {
                    type: Number,
                },
                paymentMethod: {
                    type: String,
                },
                paymentStatus: {
                    type: String,
                }
            }
        }
    ]
}, {
    timestamps: true
})

module.exports = Profile = mongoose.model('profile', ProfileSchema )
