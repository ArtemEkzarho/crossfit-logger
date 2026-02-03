import express, { Response } from 'express';
import { requireAuth, getAuth } from '@clerk/express';
import Exercise from '../models/Exercise';

const router = express.Router();

// All routes require authentication
router.use(requireAuth());

// GET all exercises for authenticated user
router.get('/', async (req, res: Response) => {
  try {
    const { userId } = getAuth(req);
    const exercises = await Exercise.find({ userId })
      .sort({ date: -1 });

    res.json(exercises);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET all exercises from all users for analytics
router.get('/analytics/all', async (req, res: Response) => {
  try {
    const exercises = await Exercise.find({})
      .sort({ date: -1 });

    res.json(exercises);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET single exercise
router.get('/:id', async (req, res: Response) => {
  try {
    const { userId } = getAuth(req);
    const exercise = await Exercise.findOne({ 
      _id: req.params.id, 
      userId 
    });
    
    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }
    
    res.json(exercise);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST create new exercise
router.post('/', async (req, res: Response) => {
  try {
    const { userId } = getAuth(req);
    const exercise = new Exercise({
      ...req.body,
      userId
    });
    
    await exercise.save();
    res.status(201).json(exercise);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// PUT update exercise
router.put('/:id', async (req, res: Response) => {
  try {
    const { userId } = getAuth(req);
    const exercise = await Exercise.findOneAndUpdate(
      { _id: req.params.id, userId },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }
    
    res.json(exercise);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// DELETE exercise
router.delete('/:id', async (req, res: Response) => {
  try {
    const { userId } = getAuth(req);
    const exercise = await Exercise.findOneAndDelete({ 
      _id: req.params.id, 
      userId 
    });
    
    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }
    
    res.json({ message: 'Exercise deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;