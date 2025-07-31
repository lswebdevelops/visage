import mongoose from "mongoose";

const aboutUsSchema = mongoose.Schema(
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

const AboutUs = mongoose.model("AboutUs", aboutUsSchema);

export default AboutUs;
