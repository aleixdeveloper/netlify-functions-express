import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    groupNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    /*  email: {
      type: String,
      unique: true,
    }, */
    password: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },

    /* totalScore: [
      {
        type: Object,
      },
    ], */
    totalScore: {
      type: Object,
      default: {},
    },
    color: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;
