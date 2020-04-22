const Profile = require('../Models/ProfileSchema')
const { validationResult } = require('express-validator')
const ObjectID = require('mongodb').ObjectID;

// @desc  get all requests
exports.getAllRequest = async (req, res, next)=> {
    const query = { }
    const status = req.query.status
    if(status){
        query['request.status'] = status
    }
    try {
        if(!req.user.isAdmin) return res.status(401).json({errors: [{msg: "only admin is authoride here"}]})
        
        let requests = await Profile.find(query)
        .limit(10)
        .select('-car -location ')
        .populate('user', 'name email')
        res.json(requests)
    } catch (error) {
        console.log(error)
        res.status(500).send('Server Down')
    }
}

// @desc  get user profile
exports.getProfile = async (req, res, next)=> {
    try {
        if(!req.user.isAdmin) return res.status(401).json({errors: [{msg: "only admin is authoride here"}]})
        
        let profile = await Profile.findById(req.params.id)
        .select('-car -location ')
        .populate('user', 'name email')
        res.json(profile)
    } catch (error) { 
        if(err.kind == 'ObjectId')
            return res.status(400).json({msg: "Profile not found"})
        console.log(error)
        res.status(500).send('Server Down')
    }
}

// @desc  update user request profile
exports.updateRequest = async (req, res, next)=> {
    const updatedStatus = req.query.status
    const updateId = new ObjectID(req.query.update_id)
    const id = new ObjectID(req.params.id)
    console.log(id)
    console.log(updateId)
    console.log(updatedStatus)

    try {
        if(!req.user.isAdmin) return res.status(401).json({errors: [{msg: "only admin is authoride here"}]})
        // ensure status and request is picked
        if(!updatedStatus && !updateId) return res.status(401).json({errors: [{msg: "status and status id is required"}]})
     
        let profile = await Profile.findOneAndUpdate(
            {_id: req.params.id, "request._id": updateId},
            { 
                "$set": {
                    "request.$.status": updatedStatus
                }
            },
            {new: true}
        )

        res.json(profile)
    } catch (error) { 
        if(error.kind == 'ObjectId')
            return res.status(400).json({msg: "Profile not found"})
        console.log(error)
        res.status(500).send('Server Down')
    }
}