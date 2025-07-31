import { BLOGS_URL, UPLOAD_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const blogsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBlogs: builder.query({
      query: () => ({
        url: BLOGS_URL,
      }),
      providesTags: ["Blog"],
      keepUnusedDataFor: 5,
    }),
    getBlogDetails: builder.query({
      query: (blogId) => ({
        url: `${BLOGS_URL}/${blogId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createBlog: builder.mutation({
      query: () => ({
        url: BLOGS_URL,
        method: "POST",
      }),
      invalidatesTags: ["Blog"],
    }),
    updateBlog: builder.mutation({
      query: (data) => ({
        url: `${BLOGS_URL}/${data.blogId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Blog"],
    }),
    uploadBlogImage: builder.mutation({
      query: (data) => ({
        url: `${UPLOAD_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    deleteBlog: builder.mutation({
      query: (blogId) => ({
        url: `${BLOGS_URL}/${blogId}`,
        method: "DELETE",
      }),
    }),
    addCommentToBlog: builder.mutation({
      query: ({ blogId, content }) => ({
        url: `${BLOGS_URL}/${blogId}/comments`,
        method: "POST",
        body: {
          content,
          entityId: blogId, // Passando o ID do blog como entityId
          entityType: "Blog", // Definindo explicitamente como um comentário de Blog
        },
      }),
      invalidatesTags: ["Blog"],
    }),
    
  }),
});

export const {
  useGetBlogsQuery,
  useGetBlogDetailsQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useUploadBlogImageMutation,
  useDeleteBlogMutation,
  useAddCommentToBlogMutation,
} = blogsApiSlice;

