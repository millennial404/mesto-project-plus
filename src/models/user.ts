import mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import bcrypt from 'bcrypt';

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
    validate: [isEmail, 'Invalid email'],
  },
  password: {
    type: String,
    required: true,
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
  },
});
userSchema.static('findUserByCredentials', async function findUserByCredentials(email: string, password: string) {
  const user = await this.findOne({ email });
  if (!user) {
    return Promise.reject(new Error('Неправильные почта или пароль'));
  }
  const matched = await bcrypt.compare(password, user.password);
  if (!matched) {
    return Promise.reject(new Error('Неправильные почта или пароль'));
  }
  return user;
});

export default mongoose.model<IUser, UserModel>('User', userSchema);
