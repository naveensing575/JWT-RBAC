import Task, { ITask } from "../models/Task";

// Create Task Service
export const createTask = async (taskData: ITask) => {
  const newTask = new Task(taskData);
  return await newTask.save();
};

// Get All Tasks Service
export const getAllTasks = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;
  return await Task.find().skip(skip).limit(limit);
};

// Update Task Service
export const updateTask = async (id: string, taskData: Partial<ITask>) => {
  return await Task.findByIdAndUpdate(id, taskData, { new: true });
};

// Delete Task Service
export const deleteTask = async (id: string) => {
  return await Task.findByIdAndDelete(id);
};
