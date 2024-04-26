const User = require("../../../../models/User.model/User.model");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

const changePasswordController = asyncHandler(async (req, res, next) => {
  // check user email reset link is expired or not
  // if user email reset link is expired return "Your email reset link is expired."
  // get password from frontend or req.body (newPassword, newPasswordTow)

  // Get passwords from the request body
  const { password, newPassword, conformPassword } = req.body;

  // Check if required fields are provided
  if ((!password, !newPassword, !conformPassword)) {
    throw new ApiError(
      400,
      "You must be provide New password and Conform password"
    );
  }

  // Check if newPassword and conformPassword match
  // !TODO: delete in production for security reason
  if (newPassword !== conformPassword) {
    throw new ApiError(400, "Password or Conform Password don't match.");
  }

  // Find user in the database by userId
  const user = await User.findById({ _id: req.user.userId });

  // Check if the user is found
  const isMatchPassword = await user.compareBcryptPassword(password);
  if (!isMatchPassword) {
    throw new ApiError(400, "Password don't match.");
  }

  // Update the user's password in the database
  user.password = newPassword;
  await user.save(); // save to database

  // Respond with success message

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { userId: user._id },
        "Password was change successfully."
      )
    );
});

module.exports = changePasswordController;