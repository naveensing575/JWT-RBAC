import { Request, Response } from "express";
import {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
} from "../services/taskService";

// Create Task
export const create = async (req: Request, res: Response) => {
  try {
    const task = await createTask(req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// Get All Tasks
export const getAll = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10; // Default 10 tasks per page

    const tasks = await getAllTasks(page, limit);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Update Task
export const update = async (req: Request, res: Response) => {
  try {
    const task = await updateTask(req.params.id, req.body);
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// Delete Task
export const remove = async (req: Request, res: Response) => {
  try {
    await deleteTask(req.params.id);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
