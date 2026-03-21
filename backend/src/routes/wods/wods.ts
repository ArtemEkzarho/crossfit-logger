import { Response } from 'express';
import { getAuth } from '@clerk/express';
import { clerkClient } from '@clerk/express';
import Wod from '../../models/Wod';

async function resolveUserName(userId: string): Promise<string> {
  try {
    const user = await clerkClient.users.getUser(userId);
    return user.username || [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Unknown';
  } catch {
    return 'Unknown';
  }
}

export async function listWods(_req: unknown, res: Response) {
  try {
    const wods = await Wod.find({}).sort({ date: -1 }).limit(200);
    res.json(wods);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}

export async function createWod(req: any, res: Response) {
  try {
    const { userId } = getAuth(req);
    const wod = await Wod.create({ createdBy: userId, ...req.body });
    res.status(201).json(wod);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function deleteWod(req: any, res: Response) {
  try {
    const { userId } = getAuth(req);
    const wod = await Wod.findOneAndDelete({ _id: req.params.id, createdBy: userId });
    if (!wod) return res.status(404).json({ error: 'WOD not found or not authorized' });
    res.json({ message: 'WOD deleted' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}

export async function addResult(req: any, res: Response) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const userName = await resolveUserName(userId);

    const wod = await Wod.findByIdAndUpdate(
      req.params.id,
      { $push: { results: { userId, userName, ...req.body } } },
      { new: true }
    );

    if (!wod) return res.status(404).json({ error: 'WOD not found' });
    res.status(201).json(wod);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function deleteResult(req: any, res: Response) {
  try {
    const { userId } = getAuth(req);

    const wod = await Wod.findOneAndUpdate(
      { _id: req.params.id, 'results._id': req.params.resultId, 'results.userId': userId },
      { $pull: { results: { _id: req.params.resultId } } },
      { new: true }
    );

    if (!wod) return res.status(404).json({ error: 'Result not found or not authorized' });
    res.json(wod);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
