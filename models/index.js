const mongoose = require('mongoose')
const categorySchema = require('./category')
const subcategorySchema = require('./subcategory')
const workoutSchema = require('./workout')
const userSchema = require('./user')
const logSchema = require('./log')

//convert schema to model with the same name

const Category = mongoose.model('category', categorySchema)
const Subcategory = mongoose.model('subcategory', subcategorySchema)
const Workout = mongoose.model('workout', workoutSchema)
const User = mongoose.model('user', userSchema)
const Log = mongoose.model('log', logSchema)

module.exports = {
  Category,
  Subcategory,
  Workout,
  User,
  Log
}