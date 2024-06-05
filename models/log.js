const { Schema } = require('mongoose')

const logSchema = new Schema(
    {
        user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        workout_id: { type: Schema.Types.ObjectId, ref: 'Workout', required: true },
        date: {type: String, required: true},
        weight: {type: String, required: true},
    },
    {timestamps: true}
)

module.exports = logSchema