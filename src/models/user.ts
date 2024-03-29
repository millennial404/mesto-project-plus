import mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import bcrypt from 'bcrypt';
import { UnauthorizedError } from '../middlewares/errors';

interface IUser {
  name: string;
  email: string;
  password: string;
  about: string;
  avatar: string;
}

interface UserModel extends mongoose.Model<IUser> {
  findUserByCredentials:
  // eslint-disable-next-line no-unused-vars
    (email: string, password: string) => Promise<mongoose.Document<unknown, any, IUser>>;
}

const userSchema = new mongoose.Schema<IUser, UserModel>({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v: string) => isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 200,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (value: string) => /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/.test(value),
      message: (props) => `${props.value} is not a valid link!`,
    },
  },
});
userSchema.static('findUserByCredentials', async function findUserByCredentials(email: string, password: string) {
  const user = await this.findOne({ email })
    .select('+password');
  if (!user) {
    return Promise.reject(new UnauthorizedError());
  }
  const matched = await bcrypt.compare(password, user.password);
  if (!matched) {
    return Promise.reject(new UnauthorizedError());
  }
  return user;
});

export default mongoose.model<IUser, UserModel>('User', userSchema);
