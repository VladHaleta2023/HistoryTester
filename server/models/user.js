import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    opis: {
        type: String,
        required: false
    }
},
{
    timestamps: true
});

export default mongoose.model("User", UserSchema);