import { celebrate, Joi } from 'celebrate';

export const validateId = (id: string) => celebrate({
  params: Joi.object()
    .keys({
      [id]: Joi.string()
        .alphanum()
        .length(24),
    }),
});

export const validateLogin = (email: string, password: string) => celebrate({
  body: Joi.object()
    .keys({
      [email]: Joi.string()
        .required()
        .email(),
      [password]: Joi.string()
        .required(),
    }),
});

export const validateCreateUser = (
  email: string,
  password: string,
  name: string,
  about: string,
  avatar: string,
) => celebrate({
  body: Joi.object()
    .keys({
      [email]: Joi.string()
        .required()
        .email(),
      [password]: Joi.string()
        .required(),
      [name]: Joi.string(),
      [about]: Joi.string(),
      [avatar]: Joi.string(),
    }),
});

export const validateCreateCard = (name: string, link: string) => celebrate({
  body: Joi.object()
    .keys({
      [name]: Joi.string()
        .required()
        .min(2)
        .max(30),
      [link]: Joi.string()
        .required()
        .uri(),
    }),
});

export const validateUpdateUser = (name: string, about: string) => celebrate({
  body: Joi.object()
    .keys({
      [name]: Joi.string(),
      [about]: Joi.string(),
    }),
});

export const validateUpdateAvatar = (avatar: string) => celebrate({
  body: Joi.object()
    .keys({
      [avatar]: Joi.string(),
    }),
});
