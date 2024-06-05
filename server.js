const express = require('express')
const db = require('./db')
const cors = require('cors');
const bodyParser = require(`body-parser`)
const logger = require(`morgan`)
const PORT = process.env.PORT || 3001
const CategoryController = require('./controllers/CategoryController')
const WorkoutController = require('./controllers/WorkoutController')
const UserController = require('./controllers/UserController')

const app = express()

app.use(cors());
app.use(bodyParser.json())
app.use(logger(`dev`))

db.on('error', console.error.bind(console, 'MongoDB connection error:'))
db.once('open', () => {
    console.log('Connected to MongoDB')
})
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))

///////////////


app.get('/', (req, res) => res.send('This is our landing page!'))

app.get('/categories', CategoryController.getAllCategories)
app.get('/workouts', WorkoutController.getAllWorkouts)
app.get('/users', UserController.getAllUsers)

app.get('/user/:id', UserController.getUserById)
app.get('/getUserWorkouts/:userId/:year/:month/:calendarType/:selectedDate?', UserController.getUserWorkouts)
app.get('/workouts/:categoryId', WorkoutController.getWorkoutByCategory)

app.post('/api/authenticate', UserController.loginUser)
app.post('/addWorkoutToPlan', WorkoutController.addWorkoutToPlan)

app.delete('/removeFromPlan', WorkoutController.removeWorkoutFromPlan)