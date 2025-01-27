import mongoose from "mongoose";

const DataSchema = new mongoose.Schema({
    testId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Test"
    },
    data1: {
        type: String,
        required: true,
        default: "Autor"
    },
    data2: {
        type: String,
        required: true,
        default: "Nazwa"
    },
},
{
    timestamps: true
});

export default mongoose.model("Data", DataSchema);