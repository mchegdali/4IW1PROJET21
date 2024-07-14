const mongoose = require('mongoose');
const connection = require('./db');

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
    },
    addresses: {
      type: [
        {
          _id: {
            type: mongoose.Schema.Types.UUID,
            required: true,
          },
          name: {
            type: String,
            required: true,
            trim: true,
          },
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
          zipCode: {
            type: String,
            required: true,
            trim: true,
          },
          phone: {
            type: String,
            required: true,
            trim: true,
          },
        },
      ],
      required: true,
      default: [],
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

UserSchema.index(
  { fullname: 'text', email: 'text' },
  {
    name: 'users_search_index',
    weights: { fullname: 2, email: 1 },
    default_language: 'french',
  },
);

const UserMongo = connection.model('User', UserSchema);

module.exports = UserMongo;
