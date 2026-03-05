import { Response } from 'express';
import { getAuth } from '@clerk/express';
import Exercise from '../../models/Exercise';

export async function listExercises(req: any, res: Response) {
  try {
    const { userId } = getAuth(req);
    const exercises = await Exercise.find({ userId }).sort({ updatedAt: -1 });
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}

export async function getExercise(req: any, res: Response) {
  try {
    const { userId } = getAuth(req);
    const exercise = await Exercise.findOne({ userId, name: req.params.name });

    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }

    res.json(exercise);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}

export async function logWeight(req: any, res: Response) {
  try {
    const { userId } = getAuth(req);
    const { name, weight, reps, sets, notes, date } = req.body;

    const entry = { weight, reps, sets, notes, date: date ? new Date(date) : new Date() };

    const exercise = await Exercise.findOneAndUpdate(
      { userId, name },
      { $push: { weightHistory: entry } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    res.status(201).json(exercise);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function deleteExercise(req: any, res: Response) {
  try {
    const { userId } = getAuth(req);
    const exercise = await Exercise.findOneAndDelete({ userId, name: req.params.name });

    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }

    res.json({ message: 'Exercise deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
