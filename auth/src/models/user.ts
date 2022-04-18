import mongoose from 'mongoose';
import { Password } from '../services/password';
//Interface that describes a User typescipt porpuses
interface UserAttrs {
  email: string;
  password: string;
  name: string;
  photoUrl: string;
  rating: number;
  biography: string;
  contact: string;
  birthDate: string;
}

//Interface that describes a UserModel
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

//Interface that describes the propertis a Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  name: string;
  photoUrl: string;
  rating: number;
  briography: string;
  contact: string;
  birthDate: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    photoUrl: {
      type: String,
      required: false,
    },
    rating: {
      type: Number,
      required: true,
    },
    biography: {
      type: String,
      required: false,
    },
    contact: {
      type: String,
      required: false,
    },
    birthDate: {
      type: String,
      required: false,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashedPassword = await Password.toHash(this.get('password'));
    this.set('password', hashedPassword);
  }
  done();
});

userSchema.statics.build = (attrs: UserAttrs) => new User(attrs);

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
