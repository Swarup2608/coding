import Problem from "./problem.model.js";
import {CreateProblemInput} from "./problem.types.js";
import {createSlug} from "../../utils/slug.js";

export async function createProblem(input: CreateProblemInput, userId: string) {
    const slug = createSlug(input.title);
    const existingProblem = await Problem.findOne({ slug });
    if (existingProblem) {
        throw new Error("[PROBLEM_EXISTS] Problem with the same title already exists");
    }
    const problem = await  Problem.create({
        ...input,
        slug,
        createdBy: userId,
    });
    return problem;
}

export async function getProblemBySlug(slug: string) {
    const problem = await Problem.findOne({ slug });
    if (!problem) {
        throw new Error("[PROBLEM_NOT_FOUND] Problem not found");
    }
    return problem;
}

export async function updateProblem(slug: string, updates: Partial<CreateProblemInput>, userId: string) {
    const problem = await Problem.findOneAndUpdate({ slug }, updates, { new: true, runValidators: true });

    if (!problem) {
        throw new Error("[PROBLEM_NOT_FOUND] Problem not found");
    }

    return problem;
}

export async function deleteProblem(slug: string, userId: string) {
    const problem = await Problem.findOneAndUpdate({ slug }, { status: "ARCHIVED" }, { new: true });
    if (!problem) {
        throw new Error("[PROBLEM_NOT_FOUND] Problem not found");
    }
    return problem;
}

export async function getAllProblems() {
    // Contest-only problems never appear in the global, public problem bank.
    const problems = await Problem.find({ status: "PUBLISHED", visibility: { $ne: "CONTEST" } });
    return problems;
}

export async function getAllProblemsForAdmin() {
    return Problem.find({ visibility: { $ne: "CONTEST" } }).sort({ createdAt: -1 });
}