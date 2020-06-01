const Package = require('../Models/PackageSchema')
const { validationResult } = require('express-validator')

// @desc  get all Packages
exports.getAllPackage = async (req, res, next)=> {
    try {
        const package = await Package.find().select(['-requests'])
        res.json(package)
    } catch (error) {
        console.log(error)
        res.status(500).send('Server Down')
    }
}

// @desc Create selections and update
exports.createPackage = async (req, res, next)=> {
    // check for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        name,
        type,
        price,
        description
    } = req.body

    // build package/add_on object
    const packageField = { user: req.user.id, name, type, price, description }
    try {
        // check if name is created
        let checkIfExist = await Package.findOne({name : name})
        if(checkIfExist != null) return res.status(401).json({errors: [{msg: "name already occured"}]})

        // create new package
        const package = new Package(packageField)
        await package.save()
        res.json(package)
    } catch (error) {
        console.log(error)
        res.status(500).send('Server Down')
    }
}

// @desc update package
exports.updatePackage = async (req, res, next)=> {
    const {
        name,
        type,
        price,
        description,
    } = req.body 
    let user = req.user.id

    // build package object
    const package = { user, name, type, price, description}

    try {
        // find by id and update
        let updatedPackage = await Package.findOneAndUpdate(
            { _id: req.params.id },
            { $set: package },
            { new: true }
        )

        return res.json(updatedPackage)

    } catch (error) {
        if(err.kind == 'ObjectId')
            return res.status(400).json({msg: "Profile not found"})
        console.log(error)
        res.status(500).send('Server Down')
    }
}

// @desc Delete package by ID
exports.deletePackage = async (req, res, next)=> {
    try {
        let package = await Package.findOneAndDelete({_id: req.params.id})
        console.log(package)

        res.json({msg: "package successfully deleted"})

    } catch (error) {
        if(err.kind == 'ObjectId')
            return res.status(400).json({msg: "Profile not found"})
        console.log(error)
        res.status(500).send('Server Down')
    }
}