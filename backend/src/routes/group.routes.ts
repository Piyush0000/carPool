import express from 'express';
import {
  createGroup,
  joinGroup,
  leaveGroup,
  lockGroup,
  getUserGroups,
  getGroup,
  getAllGroups,
  matchGroups,
  getOpenGroups
} from '../controllers/group.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// Public route for getting open groups
router.route('/open')
  .get(getOpenGroups);

// All routes below are protected
router.use(protect);

router.route('/')
  .get(getAllGroups)
  .post(createGroup);

router.route('/mygroups')
  .get(getUserGroups);

router.route('/:groupId')
  .get(getGroup);

router.route('/join/:groupId')
  .post(joinGroup);

router.route('/leave/:groupId')
  .post(leaveGroup);

router.route('/match')
  .post(matchGroups);

router.route('/lock/:groupId')
  .patch(lockGroup);

export default router;