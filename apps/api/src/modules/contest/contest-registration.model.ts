import mongoose, { Document, Model, Schema } from "mongoose";

export interface IContestRegistration extends Document {
  contestId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  registeredAt: Date;
}

const contestRegistrationSchema = new Schema<IContestRegistration>({
  contestId: { type: Schema.Types.ObjectId, ref: "Contest", required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  registeredAt: { type: Date, default: Date.now },
});

contestRegistrationSchema.index({ contestId: 1, userId: 1 }, { unique: true });

const ContestRegistration: Model<IContestRegistration> = mongoose.model<IContestRegistration>(
  "ContestRegistration",
  contestRegistrationSchema
);

export default ContestRegistration;
