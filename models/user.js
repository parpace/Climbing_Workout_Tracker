const { Schema } = require('mongoose')

const userSchema = new Schema(
    {
        username: {type: String, required: true},
        password: {type: String, required: true},
        profileName: {type: String, required: true},
        plannedWorkouts: [{
            date: Date,
            workouts: [{ type: Schema.Types.ObjectId, ref: 'Workout' }]
        }],
        loggedWorkouts: [{ 
            date: Date,
            workouts: [{ type: Schema.Types.ObjectId, ref: 'Workout' }]
        }]
    },
    {timestamps: true}
)

module.exports = userSchema