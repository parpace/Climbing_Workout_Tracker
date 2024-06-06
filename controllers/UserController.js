const {User, Workout} = require('../models');

const getPlannedUserWorkouts = async (req, res) => {
    try {
        const { userId, year, month, calendarType, selectedDate } = req.params

        // Find user by ID
        const user = await User.findById(userId)
            .populate({
                path: calendarType === 'planned' ? 'plannedWorkouts.workouts' : 'loggedWorkouts',
                model: 'Workout'
            })
            .exec()

        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }    

        if (selectedDate) {
            // Fetch workouts for the specific date
            const specificDate = new Date(selectedDate)
            const workouts = calendarType === 'planned'
                ? user.plannedWorkouts.filter(workout => new Date(workout.date).toDateString() === specificDate.toDateString())
                : user.loggedWorkouts.filter(workout => new Date(workout.date).toDateString() === specificDate.toDateString())

            console.log('Workouts for specific date:', workouts)
            return res.status(200).json(workouts)
        } else {
            // Fetch workouts for the entire month
            const yearInt = parseInt(year, 10)
            const monthInt = parseInt(month, 10)

            // Get the relevant workouts based on the calendar type
            const workouts = calendarType === 'planned'
                ? user.plannedWorkouts.filter(workout => {
                    const workoutDate = new Date(workout.date)
                    return workoutDate.getFullYear() === yearInt && workoutDate.getMonth() === monthInt
                })
                : user.loggedWorkouts.filter(workout => {
                    const workoutDate = new Date(workout.date)
                    return workoutDate.getFullYear() === yearInt && workoutDate.getMonth() === monthInt
                })

            // Respond with the workouts
            res.status(200).json(workouts)
        }
    } catch (error) {
        console.error('Error fetching user workouts:', error)
        res.status(500).json({ error: 'Error fetching user workouts' })
    }
}

const getLoggedUserWorkouts = async (req, res) => {
    try {
        const { userId, year, month, calendarType, selectedDate } = req.params

        // Find user by ID
        const user = await User.findById(userId)
            .populate({
                path: calendarType === 'planned' ? 'plannedWorkouts.workouts' : 'loggedWorkouts',
                model: 'Workout'
            })
            .exec()

        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }    

        if (selectedDate) {
            // Fetch workouts for the specific date
            const specificDate = new Date(selectedDate)
            const workouts = calendarType === 'planned'
                ? user.plannedWorkouts.filter(workout => new Date(workout.date).toDateString() === specificDate.toDateString())
                : user.loggedWorkouts.filter(workout => new Date(workout.date).toDateString() === specificDate.toDateString())

            console.log('Workouts for specific date:', workouts)
            return res.status(200).json(workouts)
        } else {
            // Fetch workouts for the entire month
            const yearInt = parseInt(year, 10)
            const monthInt = parseInt(month, 10)

            // Get the relevant workouts based on the calendar type
            const workouts = calendarType === 'planned'
                ? user.plannedWorkouts.filter(workout => {
                    const workoutDate = new Date(workout.date)
                    return workoutDate.getFullYear() === yearInt && workoutDate.getMonth() === monthInt
                })
                : user.loggedWorkouts.filter(workout => {
                    const workoutDate = new Date(workout.date)
                    return workoutDate.getFullYear() === yearInt && workoutDate.getMonth() === monthInt
                })

            // Respond with the workouts
            res.status(200).json(workouts)
        }
    } catch (error) {
        console.error('Error fetching user workouts:', error)
        res.status(500).json({ error: 'Error fetching user workouts' })
    }
}

//Read
const getAllUsers = async (req, res) => {
    try {
        const objectArray = await User.find()
        res.json(objectArray)
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

//Read
const getUserById = async (req, res) => {
    try {
        const { id } = req.params
        const singleObject = await User.findById(id)
        if (singleObject) {
            return res.json(singleObject)
        }
        return res.status(404).send(`that User doesn't exist`)
    } catch (error) {
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(404).send(`That User doesn't exist`)
        }
        return res.status(500).send(error.message);
    }
}

//Read
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({ username, password })
        if (user) {
            return res.json({ id: user._id })
        } else {
            return res.status(401).send('Invalid username or password')
        }
    } catch (error) {
        return res.status(500).send(error.message)
    }
}

//create
const createUser = async (req, res) => {
    try {
        const newObject = new User(req.body)
        await newObject.save()
        return res.status(201).json({
            newObject,
        });
    } catch (error) {
        // if (error.name === 'CastError' && error.kind === 'ObjectId') {
        //     return res.status(404).send(`That User doesn't exist`)
        // }
        return res.status(500).json({ error: error.message })
    }
}

//update
const updateUser = async (req, res) => {
    try {
        let { id } = req.params;
        let changedObject = await User.findByIdAndUpdate(id, req.body, { new: true })
        if (changedObject) {
            return res.status(200).json(changedObject)
        }
        throw new Error("User not found and can't be updated")
    } catch (error) {
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(404).send(`That User doesn't exist`)
        }
        return res.status(500).send(error.message);
    }
}

//delete
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const erasedObject = await User.findByIdAndDelete(id)
        if (erasedObject) {
            return res.status(200).send("User deleted");
        }
        throw new Error("User not found and can't be deleted");
    } catch (error) {
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(404).send(`That User doesn't exist`)
        }
        return res.status(500).send(error.message);
    }
}

const addWorkoutToPlan = async (req, res) => {
    try {
        const { userId } = req.params
        const { date, workoutId } = req.body
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).send('User not found')
        }
        if (!user.workoutPlans) {
            user.workoutPlans = []
        }
        user.workoutPlans.push({ date, workoutId })
        await user.save()
        res.status(200).send('Workout added to plan')
    } catch (error) {
        res.status(500).send(error.message)
    }
}

const getWorkoutsForDate = async (req, res) => {
    try {
        const { userId } = req.params
        const { date } = req.query
        const user = await User.findById(userId).populate('workoutPlans.workoutId')
        if (!user) {
            return res.status(404).send('User not found')
        }
        const workoutsForDate = user.workoutPlans.filter(plan => plan.date === date)
        res.json(workoutsForDate.map(plan => plan.workoutId))
    } catch (error) {
        res.status(500).send(error.message)
    }
}


module.exports = {
    getAllUsers,
    getUserById,
    loginUser,
    createUser,
    updateUser,
    deleteUser,
    addWorkoutToPlan,
    getWorkoutsForDate,
    getPlannedUserWorkouts,
    getLoggedUserWorkouts
}