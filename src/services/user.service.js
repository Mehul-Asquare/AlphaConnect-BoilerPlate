const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const path = require('path');
/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.findOne({ mobile: userBody.mobile })) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Mobile already taken');
  }
  return User.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByMobile = async (mobile) => {
  return User.findOne({ mobile });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Update the user's cover image by user id
 * @param {ObjectId} userId
 * @param {Object} coverImage
 * @returns {Promise<User>}
 */
const updateCoverImage = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Create or update user's social media details
 * @param {ObjectId} userId
 * @param {Object} socialMediaData
 * @returns {Promise<User>}
 */
const createOrUpdateSocialMedia = async (userId, socialMediaData) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  // Update or create the user's social media details
  user.social_media_detail = socialMediaData;
  await user.save();
  return user;
};

/**
 * Create or update user's company details
 * @param {ObjectId} userId
 * @param {Object} companyData
 * @returns {Promise<User>}
 */
const createCompany = async (userId, companyData) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  // Update or create the user's company details
  user.company_detail.push(companyData);
  Object.assign(user.company_detail, companyData);
  await user.save();
  return user;
};

/**
 * Update a specific company detail by _id
 * @param {ObjectId} userId - User ID
 * @param {ObjectId} companyId - Company detail's _id
 * @param {Object} updatedCompanyDetail - Updated company detail data
 * @returns {Promise<User>} - Updated user object
 */
const updateCompanyDetailById = async (userId, companyId, updatedCompanyDetail) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const companyDetail = user.company_detail.id(companyId);
  // console.log(companyDetail);
  if (!companyDetail) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Company detail not found');
  }

  companyDetail.set(updatedCompanyDetail);
  Object.assign(user.company_detail.id(companyId), updatedCompanyDetail);
  // Update the company detail with the new data
  // companyDetail.set(updatedCompanyDetail);

  await user.save();
  return user;
};

/**
 * Delete a specific company detail by _id
 * @param {ObjectId} userId - User ID
 * @param {ObjectId} companyId - Company detail's _id
 * @returns {Promise<User>} - Updated user object
 */
const deleteCompanyDetailById = async (userId, companyId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const companyDetail = user.company_detail.id(companyId);
  if (!companyDetail) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Company detail not found');
  }

  // Remove the company detail from the array
  companyDetail.remove();

  await user.save();
  return user;
};

/**
 * Add office timing for a specific user
 * @param {ObjectId} userId - User ID
 * @param {Array} officeTiming - Array of office timings for each weekday
 * @returns {Promise<User>} - Updated user object
 */
const addOfficeTiming = async (userId, officeTiming) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const office = []
  for (let i = 0; i < 7; i++) {
    let day = weekday[i];
    office[i] = {
      day: day,
      start_time: officeTiming.start_time,
      end_time: officeTiming.end_time,
    }
  }
  user.officetime = office;
  await user.save();
  return user;
};

/**
 * Get the office timings of a user by their ID
 * @param {ObjectId} userId - User ID
 * @returns {Promise<Array>} - Array of office timings
 */
const getUserOfficeTimings = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  // console.log(user.officetime)
  return user.officetime;
};

/**
 * Upload gallery images for a specific user
 * @param {ObjectId} userId - User ID
 * @param {Array} galleryImages - Array of uploaded gallery images
 * @returns {Promise<User>} - Updated user object
 */
const uploadGalleryImages = async (userId, galleryImages) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Process and add the uploaded gallery images to the user's gallery
  const images = galleryImages.map((image) => ({
    path: image.path,
    size: image.size,
  }));

  if (!user.gallery) {
    user.gallery = { images };
  } else {
    user.gallery.images = [...user.gallery.images, ...images];
  }

  await user.save();
  return user;
};

/**
 * Upload gallery images for a specific user
 * @param {ObjectId} userId - User ID
 * @param {Array} documents - Array of uploaded files
 * @returns {Promise<User>} - Updated user object
 */
