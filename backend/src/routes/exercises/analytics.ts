import { Response } from 'express';
import Exercise from '../../models/Exercise';
import { buildUserNameMap } from './helpers';

export async function getAnalyticsByName(req: any, res: Response) {
  try {
    const name = decodeURIComponent(req.params.name);
    const days = Math.max(1, parseInt(String(req.query.days ?? '7'), 10) || 7);
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const allExercises = await Exercise.find({ name }).sort({ updatedAt: -1 });

    type ExerciseData = { doc: (typeof allExercises)[0]; history: unknown[]; isFallback: boolean };

    const exerciseData = allExercises
      .map((e): ExerciseData | null => {
        const recentHistory = e.weightHistory.filter((w) => w.date >= since);
        if (recentHistory.length > 0) {
          return { doc: e, history: recentHistory, isFallback: false };
        }
        if (e.weightHistory.length === 0) return null;
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
    const userNameMap = await buildUserNameMap(userIds);

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
}
