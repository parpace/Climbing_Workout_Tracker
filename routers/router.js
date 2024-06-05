const express = require('express')
const router = express.Router()
const { addWorkoutToPlan, getWorkoutsForDate } = require('../controllers/userController')

router.post('/user/:userId/addWorkout', addWorkoutToPlan)
router.get('/user/:userId/workouts', getWorkoutsForDate)

module.exports = router