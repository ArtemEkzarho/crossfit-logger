import express, { Response } from 'express';
import { clerkClient, requireAuth, getAuth } from '@clerk/express';
import { Types } from 'mongoose';
import Exercise from '../models/Exercise';

const router = express.Router();

// All routes require authentication
router.use(requireAuth());

// GET all exercises for authenticated user
router.get('/', async (req, res: Response) => {
  try {
    const { userId } = getAuth(req);
    const exercises = await Exercise.find({ userId }).sort({ updatedAt: -1 });
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET all exercises from all users for analytics
router.get('/analytics/all', async (req, res: Response) => {
  try {
    const exercises = await Exercise.find({}).sort({ updatedAt: -1 });

    const userIds = [...new Set(exercises.map((e) => e.userId))];
    const userNameMap = new Map<string, string>();
    await Promise.all(
      userIds.map(async (id) => {
        try {
          const user = await clerkClient.users.getUser(id);
          const name = user.username || [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Unknown';
          userNameMap.set(user.id, name);
        } catch {
          // user not found or Clerk error — skip
        }
      })
    );

    const enriched = exercises.map((e) => ({
      ...e.toObject(),
      userName: userNameMap.get(e.userId) || 'Unknown',
    }));

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET last 7 days of entries for a specific exercise from all users (for analytics)
// Users with no entries in the last 7 days get their all-time max at today's date (isFallback: true)
router.get('/analytics/:name', async (req, res: Response) => {
  try {
    const name = decodeURIComponent(req.params.name);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const allExercises = await Exercise.find({ name }).sort({ updatedAt: -1 });

    type ExerciseData = { doc: typeof allExercises[0]; history: unknown[]; isFallback: boolean };

    const exerciseData = allExercises
      .map((e): ExerciseData | null => {
        const recentHistory = e.weightHistory.filter((w) => w.date >= sevenDaysAgo);
        if (recentHistory.length > 0) {
          return { doc: e, history: recentHistory, isFallback: false };
        }
        if (e.weightHistory.length === 0) return null; // never logged — exclude
        // All-time max: prefer weight, fall back to reps
        const maxEntry = e.weightHistory.reduce((best, w) => {
          const v = w.weight ?? w.reps ?? 0;
          const bv = best.weight ?? best.reps ?? 0;
          return v > bv ? w : best;
        });
        const { _id, weight, reps, sets, notes } = maxEntry;
        return {
          doc: e,
          history: [{ _id, weight, reps, sets, notes, date: new Date() }],
          isFallback: true,
        };
      })
      .filter((x): x is ExerciseData => x !== null);

    const userIds = [...new Set(exerciseData.map((e) => e.doc.userId))];
    const userNameMap = new Map<string, string>();
    await Promise.all(
      userIds.map(async (id) => {
        try {
          const user = await clerkClient.users.getUser(id);
          const displayName = user.username || [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Unknown';
          userNameMap.set(user.id, displayName);
        } catch {
          // user not found or Clerk error — skip
        }
      })
    );

    const enriched = exerciseData.map(({ doc, history, isFallback }) => ({
      ...doc.toObject(),
      weightHistory: history,
      userName: userNameMap.get(doc.userId) || 'Unknown',
      isFallback,
    }));

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET single exercise by name
router.get('/:name', async (req, res: Response) => {
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
});

// POST log weight — upsert by userId+name, push entry to weightHistory
router.post('/', async (req, res: Response) => {
  try {
    const { userId } = getAuth(req);
    const { name, weight, reps, sets, notes, date } = req.body;

    const entry = {
      weight,
      reps,
      sets,
      notes,
      date: date ? new Date(date) : new Date(),
    };

    const exercise = await Exercise.findOneAndUpdate(
      { userId, name },
      { $push: { weightHistory: entry } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    res.status(201).json(exercise);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// PUT update a single weight entry
router.put('/:name/entries/:entryId', async (req, res: Response) => {
  try {
    const { userId } = getAuth(req);

    if (!Types.ObjectId.isValid(req.params.entryId)) {
      return res.status(400).json({ error: 'Invalid entry ID' });
    }
    const entryId = new Types.ObjectId(req.params.entryId);

    const { weight, reps, sets, notes, date } = req.body;

    const update: Record<string, unknown> = {};
    if (weight !== undefined) update['weightHistory.$.weight'] = weight;
    if (reps !== undefined) update['weightHistory.$.reps'] = reps;
    if (sets !== undefined) update['weightHistory.$.sets'] = sets;
    if (notes !== undefined) update['weightHistory.$.notes'] = notes;
    if (date !== undefined) update['weightHistory.$.date'] = new Date(date);

    const exercise = await Exercise.findOneAndUpdate(
      { userId, name: req.params.name, 'weightHistory._id': entryId },
      { $set: update },
      { new: true }
    );

    if (!exercise) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    res.json(exercise);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// DELETE a single weight entry
router.delete('/:name/entries/:entryId', async (req, res: Response) => {
  try {
    const { userId } = getAuth(req);

    if (!Types.ObjectId.isValid(req.params.entryId)) {
      return res.status(400).json({ error: 'Invalid entry ID' });
    }
    const entryId = new Types.ObjectId(req.params.entryId);

    const exercise = await Exercise.findOneAndUpdate(
      { userId, name: req.params.name },
      { $pull: { weightHistory: { _id: entryId } } },
      { new: true }
    );

    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }

    res.json(exercise);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// DELETE entire exercise record
router.delete('/:name', async (req, res: Response) => {
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
});

export default router;
