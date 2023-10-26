const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

/**
* Company Schema
*/
const companySchema = mongoose.Schema({
  company_name: String,
  company_mobile: String,
  company_email: String,
  company_desc: String,
  company_image: [
    {
      _id: false, // Disable automatic _id generation for the subdocument
      path: { type: String }, // Store the path to the image
      size: { type: Number }, // Store the size of the image in bytes
    },
  ],
  company_website: String,
  company_address: String,
  company_Linkedin_Profile: String,
  google_review_link: String,
  payment_link_upi: String,
  facebook: String,
  instagram: String,
  twitter: String,
  youtube: String,
  linkedin: String
})

/**
* Gallary Schema
*/
const gallerySchema = mongoose.Schema(
  {
    _id: false,
    images: [
      {
        _id: false, // Disable automatic _id generation for the subdocument
        path: { type: String }, // Store the path to the image
        size: { type: Number }, // Store the size of the image in bytes
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false, // Disable the __v field
  }
);

/**
* Files Schema
*/
const filesSchema = mongoose.Schema(
  {
    _id: false,
    documents: [
      {
        _id: false, // Disable automatic _id generation for the subdocument
        path: { type: String }, // Store the path to the image
        size: { type: Number }, // Store the size of the image in bytes
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false, // Disable the __v field
  }
);

/**
 * Product Schema
 */
const productSchema = mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    files: [
      {
        _id: false, // Disable automatic _id generation for the subdocument
        path: { type: String }, // Store the path to the image
        size: { type: Number }, // Store the size of the image in bytes
      },
    ],
    images: [
      {
        _id: false, // Disable automatic _id generation for the subdocument
        path: { type: String }, // Store the path to the image
        size: { type: Number }, // Store the size of the image in bytes
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false, // Disable the __v field
  }
);

/**
* Social Media Schema
*/
const socialSchema = mongoose.Schema({
  u_facebook: { type: String, allowed: true }, // Allow u_facebook property
  u_instagram: { type: String, allowed: true }, // Allow u_instagram property
  u_twitter: { type: String, allowed: true }, // Allow u_twitter property
  u_youtube: { type: String, allowed: true }, // Allow u_youtube property
  u_linkedin: { type: String, allowed: true }, // Allow u_linkedin property
}, { _id: false });

/**
* Office Timing Schema
*/
const timingSchema = mongoose.Schema({
  day: String,
  start_time: String,
  end_time: String
}, { _id: false });

/**
* User Schema
*/
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isMobilePhone(value)) {
          throw new Error('Invalid mobile');
        }
      },
    },
    secondaryMobile: {
      type: String,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isMobilePhone(value)) {
          throw new Error('Invalid mobile');
        }
      },
    },
    designation: {
      type: String
    },
    bio: {
      type: String
    },
    image: [
      {
        _id: false, // Disable automatic _id generation for the subdocument
        path: { type: String }, // Store the path to the image
        size: { type: Number }, // Store the size of the image in bytes
      },
    ],
    coverImage: [
      {
        _id: false, // Disable automatic _id generation for the subdocument
        path: { type: String }, // Store the path to the image
        size: { type: Number }, // Store the size of the image in bytes
      },
    ],
    password: {
      type: String,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      enum: roles,
      default: 'admin',
    },
    officetime: [timingSchema],
    company_detail: [companySchema],
    social_media_detail: socialSchema,
    gallery: gallerySchema,
    files: filesSchema,
    product: [productSchema],
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false, // Disable the __v field
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
