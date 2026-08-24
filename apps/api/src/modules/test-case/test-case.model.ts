import mongoose, { Document, Model, Schema } from "mongoose";

export interface ITestCase extends Document {
  problemId: mongoose.Types.ObjectId;

  input: string;
  expectedOutput: string;

  isSample: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const testCaseSchema = new Schema<ITestCase>(
  {
    problemId: { type: Schema.Types.ObjectId, ref: "Problem", required: true, index: true, },

    input: { type: String, required: true, },

    expectedOutput: { type: String, required: true, },

    isSample: { type: Boolean, default: false, },
  },
  {
    timestamps: true,
  }
);

const TestCase: Model<ITestCase> = mongoose.model<ITestCase>("TestCase", testCaseSchema);

export default TestCase;
