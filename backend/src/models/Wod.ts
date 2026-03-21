import { Document, model, Schema, Types } from 'mongoose';

export const WOD_TYPES = ['forTime', 'amrap', 'emom', 'tabata', 'custom'] as const;
export type WodType = (typeof WOD_TYPES)[number];

export interface IWodMovement {
  name: string;
  reps?: number;
  weight?: number;
  sets?: number;
}

export interface IWodResult {
  _id: Types.ObjectId;
  userId: string;
  userName: string;
  timeSeconds?: number;
  rounds?: number;
  reps?: number;
  totalReps?: number;
  notes?: string;
  rxd: boolean;
  loggedAt: Date;
}

export interface IWod extends Document {
  createdBy: string;
  date: Date;
  type: WodType;
  name?: string;
  movements: IWodMovement[];
  notes?: string;
  results: IWodResult[];
  createdAt: Date;
  updatedAt: Date;
}

const WodMovementSchema = new Schema<IWodMovement>(
  {
    name: { type: String, required: true, trim: true },
    reps: Number,
    weight: Number,
    sets: Number,
  },
  { _id: false }
);

const WodResultSchema = new Schema<IWodResult>({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  timeSeconds: Number,
  rounds: Number,
  reps: Number,
  totalReps: Number,
  notes: { type: String, trim: true },
  rxd: { type: Boolean, default: false },
  loggedAt: { type: Date, default: Date.now },
});

const WodSchema = new Schema<IWod>(
  {
    createdBy: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
    type: { type: String, enum: WOD_TYPES, required: true },
    name: { type: String, trim: true },
    movements: { type: [WodMovementSchema], default: [] },
    notes: { type: String, trim: true },
    results: { type: [WodResultSchema], default: [] },
  },
  { timestamps: true }
);

WodSchema.index({ date: -1 });

export default model<IWod>('Wod', WodSchema);
