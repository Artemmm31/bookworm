import mongoose, { Document, Model, ObjectId } from "mongoose";
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: ObjectId;
  username: string;
  email: string;
  password: string;
  profileImage: string;
  createdAt?: Date,
  updatedAt?: Date,
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUser> {}

const userSchema = new mongoose.Schema<IUser>({
    username:{
        type: String,
        required: true,
        unique: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
        minlength: 6,
    },
    profileImage: {
        type: String,
        default: '',
    }
}, {
    timestamps: true,
});

userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

userSchema.methods.comparePassword = async function (userPassword: string) {
    return await bcrypt.compare(userPassword, this.password);
}

const User = mongoose.model('User', userSchema);

export default User;