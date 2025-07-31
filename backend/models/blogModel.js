import mongoose from "mongoose";
import Comment from "./commentModel.js"; // Importa o modelo de comentário

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    image: { type: String, required: true },
    content: { type: String, required: true },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }], // Armazena os IDs dos comentários
  },
  { timestamps: true }
);

// Middleware de exclusão em cascata: deleta os comentários associados ao blog
blogSchema.pre("remove", async function (next) {
  // Deleta os comentários associados ao blog
  await Comment.deleteMany({ entityId: this._id });
  next();
});

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
