const {Workout} = require('../models');

//Read
const getAllWorkouts = async (req, res) => {
    try {
        const objectArray = await Workout.find()
        res.json(objectArray)
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

//Read
const getWorkoutById = async (req, res) => {
    try {
        const { id } = req.params
        const singleObject = await Workout.findById(id)
        if (singleObject) {
            return res.json(singleObject)
        }
        return res.status(404).send(`that Workout doesn't exist`)
    } catch (error) {
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(404).send(`That Workout doesn't exist`)
        }
        return res.status(500).send(error.message);
    }
}

//create
const createWorkout = async (req, res) => {
    try {
        const newObject = new Workout(req.body)
        await newObject.save()
        return res.status(201).json({
            newObject,
        });
    } catch (error) {
        // if (error.name === 'CastError' && error.kind === 'ObjectId') {
        //     return res.status(404).send(`That Workout doesn't exist`)
        // }
        return res.status(500).json({ error: error.message })
    }
}

//update
const updateWorkout = async (req, res) => {
    try {
        let { id } = req.params;
        let changedObject = await Workout.findByIdAndUpdate(id, req.body, { new: true })
        if (changedObject) {
            return res.status(200).json(changedObject)
        }
        throw new Error("Workout not found and can't be updated")
    } catch (error) {
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(404).send(`That Workout doesn't exist`)
        }
        return res.status(500).send(error.message);
    }
}

//delete
const deleteWorkout = async (req, res) => {
    try {
        const { id } = req.params;
        const erasedObject = await Workout.findByIdAndDelete(id)
        if (erasedObject) {
            return res.status(200).send("Workout deleted");
        }
        throw new Error("Workout not found and can't be deleted");
    } catch (error) {
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(404).send(`That Workout doesn't exist`)
        }
        return res.status(500).send(error.message);
    }
}

module.exports = {
    getAllWorkouts,
    getWorkoutById,
    createWorkout,
    updateWorkout,
    deleteWorkout
}