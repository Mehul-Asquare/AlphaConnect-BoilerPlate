const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    mobile: Joi.string().required(),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    mobile: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      name: Joi.string(),
      bio: Joi.string(),
      designation: Joi.string(),
      secondaryMobile: Joi.string(),
      image: Joi.string(),
    })
};
const updateUserCoverImage = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      coverImage: Joi.string(),
    })
};

const createOrUpdateSocialMedia = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    u_facebook: Joi.string(),
    u_instagram: Joi.string(),
    u_twitter: Joi.string(),
    u_youtube: Joi.string(),
    u_linkedin: Joi.string(),
  }),
};

const addCompany = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    company_name: Joi.string(),
    company_mobile: Joi.string(),
    company_email: Joi.string().email(),
    company_desc: Joi.string(),
    company_image: Joi.array().items(
      Joi.object().keys({
        path: Joi.string(),
        size: Joi.number(),
      })
    ),
    company_website: Joi.string().uri(),
    company_address: Joi.string(),
    company_Linkedin_Profile: Joi.string().uri(),
    google_review_link: Joi.string().uri(),
    payment_link_upi: Joi.string(),
    facebook: Joi.string().uri(),
    instagram: Joi.string().uri(),
    twitter: Joi.string().uri(),
    youtube: Joi.string().uri(),
    linkedin: Joi.string().uri(),
  }),
};

const updateCompanyDetail = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    companyId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    company_name: Joi.string(),
    company_mobile: Joi.string(),
    company_email: Joi.string().email(),
    company_desc: Joi.string(),
    company_image: Joi.array().items(
      Joi.object().keys({
        path: Joi.string(),
        size: Joi.number(),
      })
    ),
    company_website: Joi.string().uri(),
    company_address: Joi.string(),
    company_Linkedin_Profile: Joi.string().uri(),
    google_review_link: Joi.string().uri(),
    payment_link_upi: Joi.string(),
    facebook: Joi.string().uri(),
    instagram: Joi.string().uri(),
    twitter: Joi.string().uri(),
    youtube: Joi.string().uri(),
    linkedin: Joi.string().uri(),
  }),
};

const deleteCompanyDetail = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    companyId: Joi.string().custom(objectId),
  }),
};

const addOfficeTiming = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    start_time: Joi.string().required(),
    end_time: Joi.string().required(),
  }),
};

const getUserOfficeTiming = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const uploadGalleryImages = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const uploadFiles = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const createProduct = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateProduct = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    productId: Joi.string().custom(objectId),
  }),
};

const deleteProduct = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    productId: Joi.string().custom(objectId),
  }),
};

const deleteUserImage = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const deleteUserCoverImage = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const deleteGalleryImages = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    imageNames: Joi.array().items(Joi.string()).min(1).required(),
  }),
};

const deleteCompanyImage = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateUserCoverImage,
  createOrUpdateSocialMedia,
  addCompany,
  updateCompanyDetail,
  addOfficeTiming,
  getUserOfficeTiming,
  uploadGalleryImages,
  uploadFiles,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteUserImage,
  deleteUserCoverImage,
  deleteGalleryImages,
  deleteCompanyImage,
  deleteCompanyDetail,
  deleteUser,
};
