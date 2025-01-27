import mongoose from "mongoose";

const TestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User"
    },
    data1Name: {
        type: String,
        required: true,
        default: "Autor"
    },
    data2Name: {
        type: String,
        required: true,
        default: "Nazwa"
    },
    imageUrl: {
        type: String,
        required: false,
        default: null
    }
},
{
    timestamps: true
});

export default mongoose.model("Test", TestSchema);