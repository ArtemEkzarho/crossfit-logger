import express from 'express';
import { requireAuth } from '@clerk/express';
import { listWods, createWod, deleteWod, addResult, deleteResult } from './wods';

const router = express.Router();

router.use(requireAuth());

router.get('/', listWods);
router.post('/', createWod);
router.delete('/:id', deleteWod);

router.post('/:id/results', addResult);
router.delete('/:id/results/:resultId', deleteResult);

export default router;
