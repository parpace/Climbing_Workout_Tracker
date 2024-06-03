const { Schema } = require('mongoose')

const categorySchema = new Schema(
    {
        name: {type: String, required: true},
        img: {type: String, required: true},
    },
    {timestamps: true}
)

module.exports = categorySchema