import mongoose from "mongoose";

const StatSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    testId: {
        type: mongoose.Types.ObjectId,
        ref: "Test",
        required: true
    },
    userQuestionCount: {
        type: Number,
        required: true,
        default: 0
    },
    bestPercent: {
        type: Number,
        required: true,
        default: 0
    },
    repetitions: {
        type: Number,
        required: true,
        default: 0
    }
},
{
    timestamps: true
});

export default mongoose.model("Stat", StatSchema);