const { Schema } = require('mongoose')

const subcategorySchema = new Schema(
    {
        category_id: { type: Schema.Types.ObjectId, ref: 'category', required: true },
        name: {type: String, required: true},
        numberOfWorkouts: {type: Number, required: true},
        img: {type: String, required: true}
    },
    {timestamps: true}
)

module.exports = subcategorySchema