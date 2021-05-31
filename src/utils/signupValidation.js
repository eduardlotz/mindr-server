const yup = require("yup");

const createError = require("./createError");

const signupValidationSchema = yup.object().shape({
  name: yup.string().required().min(3).max(24),
  avatar: yup.string().required(),
});

const validateSignUpData = async (userData) => {
  try {
    await signupValidationSchema.validate(userData, {
      abortEarly: false,
    });
  } catch (err) {
    throw createError(400, "Bad Request", err.errors);
  }
};

module.exports = validateSignUpData;
