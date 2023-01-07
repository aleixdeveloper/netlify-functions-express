import asyncHandler from "express-async-handler";

// @desc    Fetch all bfps
// @route   GET /api/bfps
// @access  Public
const getTest = asyncHandler(async (req, res, next) => {
  /*  const bfps = await bfp.find(); */
  res.status(200).json({ res: "OK TEST" });
});

export { getTest };
