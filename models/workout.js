const { Schema } = require('mongoose')

const workoutSchema = new Schema(
    {
        subcategory_id: { type: Schema.Types.ObjectId, ref: 'subcategory', required: true },
        name: {type: String, required: true},
        duration: {type: Number, required: true},
        description: {type: String, required: true},
        sets: {type: Number, required: true},
        reps: {type: Number, required: true},
        rest: {type: String, required: true},
    },
    {timestamps: true}
)

module.exports = workoutSchema