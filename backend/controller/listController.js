import listModel from "../model/listModel.js";
import User from "../model/userModel.js"

const create = async (req, res) => {
  try {
    const { title, description, status, assignedTo } = req.body;
    const userId = req.user._id;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }
    const newList = new listModel({title,description,status,
      createdBy: userId,
      assignedTo: assignedTo || userId, 
    });
    const savedList = await newList.save();
    res.status(201).json({
      message: "Task created successfully",
      data: savedList,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const userId = req.user._id;

    const myTasks = await listModel.find({ createdBy: userId, assignedTo: userId })
    .populate("assignedTo", "name email");

    const assignedByMe = await listModel.find({ createdBy: userId, assignedTo: { $ne: userId } })
    .populate("assignedTo", "name email");
    const assignedToMe = await listModel.find({ assignedTo: userId, createdBy: { $ne: userId } })
    .populate("createdBy", "name email");

    res.status(200).json({ myTasks, assignedByMe, assignedToMe });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllUsers= async(req,res)=>{
  try {
    const users = await User.find().select("_id name email");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}


const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, assignedTo } = req.body;
    const userId = req.user._id;

    const task = await listModel.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    
    if (task.createdBy.toString() === userId.toString()) {
      task.title = title;
      task.description = description;
      task.status = status;
      task.assignedTo = assignedTo || userId;
    } 
    else if (task.assignedTo.toString() === userId.toString()) {
      task.status = status;
    } 
    else {
      return res.status(403).json({ message: "Not authorized to update this task" });
    }

    await task.save();
    res.status(200).json({ message: "Task updated successfully", data: task });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const deletedTask = await listModel.findOneAndDelete({ _id: id, createdBy: userId });

    if (!deletedTask) return res.status(404).json({ message: "Task not found or not authorized" });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export { create, getAllTasks, updateTask, deleteTask,getAllUsers };
