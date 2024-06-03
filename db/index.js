const mongoose = require('mongoose')

mongoose
    .connect(`mongodb+srv://parpace:tyghbn11@student-cluster.ta01bhl.mongodb.net/?retryWrites=true&w=majority&appName=student-cluster`)
    .then(() => {
        console.log('Successfully connected to MongoDB.')
    })
    .catch(e => {
        console.error('Connection error', e.message)
    })
mongoose.set('debug', true)


const db = mongoose.connection

module.exports = db