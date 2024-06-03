const {Subcategory} = require('../models');

//Read
const getAllSubcategories = async (req, res) => {
    try {
        const objectArray = await Subcategory.find()
        res.json(objectArray)
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

//Read
const getSubcategoryById = async (req, res) => {
    try {
        const { id } = req.params
        const singleObject = await Subcategory.findById(id)
        if (singleObject) {
            return res.json(singleObject)
        }
        return res.status(404).send(`that Subcategory doesn't exist`)
    } catch (error) {
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(404).send(`That Subcategory doesn't exist`)
        }
        return res.status(500).send(error.message);
    }
}

//create
const createSubcategory = async (req, res) => {
    try {
        const newObject = new Subcategory(req.body)
        await newObject.save()
        return res.status(201).json({
            newObject,
        });
    } catch (error) {
        // if (error.name === 'CastError' && error.kind === 'ObjectId') {
        //     return res.status(404).send(`That Subcategory doesn't exist`)
        // }
        return res.status(500).json({ error: error.message })
    }
}

//update
const updateSubcategory = async (req, res) => {
    try {
        let { id } = req.params;
        let changedObject = await Subcategory.findByIdAndUpdate(id, req.body, { new: true })
        if (changedObject) {
            return res.status(200).json(changedObject)
        }
        throw new Error("Subcategory not found and can't be updated")
    } catch (error) {
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(404).send(`That Subcategory doesn't exist`)
        }
        return res.status(500).send(error.message);
    }
}

//delete
const deleteSubcategory = async (req, res) => {
    try {
        const { id } = req.params;
        const erasedObject = await Subcategory.findByIdAndDelete(id)
        if (erasedObject) {
            return res.status(200).send("Subcategory deleted");
        }
        throw new Error("Subcategory not found and can't be deleted");
    } catch (error) {
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(404).send(`That Subcategory doesn't exist`)
        }
        return res.status(500).send(error.message);
    }
}

module.exports = {
    getAllSubcategories,
    getSubcategoryById,
    createSubcategory,
    updateSubcategory,
    deleteSubcategory
}