import mongoose from "mongoose";

const biographySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Biography = mongoose.model("Biography", biographySchema);

export default Biography;
