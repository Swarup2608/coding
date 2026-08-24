import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import {createSubmission, getSubmissionById, getUserSubmissions, getAllSubmissionsForAdmin} from "./submission.service.js";

export async function createSubmissionController(req: AuthenticatedRequest, res: Response) {
    try{
        const submission = await createSubmission(req.user!.userId,req.body);
        return res.status(201).json({success: true, data: submission});
    }
    catch (error) {
        return res.status(500).json({success: false, message: "[SUBMISSION_CREATE_FAILED] Failed to create submission", error: error instanceof Error ? error.message : String(error)});
    }
}

export async function getSubmissionByIdController(req: AuthenticatedRequest & {params: {id : string}}, res: Response) {
    try{
        const submission = await getSubmissionById(req.params.id, req.user!.userId);
        if(!submission){
            return res.status(404).json({success: false, message: "[SUBMISSION_NOT_FOUND] Submission not found"});
        }
        return res.status(200).json({success: true, data: submission});
    }
    catch (error) {
        return res.status(500).json({success: false, message: "[SUBMISSION_FETCH_FAILED] Failed to fetch submission", error: error instanceof Error ? error.message : String(error)});
    }
}

export async function getAllSubmissionsForAdminController(req: AuthenticatedRequest, res: Response) {
    try{
        const submissions = await getAllSubmissionsForAdmin();
        return res.status(200).json({success: true, data: submissions});
    }
    catch (error) {
        return res.status(500).json({success: false, message: "[SUBMISSIONS_FETCH_FAILED] Failed to fetch submissions", error: error instanceof Error ? error.message : String(error)});
    }
}

export async function getUserSubmissionsController(req: AuthenticatedRequest, res: Response) {
    try{
        const submissions = await getUserSubmissions(req.user!.userId);
        return res.status(200).json({success: true, data: submissions});
    }
    catch (error) {
        return res.status(500).json({success: false, message: "[SUBMISSIONS_FETCH_FAILED] Failed to fetch submissions", error: error instanceof Error ? error.message : String(error)});
    }
}
