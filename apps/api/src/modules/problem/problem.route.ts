import {Router} from 'express';
import {createProblemController, getProblemBySlugController, updateProblemController, deleteProblemController, getAllProblemsController, getAllProblemsForAdminController} from './problem.controller.js';
import {authenticate} from '../../middleware/auth.middleware.js';
import {requireAdmin} from '../../middleware/admin.middleware.js';

const router = Router();

router.post('/', authenticate, requireAdmin, createProblemController);
router.get('/admin/all', authenticate, requireAdmin, getAllProblemsForAdminController);
router.get('/:slug', getProblemBySlugController);
router.patch('/:slug', authenticate, requireAdmin, updateProblemController);
router.delete('/:slug', authenticate, requireAdmin, deleteProblemController);
router.get('/', getAllProblemsController);

export default router;