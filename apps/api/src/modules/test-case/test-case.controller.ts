import {Request, Response} from "express";
import {AuthenticatedRequest} from "../../middleware/auth.middleware.js";
import {createTestCase, getTestCases, updateTestCase, deleteTestCase} from "./test-case.service.js";

export async function createTestCaseController(req: AuthenticatedRequest & {params: {problemId : string}}, res: Response) {
    try{
        const testCase = await createTestCase(req.params.problemId, req.body);
        return res.status(201).json({success: true, data: testCase});
    }
    catch (error) {
        return res.status(500).json({success: false, message: "[TEST_CASE_CREATE_FAILED] Failed to create test case", error: error instanceof Error ? error.message : String(error)});
    }
}

export async function getTestCasesController(req: Request & {params: {problemId : string}}, res: Response) {
    try{
        const testCases = await getTestCases(req.params.problemId);
        return res.status(200).json({success: true, data: testCases});
    }
    catch (error) {
        return res.status(500).json({success: false, message: "[TEST_CASES_FETCH_FAILED] Failed to fetch test cases", error: error instanceof Error ? error.message : String(error)});
    }
}

export async function updateTestCaseController(req: AuthenticatedRequest & {params: {id : string}}, res: Response) {
    try{
        const testCase = await updateTestCase(req.params.id, req.body);
        return res.status(200).json({success: true, data: testCase});
    }
    catch (error) {
        return res.status(500).json({success: false, message: "[TEST_CASE_UPDATE_FAILED] Failed to update test case", error: error instanceof Error ? error.message : String(error)});
    }
}

export async function deleteTestCaseController(req: AuthenticatedRequest & {params: {id : string}}, res: Response) {
    try{
        const testCase = await deleteTestCase(req.params.id);
        return res.status(200).json({success: true, data: testCase});
    }
    catch (error) {
        return res.status(500).json({success: false, message: "[TEST_CASE_DELETE_FAILED] Failed to delete test case", error: error instanceof Error ? error.message : String(error)});
    }
}