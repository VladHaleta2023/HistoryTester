import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
    dataId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Data"
    },
    imageUrl: {
        type: String,
        required: true,
        default: null
    },
},
{
    timestamps: true
});

export default mongoose.model("Image", ImageSchema);