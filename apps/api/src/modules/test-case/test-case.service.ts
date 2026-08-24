import TestCase from "./test-case.model.js";
import {CreateTestCaseInput} from "./test-case.types.js";
import Problem from "../problem/problem.model.js";

export async function createTestCase(problemId: string, input: CreateTestCaseInput) {
    const problem = await Problem.findById(problemId);
    if (!problem) {
        throw new Error("[PROBLEM_NOT_FOUND] Problem not found");
    }
    const testCase = await TestCase.create({
        problemId,
        input : input.input,
        expectedOutput : input.expectedOutput,
        isSample : input.isSample || false,
    });
    return testCase;
}

export async function getTestCases(problemId: string) {
    const problem = await Problem.findById(problemId);
    if (!problem) {
        throw new Error("[PROBLEM_NOT_FOUND] Problem not found");
    }
    const testCases = await TestCase.find({ problemId }).sort({ createdAt: 1 });
    return testCases;
}

export async function updateTestCase(testCaseId: string, updates: Partial<CreateTestCaseInput>) {
    const testCase = await TestCase.findByIdAndUpdate(testCaseId, updates, { new: true, runValidators: true });
    if (!testCase) {
        throw new Error("[TEST_CASE_NOT_FOUND] Test case not found");
    }
    return testCase;
}

export async function deleteTestCase(testCaseId: string) {
    const testCase = await TestCase.findByIdAndDelete(testCaseId);
    if (!testCase) {
        throw new Error("[TEST_CASE_NOT_FOUND] Test case not found");
    }
    return testCase;
}