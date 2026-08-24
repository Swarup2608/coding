import {Router} from 'express';
import {createTestCaseController, getTestCasesController, updateTestCaseController, deleteTestCaseController} from './test-case.controller.js';
import {authenticate} from '../../middleware/auth.middleware.js';
import {requireAdmin} from '../../middleware/admin.middleware.js';

const router = Router();

router.post('/problem/:problemId', authenticate, requireAdmin, createTestCaseController);
router.get('/problem/:problemId',authenticate, requireAdmin, getTestCasesController);
router.patch('/:id', authenticate, requireAdmin, updateTestCaseController);
router.delete('/:id', authenticate, requireAdmin, deleteTestCaseController);

export default router;