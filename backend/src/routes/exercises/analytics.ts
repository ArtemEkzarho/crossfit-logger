import { Response } from 'express';
import type { IWeightEntry } from '../../models/Exercise';
import Exercise from '../../models/Exercise';
import { buildUserNameMap } from './helpers';

// Returns the ISO week string "YYYY-Www" for a given date (Monday-based)
function isoWeekKey(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7; // Sun → 7
  d.setUTCDate(d.getUTCDate() + 4 - day); // nearest Thursday
  const jan1 = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d.getTime() - jan1.getTime()) / 86_400_000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

// Returns the Monday of the week containing `date`
function weekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay() || 7; // Sun → 7
  d.setDate(d.getDate() - day + 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Collapses daily entries into one per week (max value wins); date becomes the Monday of that week
function aggregateByWeek(history: IWeightEntry[]): Partial<IWeightEntry>[] {
  const map = new Map<string, Partial<IWeightEntry>>();
  for (const entry of history) {
    const key = isoWeekKey(entry.date);
    const existing = map.get(key);
    const val = entry.weight ?? entry.reps ?? 0;
    const existingVal = existing ? (existing.weight ?? existing.reps ?? 0) : -1;
    if (!existing || val > existingVal) {
      const { _id, weight, reps, sets, notes } = entry;
      map.set(key, { _id, weight, reps, sets, notes, date: weekStart(entry.date) });
    }
  }
  return Array.from(map.values());
}

export async function getAnalyticsByName(req: any, res: Response) {
  try {
    const name = decodeURIComponent(req.params.name);
    const days = Math.max(1, parseInt(String(req.query.days ?? '7'), 10) || 7);
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const weeklyAggregation = days >= 30;

    const allExercises = await Exercise.find({ name }).sort({ updatedAt: -1 });

    type ExerciseData = { doc: (typeof allExercises)[0]; history: unknown[]; isFallback: boolean };

    const exerciseData = allExercises
      .map((e): ExerciseData | null => {
        const recentHistory = e.weightHistory.filter((w) => w.date >= since);
        if (recentHistory.length > 0) {
          const history = weeklyAggregation ? aggregateByWeek(recentHistory) : recentHistory;
          return { doc: e, history, isFallback: false };
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
