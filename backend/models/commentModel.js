import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    entityId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true }, // Campo que faz referência ao Blog
    entityType: { type: String, enum: ["blog"], required: true }, // Tipo de entidade (blog)
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
