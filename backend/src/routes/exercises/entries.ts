import { Response } from 'express';
import { Types } from 'mongoose';
import { getAuth } from '@clerk/express';
import Exercise from '../../models/Exercise';

export async function updateEntry(req: any, res: Response) {
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
}

export async function deleteEntry(req: any, res: Response) {
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
}