const uploadFiles = async (userId, documents) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Process and add the uploaded files to the user's 'files' schema
  const uploadedDocuments = documents.map((document) => ({
    path: document.path,
    size: document.size,
  }));

  if (!user.files) {
    user.files = { documents: uploadedDocuments };
  } else {
    user.files.documents = [...user.files.documents, ...uploadedDocuments];
  }

  await user.save();
  return user;
};

/**
 * Add product for a specific user
 * @param {ObjectId} userId - User ID
 * @param {Object} productData - Product data including titles, descriptions, images, and files
 * @returns {Promise<User>} - Updated user object
 */
const createProduct = async (userId, productData) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Process and add the uploaded files and images to the product
  const files = productData.files.map((file) => ({
    path: file.path,
    size: file.size,
  }));
  const images = productData.images.map((image) => ({
    path: image.path,
    size: image.size,
  }));

  const newProduct = {
    title: productData.title,
    description: productData.description,
    files,
    images,
  };

  if (!user.product) {
    user.product.push(newProduct);
  } else {
    user.product.push(newProduct);
  }

  await user.save();
  return user;
};

/**
 * Update a specific product by _id
 * @param {ObjectId} userId - User ID
 * @param {ObjectId} productId - Product's _id
 * @param {Object} updatedProductData - Updated product data
 * @returns {Promise<User>} - Updated user object
 */
const updateProductById = async (userId, productId, updatedProductData) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const product = user.product.id(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  // Process and update the uploaded files and images for the product
  const files = updatedProductData.files.map((file) => ({
    path: file.path,
    size: file.size,
  }));
  const images = updatedProductData.images.map((image) => ({
    path: image.path,
    size: image.size,
  }));

  product.set({
    title: updatedProductData.title,
    description: updatedProductData.description,
    files,
    images,
  });

  await user.save();
  return user;
};

/**
 * Delete a specific product by _id
 * @param {ObjectId} userId - User ID
 * @param {ObjectId} productId - Product's _id
 * @returns {Promise<User>} - Updated user object
 */
const deleteProductById = async (userId, productId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const product = user.product.id(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  // Remove the product from the array
  product.remove();

  await user.save();
  return user;
};

/**
 * Delete user's image by user id
 * @param {ObjectId} userId - User ID
 * @returns {Promise<User>} - Updated user object
 */
const deleteImage = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Remove the image property from the user
  user.image = null;
  await user.save();
  return user;
};

/**
 * Delete user's cover image by user id
 * @param {ObjectId} userId - User ID
 * @returns {Promise<User>} - Updated user object
 */
const deleteCoverImage = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Remove the coverImage property from the user
  user.coverImage = null;
  await user.save();
  return user;
};

/**
 * Delete multiple gallery images by image names
 * @param {ObjectId} userId - User ID
 * @param {Array} imageNames - Array of image filenames to delete
 * @returns {Promise<User>} - Updated user object
 */
const deleteGalleryImages = async (userId, imageNames) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Remove the specified images from the user's gallery
  if (user.gallery && user.gallery.images) {
    user.gallery.images = user.gallery.images.filter(image => !imageNames.includes(path.basename(image.path)));
  }

  await user.save();
  return user;
};

/**
 * Delete the company image for a specific user
 * @param {ObjectId} userId - User ID
 * @param {string} imageName - The name of the image to delete
 * @returns {Promise<User>} - Updated user object
 */
const deleteCompanyImage = async (userId, imageName) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Set the company image path to null to delete it
  user.company_detail.company_image = null;

  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByMobile,
  updateUserById,
  updateCoverImage,
  createOrUpdateSocialMedia,
  createCompany,
  updateCompanyDetailById,
  addOfficeTiming,
  getUserOfficeTimings,
  uploadGalleryImages,
  uploadFiles,
  createProduct,
  updateProductById,
  deleteProductById,
  deleteImage,
  deleteCoverImage,
  deleteGalleryImages,
  deleteCompanyImage,
  deleteCompanyDetailById,
  deleteUserById,
};
