import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getUsers, getUser, updateUser, updateAvatar, getCurrentUser,
} from '../controllers/users';

const router = Router();
router.get('/me', getCurrentUser);
router.get('/', getUsers);
router.get('/:id', getUser);
router.patch('/me', celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string(),
      about: Joi.string(),
    }),
}), updateUser);
router.patch('/me/avatar', celebrate({
  body: Joi.object()
    .keys({
      avatar: Joi.string(),
    }),
}), updateAvatar);

export default router;
