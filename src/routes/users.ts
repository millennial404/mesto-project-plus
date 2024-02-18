import { Router } from 'express';
import {
  createUser, getUsers, getUser, updateUser, updateAvatar,
} from '../controllers/users';

const router = Router();

router.post('/', createUser);

router.get('/', getUsers);
router.get('/:id', getUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

export default router;
