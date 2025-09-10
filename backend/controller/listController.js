import listModel from "../model/listModel.js";

const create = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const userId = req.user._id;   
    if (!title || !description)
      return res.status(400).json({ message: "Title and description are required" });

    const newList = new listModel({ title, description, status, user: userId });
    const savedList = await newList.save();

    res.status(201).json({ message: "Todo created successfully", data: savedList });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



const getAllTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    const task = await listModel.find({ user: userId });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const task = await listModel.findOne({ _id: id, user: userId });
    if (!task) return res.status(404).json({ message: "Todo not found" });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const userId = req.user._id;
    const updatedTask = await listModel.findOneAndUpdate(
      { _id: id, user: userId },
      { title, description, status },
      { new: true }
    );

    if (!updatedTask) return res.status(404).json({ message: "Todo not found" });
    res.status(200).json({ message: "Todo updated successfully", data: updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const deletedTask = await listModel.findOneAndDelete({ _id: id, user: userId });
    if (!deletedTask) return res.status(404).json({ message: "Todo not found" });

    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export { create, getAllTasks, getTaskById, updateTask, deleteTask };
