import asyncHandler from "../middleware/asyncHandler.js";
import Blog from "../models/blogModel.js";
import Comment from "../models/commentModel.js";

// @desc Fetch all blogs
// @route GET /api/blogs
// @access Public

const getBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({}).sort({ createdAt: -1 }); // Sort blogs by newest first
  res.json({ blogs });
});

// @desc Fetch a blog with populated comments
// @route GET /api/blogs/:id
// @access Public

const getBlogById = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id)
    .populate({
      path: 'comments', // Populating comments
      populate: {
        path: 'user', // Populating the user within the comment
        select: 'name', // Select only the 'name' of the user (you can adjust based on your User model)
      },
    });

  if (blog) {
    res.json(blog); // Return the blog with populated comments and users
  } else {
    res.status(404);
    throw new Error("Blog não encontrado");
  }
});


// @desc Create a new blog
// @route POST /api/blogs
// @access Private admin

const createBlog = asyncHandler(async (req, res) => {
  const blog = new Blog({
    title: "Novo Blog",
    image: "https://res.cloudinary.com/dvnxrzpnl/image/upload/v1750946746/picture-blog_soomd8.png",
    author: "Visage",
    content: " Bla bla bla",
  });

  const createdBlog = await blog.save();
  res.status(201).json(createdBlog);
});

// @desc Update a blog
// @route PUT  /api/blog/:id
// @access Private admin

const updateBlog = asyncHandler(async (req, res) => {
  const { title, content, image, author } = req.body;

  const blog = await Blog.findById(req.params.id);

  if (blog) {
    blog.title = title;
    blog.content = content;
    blog.image = image;
    blog.author = author;

    const updatedBlog = await blog.save();
    res.json(updatedBlog);
  } else {
    res.status(404);
    throw new Error("Blog not found");
  }
});


// @desc Add a comment to a blog
// @route POST /api/blogs/:id/comments
// @access Private

const addCommentToBlog = asyncHandler(async (req, res) => {
  const { content } = req.body; // Only content is required for the comment
  const entityId = req.params.id; // The ID of the Blog coming from the URL

  if (!content || !entityId) {
    res.status(400);
    throw new Error("Os campos content e entityId são obrigatórios");
  }

  // Find the blog by ID
  const blog = await Blog.findById(entityId);
  if (!blog) {
    res.status(404);
    throw new Error("Blog não encontrado");
  }

  // Create a new comment
  const comment = new Comment({
    user: req.user._id, // Assuming you are using req.user from auth middleware
    content,
    entityId,
    entityType: 'blog', // You can set the entityType to 'blog' to know what type of entity the comment belongs to
  });

  // Save the comment
  await comment.save();

  // Push the comment ID to the blog's comments array
  blog.comments.push(comment._id);
  await blog.save();

  res.status(201).json(comment);
});

// @desc delete a blog
// @route delete  /api/blog/:id
// @access private admin

const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (blog) {
    try {
      // Excluindo os comentários associados ao blog
      const comments = await Comment.find({ entityId: req.params.id });
      // console.log("Comentários encontrados para exclusão:", comments);
      await Comment.deleteMany({ entityId: req.params.id });

      // Excluindo o blog
      await Blog.findByIdAndDelete(req.params.id);  // Substitua o método remove por findByIdAndDelete
      res.status(200).json({ message: "Blog e seus comentários foram deletados." });
    } catch (error) {
      console.error("Erro ao deletar blog ou comentários:", error);
      res.status(500).json({ message: "Erro interno ao tentar excluir o blog." });
    }
  } else {
    res.status(404);
    throw new Error("Blog não encontrado");
  }
});







export { getBlogs, getBlogById, createBlog, updateBlog, deleteBlog, addCommentToBlog };
