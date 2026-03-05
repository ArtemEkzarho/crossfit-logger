import express from 'express';
import { requireAuth } from '@clerk/express';
import { getAnalyticsByName } from './analytics';
import { updateEntry, deleteEntry } from './entries';
import { listExercises, getExercise, logWeight, deleteExercise } from './exercises';

const router = express.Router();

router.use(requireAuth());

// Analytics — must be registered before /:name to avoid shadowing
router.get('/analytics/:name', getAnalyticsByName);

// Exercise CRUD
router.get('/', listExercises);
router.get('/:name', getExercise);
router.post('/', logWeight);
router.delete('/:name', deleteExercise);

// Entry CRUD
router.put('/:name/entries/:entryId', updateEntry);
router.delete('/:name/entries/:entryId', deleteEntry);

export default router;
