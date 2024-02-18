import { Router } from 'express';
import {
  getUsers, getUser, updateUser, updateAvatar,
} from '../controllers/users';

const router = Router();
router.get('/', getUsers);
router.get('/:id', getUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

export default router;
