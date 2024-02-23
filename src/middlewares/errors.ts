// eslint-disable-next-line max-classes-per-file
export class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class BadRequestError extends CustomError {
  constructor(message: string = 'Переданы некорректные данные') {
    super(message, 400);
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string = 'Ресурс не найден') {
    super(message, 404);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message: string = 'Неверный логин или пароль') {
    super(message, 401);
  }
}

export class ForbiddenError extends CustomError {
  constructor(message: string = 'Попытка удалить чужую карточку') {
    super(message, 403);
  }
}

export class ConflictError extends CustomError {
  constructor(message: string = 'Email уже существует') {
    super(message, 409);
  }
}
