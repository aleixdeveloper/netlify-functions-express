import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";
import { tailwindColors } from "../utils/colors.js";
import { getUnmatchedElements } from "../utils/helper.js";

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const createAndAuthStandardUser = asyncHandler(async (req, res) => {
  const { name, groupNumber } = req.body;

  const user = await User.findOne({ groupNumber });

  if (user) {
    console.log("User exists, logged in successfully!");
    res.json({
      _id: user._id,
      name: user.name,
      groupNumber: user.groupNumber,
      isAdmin: user.isAdmin,

      token: generateToken(user._id),
    });
  } else {
    const existingColors = await User.find().distinct("color");
    console.log("existingColors", existingColors);
    const unmatched = getUnmatchedElements(tailwindColors, existingColors);
    console.log("unmatched", unmatched);
    let color;
    if (unmatched.length > 0) {
      color = unmatched[0];
    } else {
      color = tailwindColors[groupNumber % tailwindColors.length];
    }
    const user = await User.create({
      name,
      groupNumber,
      color,
    });

    if (user) {
      console.log("User created, logged in successfully!");

      res.status(201).json({
        _id: user._id,
        name: user.name,
        groupNumber: user.groupNumber,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  }
});
// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authAdminUser = asyncHandler(async (req, res) => {
  const { name, password } = req.body;

  const user = await User.findOne({ name });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(
      401
    ); /* .json({ error: true, message: "Invalid email or password" }); */
    throw new Error("Invalid name or password");
  }
});

/* // @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerAdminUser = asyncHandler(async (req, res) => {
  const { name, password } = req.body;

  const userExists = await User.findOne({ name });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,

    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});
 */
// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ isAdmin: false });
  res.json(users);
});

const getUsersTable = asyncHandler(async (req, res) => {
  const users = await User.find({ isAdmin: false });
  const result = users.map(
    ({ _id, name, password, groupNumber, totalScore, color }) => {
      const total = Object.values(totalScore).reduce(
        (acc, curr) => acc + curr,
        0
      );
      return {
        _id,
        name,
        password,
        totalScore,
        groupNumber,
        color,
        total,
      };
    }
  );
  res.json(result);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get user by id
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.name = req.body.name || user.name;
    user.isAdmin = req.body.isAdmin;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
const updateUserScore = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.totalScore = {
      ...user.totalScore,
      ["challenge" + req.body.challengeNum]: req.body.newScore,
    };

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      groupNumber: updateUser.groupNumber,
      totalScore: updateUser.totalScore,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  createAndAuthStandardUser,
  authAdminUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUsersTable,
  deleteUser,
  getUserById,
  updateUser,
  updateUserScore,
};
