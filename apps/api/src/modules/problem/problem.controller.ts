import {Request, Response} from "express";
import {createProblem, getProblemBySlug, updateProblem, deleteProblem, getAllProblems, getAllProblemsForAdmin} from "./problem.service.js";
import {AuthenticatedRequest} from "../../middleware/auth.middleware.js";

export async function createProblemController(req: AuthenticatedRequest, res: Response) {
    try{
        const problem = await createProblem(req.body, req.user!.userId);
        return res.status(201).json({success: true, data: problem});
    }
    catch (error) {
        return res.status(500).json({success: false, message: "[PROBLEM_CREATE_FAILED] Failed to create problem", error: error instanceof Error ? error.message : String(error)});
    }
}

export async function getProblemBySlugController(req: Request & {params: {slug : string}}, res: Response) {
    try{
        const problem = await getProblemBySlug(req.params.slug);
        if(!problem){
            return res.status(404).json({success: false, message: "[PROBLEM_NOT_FOUND] Problem not found"});
        }
        return res.status(200).json({success: true, data: problem});
    }
    catch (error) {
        return res.status(500).json({success: false, message: "[PROBLEM_FETCH_FAILED] Failed to fetch problem", error: error instanceof Error ? error.message : String(error)});
    }
}

export async function updateProblemController(req: AuthenticatedRequest & {params: {slug : string}}, res: Response) {
    try{
        const problem = await updateProblem(req.params.slug, req.body, req.user!.userId);
        if(!problem){
            return res.status(404).json({success: false, message: "[PROBLEM_NOT_FOUND] Problem not found"});
        }
        return res.status(200).json({success: true, data: problem});
    }
    catch (error) {
        return res.status(500).json({success: false, message: "[PROBLEM_UPDATE_FAILED] Failed to update problem", error: error instanceof Error ? error.message : String(error)});
    }
}

export async function deleteProblemController(req: AuthenticatedRequest & {params: {slug : string}}, res: Response) {
    try{
        const problem = await deleteProblem(req.params.slug, req.user!.userId);
        if(!problem){
            return res.status(404).json({success: false, message: "[PROBLEM_NOT_FOUND] Problem not found"});
        }
        return res.status(200).json({success: true, data: problem});
    }
    catch (error) {
        return res.status(500).json({success: false, message: "[PROBLEM_DELETE_FAILED] Failed to delete problem", error: error instanceof Error ? error.message : String(error)});
    }
}

export async function getAllProblemsController(req: Request, res: Response) {
    try{
        const problems = await getAllProblems();
        return res.status(200).json({success: true, data: problems});
    }
    catch (error) {
        return res.status(500).json({success: false, message: "[PROBLEMS_FETCH_FAILED] Failed to fetch problems", error: error instanceof Error ? error.message : String(error)});
    }
}

export async function getAllProblemsForAdminController(req: Request, res: Response) {
    try{
        const problems = await getAllProblemsForAdmin();
        return res.status(200).json({success: true, data: problems});
    }
    catch (error) {
        return res.status(500).json({success: false, message: "[PROBLEMS_FETCH_FAILED] Failed to fetch problems", error: error instanceof Error ? error.message : String(error)});
    }
}