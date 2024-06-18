import mongoose from 'mongoose';
import dayjs from 'dayjs';

const UserSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.UUID,
      required: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 12,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      default: 'user',
      enum: ['user', 'admin', 'accountant'],
      trim: true,
    },
    passwordValidUntil: {
      type: Date,
      required: true,
      default: () => dayjs().add(60, 'day').toDate(),
    },
    addresses: {
      type: [
        {
          street: {
            type: String,
            required: true,
            trim: true,
          },
          city: {
            type: String,
            required: true,
            trim: true,
          },
          state: {
            type: String,
            required: true,
            trim: true,
          },
          country: {
            type: String,
            required: true,
            trim: true,
          },
          zip: {
            type: String,
            required: true,
            trim: true,
          },
        },
      ],
      required: true,
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    toObject: {
      getters: true,
    },
    toJSON: {
      getters: true,
    },
    timestamps: true,
  },
);

const UserMongo = mongoose.model('User', UserSchema);

export default UserMongo;
