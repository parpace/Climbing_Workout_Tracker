const mongoose = require('mongoose')
const categorySchema = require('./category')
const workoutSchema = require('./workout')
const userSchema = require('./user')
const logSchema = require('./log')

//convert schema to model with the same name

const Category = mongoose.model('Category', categorySchema)
const Workout = mongoose.model('Workout', workoutSchema)
const User = mongoose.model('User', userSchema)
const Log = mongoose.model('Log', logSchema)

module.exports = {
  Category,
  Workout,
  User,
  Log
}