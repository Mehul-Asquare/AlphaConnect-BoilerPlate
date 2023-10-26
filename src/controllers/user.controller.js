const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const path = require('path');

function getStandardResponse(status, message, data) {
  return {
    status: status,
    message: message,
    data: data,
  }
}

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(getStandardResponse(true, "User's Profile Details GET Successfully...", user));
});

const updateUser = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const updateBody = req.body;

  // Handle image upload
  if (req.file) {
    const uploadedImagePath = path.join(__dirname, '../../uploads', req.file.filename); // Full path to the uploaded image
    const imageSize = req.file.size; // Get the file size

    // Create an object representing the uploaded image
    const newImage = {
      path: uploadedImagePath,
      size: imageSize,
    };

    if (!updateBody.image) {
      updateBody.image = [newImage]; // If 'image' is not an array, make it an array with the new image
    } else {
      updateBody.image.push(newImage); // If 'image' is an array, push the new image
    }
  }

  const user = await userService.updateUserById(userId, updateBody);
  res.send(getStandardResponse(true, "User's Profile Details UPDATE Successfully...", user));
});

const uploadCoverImage = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const updateBody = req.body;
  if (req.file) {
    const uploadedImagePath = path.join(__dirname, '../../uploads', req.file.filename); // Full path to the uploaded image
    const imageSize = req.file.size; // Get the file size

    // Create an object representing the uploaded image
    const newImage = {
      path: uploadedImagePath,
      size: imageSize,
    };

    if (!updateBody.coverImage) {
      updateBody.coverImage = [newImage]; // If 'image' is not an array, make it an array with the new image
    } else {
      updateBody.coverImage.push(newImage); // If 'image' is an array, push the new image
    }
  }
  const user = await userService.updateUserById(userId, updateBody);
  res.send(getStandardResponse(true, "User's Profile Cover UPDATE Successfully...", user));

});

const createOrUpdateSocialMedia = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const socialMediaData = req.body;

  const user = await userService.createOrUpdateSocialMedia(userId, socialMediaData);
  res.send(getStandardResponse(true, "Social Media Details updated successfully", user));
});

const addCompany = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const updateBody = req.body;
  console.log(updateBody);
  // Handle image upload for company_image
  if (req.file) {
    const uploadedImagePath = path.join(__dirname, '../../uploads', req.file.filename); // Full path to the uploaded image
    const imageSize = req.file.size; // Get the file size

    // Create an object representing the uploaded image
    const newImage = {
      path: uploadedImagePath,
      size: imageSize,
    };

    if (!updateBody.company_image) {
      updateBody.company_image = [newImage]; // If 'company_image' is not an array, make it an array with the new image
    } else {
      updateBody.company_image.push(newImage); // If 'company_image' is an array, push the new image
    }
  }

  const user = await userService.createCompany(userId, updateBody);
  res.send(getStandardResponse(true, "Company Details Added successfully", user));
});

const updateCompanyDetail = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const companyId = req.params.companyId;
  const updatedCompanyDetail = req.body;
  if (req.file) {
    const uploadedImagePath = path.join(__dirname, '../../uploads', req.file.filename); // Full path to the uploaded image
    const imageSize = req.file.size; // Get the file size

    // Create an object representing the uploaded image
    const newImage = {
      path: uploadedImagePath,
      size: imageSize,
    };

    if (!updatedCompanyDetail.company_image) {
      updatedCompanyDetail.company_image = [newImage]; // If 'company_image' is not an array, make it an array with the new image
    } else {
      updatedCompanyDetail.company_image.push(newImage); // If 'company_image' is an array, push the new image
    }
  }
  const user = await userService.updateCompanyDetailById(userId, companyId, updatedCompanyDetail);
  res.send(getStandardResponse(true, 'Company Detail updated successfully', user));
});

const deleteCompanyDetail = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const companyId = req.params.companyId;

  const user = await userService.deleteCompanyDetailById(userId, companyId);
  res.send(getStandardResponse(true, 'Company Detail deleted successfully', user));
});

const addOfficeTiming = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const officeTiming = req.body;

  const user = await userService.addOfficeTiming(userId, officeTiming);
  res.send(getStandardResponse(true, "User's Office Timing added successfully", user));
});

const getOfficeTimings = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const user = await userService.getUserOfficeTimings(userId);
  // console.log(user)
  res.send(getStandardResponse(true, "User's Office Timings Retrieved Successfully", user));
});

const uploadGalleryImages = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const galleryImages = req.files; // 'galleryImages' should match the field name in the form

  const user = await userService.uploadGalleryImages(userId, galleryImages);
  res.send(getStandardResponse(true, 'Gallery Images uploaded successfully', user));
});

const uploadFiles = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const documents = req.files; // 'documents' should match the field name in the form

  const user = await userService.uploadFiles(userId, documents);
  res.send(getStandardResponse(true, 'Files uploaded successfully', user));
});

const createProduct = async (req, res) => {
  const userId = req.params.userId;
  const productData = req.body;
  const files = req.files['files']; // Assuming 'files' is the field name for uploading files
  const images = req.files['images']; // Assuming 'images' is the field name for uploading images

  try {
    const product = await userService.createProduct(userId, {
      title: productData.title,
      description: productData.description,
      files,
      images,
    });
    res.status(httpStatus.CREATED).send(getStandardResponse(true, 'Product created successfully', product));
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send(getStandardResponse(false, error.message, null));
  }
};

const updateProduct = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const productId = req.params.productId;
  const updatedProductData = req.body;

  // Assuming you have fields named 'files' and 'images' for file and image uploads
  const files = req.files['files'];
  const images = req.files['images'];

  const user = await userService.updateProductById(userId, productId, {
    title: updatedProductData.title,
    description: updatedProductData.description,
    files,
    images,
  });

  res.send(getStandardResponse(true, 'Product updated successfully', user));
});

const deleteProduct = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const productId = req.params.productId;

  const user = await userService.deleteProductById(userId, productId);
  res.send(getStandardResponse(true, 'Product deleted successfully', user));
});

const deleteImage = catchAsync(async (req, res) => {
  const userId = req.params.userId;

  const updateBody = {
    image: null,
  };

  const user = await userService.updateUserById(userId, updateBody);
  res.send(getStandardResponse(true, "User's Profile Cover Image DELETE Successfully...", user));
});

const deleteCoverImage = catchAsync(async (req, res) => {
  const userId = req.params.userId;

  const updateBody = {
    coverImage: null,
  };

  const user = await userService.updateUserById(userId, updateBody);
  res.send(getStandardResponse(true, "User's Profile Cover Image DELETE Successfully...", user));
});

const deleteGalleryImages = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const { imageNames } = req.body;

  const user = await userService.deleteGalleryImages(userId, imageNames);
  res.send(getStandardResponse(true, 'Gallery Images deleted successfully', user));
});

const deleteCompanyImage = catchAsync(async (req, res) => {
  const userId = req.params.userId;

  const user = await userService.deleteCompanyImage(userId);
  res.send(getStandardResponse(true, 'Company image deleted successfully', user));
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  uploadCoverImage,
  createOrUpdateSocialMedia,
  addCompany,
  updateCompanyDetail,
  addOfficeTiming,
  getOfficeTimings,
  uploadGalleryImages,
  uploadFiles,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteImage,
  deleteCoverImage,
  deleteGalleryImages,
  deleteCompanyImage,
  deleteCompanyDetail,
  deleteUser,
};
