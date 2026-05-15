import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },

    required: {
        type: Boolean,
        default: false,
    },

    options: [
        {
            type: String,
            required: true,
        }
    ]
})

const pollschema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },

        description: {
            type: String,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        isAnonymous: {
            type: Boolean,
            default: true,
        },

        expiresAt: {
            type: Date,
            required: true,
        },

        isPublished: {
            type: Boolean,
            default: false,
        },

        questions: [questionSchema],
    },
    {
        timestamps: true,
    }
)

const Poll = mongoose.model("Poll", pollschema)

export default Poll