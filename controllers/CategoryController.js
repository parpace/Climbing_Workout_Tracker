const {Category} = require('../models');

//Read
const getAllCategories = async (req, res) => {
    try {
        const objectArray = await Category.find()
        res.json(objectArray)
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

//Read
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params
        const singleObject = await Category.findById(id)
        if (singleObject) {
            return res.json(singleObject)
        }
        return res.status(404).send(`that Category doesn't exist`)
    } catch (error) {
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(404).send(`That Category doesn't exist`)
        }
        return res.status(500).send(error.message);
    }
}

//create
const createCategory = async (req, res) => {
    try {
        const newObject = new Category(req.body)
        await newObject.save()
        return res.status(201).json({
            newObject,
        });
    } catch (error) {
        // if (error.name === 'CastError' && error.kind === 'ObjectId') {
        //     return res.status(404).send(`That Category doesn't exist`)
        // }
        return res.status(500).json({ error: error.message })
    }
}

//update
const updateCategory = async (req, res) => {
    try {
        let { id } = req.params;
        let changedObject = await Category.findByIdAndUpdate(id, req.body, { new: true })
        if (changedObject) {
            return res.status(200).json(changedObject)
        }
        throw new Error("Category not found and can't be updated")
    } catch (error) {
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(404).send(`That Category doesn't exist`)
        }
        return res.status(500).send(error.message);
    }
}

//delete
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const erasedObject = await Category.findByIdAndDelete(id)
        if (erasedObject) {
            return res.status(200).send("Category deleted");
        }
        throw new Error("Category not found and can't be deleted");
    } catch (error) {
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(404).send(`That Category doesn't exist`)
        }
        return res.status(500).send(error.message);
    }
}

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
}