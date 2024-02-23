import { Router } from 'express';
import {
  getUsers, getUser, updateUser, updateAvatar, getCurrentUser,
} from '../controllers/users';
import { validateId, validateUpdateAvatar, validateUpdateUser } from '../middlewares/validation';

const router = Router();
router.get('/me', getCurrentUser);
router.get('/', getUsers);
router.get('/:id', validateId('id'), getUser);
router.patch('/me', validateUpdateUser('name', 'about'), updateUser);
router.patch('/me/avatar', validateUpdateAvatar('avatar'), updateAvatar);

export default router;
