import mongoose from "mongoose";

const listSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "complete"],
        default: "pending"
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    assignedTo:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    }
}, { timestamps: true });

export default mongoose.model("List", listSchema);
