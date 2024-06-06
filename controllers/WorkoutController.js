const {Workout, User} = require('../models')

//Read
const getAllWorkouts = async (req, res) => {
    try {
        const objectArray = await Workout.find()
        res.json(objectArray)
    } catch (error) {
        return res.status(500).send(error.message)
    }
}

//Read
const getWorkoutByCategory = async (req, res) => {
    const categoryId = req.params.categoryId
    try {
        const workouts = await Workout.find({ category_id: categoryId })
        if (workouts) {
            return res.json(workouts)
        }
        return res.status(404).send(`No workouts found for that category`)
    } catch (error) {
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(404).send(`Invalid category ID`)
        }
        return res.status(500).send(error.message);
    }
}

//create
const addWorkoutToPlan = async (req, res) => {
    const { userId, workoutId, date } = req.body

    try {
        // Find the user by ID
        const user = await User.findById(userId)
        if (!user) { return res.status(404).send(`User not found`) }

        // Find the planned workout entry for the specific date
        let plannedWorkout = user.plannedWorkouts.find(
            (entry) => entry.date.toISOString() === new Date(date).toISOString()
        )

        if (plannedWorkout) {
            // If the entry exists for that date, add the workout to the workouts array
            plannedWorkout.workouts.push(workoutId)
        } else {
            // If the entry does not exist, create a new one
            user.plannedWorkouts.push({
                date: new Date(date),
                workouts: [workoutId]
            })
        }

        // Save the updated user document
        await user.save()

        return res.status(200).json(user)
    } catch (error) {
        console.error('Error adding workout to plan:', error)
        return res.status(500).send(error.message)
    }
}

const addWorkoutToLog = async (req, res) => {
    const { userId, workoutId, date } = req.body

    try {
        // Find the user by ID
        const user = await User.findById(userId)
        if (!user) { return res.status(404).send(`User not found`) }

        // Find the planned workout entry for the specific date
        let loggedWorkout = user.loggedWorkouts.find(
            (entry) => entry.date.toISOString() === new Date(date).toISOString()
        )

        if (loggedWorkout) {
            // If the entry exists for that date, add the workout to the loggedWorkouts array
            loggedWorkout.workouts.push(workoutId)
        } else {
            // If the entry does not exist, create a new one
            user.loggedWorkouts.push({
                date: new Date(date),
                workouts: [workoutId]
            })
        }

        // Save the updated user document
        await user.save()

        return res.status(200).json(user)
    } catch (error) {
        console.error('Error adding workout to log:', error)
        return res.status(500).send(error.message)
    }
}

//delete
// I couldn't figure this out on my own. I was using to filter to get rid of the workoutId that was equal to the one that was clicked, and even with ChatGPT we couldn't figure out what was wrong with it. So i asked ChatGPT if it had another way that it thinks would be nice to write the function, and it gave me this findIndex and splice solution. I'm still trying to understand the logic there though.
const removeWorkoutFromPlan = async (req, res) => {
    const { userId, workoutId, date } = req.body

    try {
        // Find the user by ID
        const user = await User.findById(userId).populate('plannedWorkouts.workouts')

        if (!user) { return res.status(404).send(`User not found`) }

        // Find the planned workout entry for the specific date
        const plannedWorkout = user.plannedWorkouts.find(entry => entry.date.toISOString() === date)
        if (!plannedWorkout) {
            return res.status(404).send('Planned workout not found for the specified date')
        }

        const index = plannedWorkout.workouts.findIndex(w => w._id.toString() === workoutId)
        if (index === -1) {
            return res.status(404).send('Workout not found in the planned workouts')
        }

        plannedWorkout.workouts.splice(index, 1)

        // Save the updated user document
        await user.save()

        return res.status(200).json(user)
    } catch (error) {
        console.error('Error removing workout to plan:', error)
        return res.status(500).send(error.message)
    }
}

module.exports = {
    getAllWorkouts,
    getWorkoutByCategory,
    addWorkoutToPlan,
    removeWorkoutFromPlan,
    addWorkoutToLog
}