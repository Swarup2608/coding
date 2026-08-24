import mongoose, { Document, Model, Schema } from "mongoose";

interface ITestCase extends Document {
  problemId: mongoose.Types.ObjectId;

  input: string;
  expectedOutput: string;

  isSample: boolean;
}

const testCaseSchema = new Schema<ITestCase>({
  problemId: { type: Schema.Types.ObjectId, required: true, },

  input: String,

  expectedOutput: String,

  isSample: Boolean,
});

const TestCase: Model<ITestCase> = mongoose.model<ITestCase>("TestCase", testCaseSchema);

export default TestCase;
