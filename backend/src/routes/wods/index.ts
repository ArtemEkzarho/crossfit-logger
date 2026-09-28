import express from 'express';
import { requireUser } from '../../middleware/requireUser';
import { listWods, createWod, deleteWod, addResult, deleteResult } from './wods';

const router = express.Router();

router.use(requireUser);

router.get('/', listWods);
router.post('/', createWod);
router.delete('/:id', deleteWod);

router.post('/:id/results', addResult);
router.delete('/:id/results/:resultId', deleteResult);

export default router;
