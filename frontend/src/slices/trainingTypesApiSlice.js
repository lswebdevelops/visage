import { TRAININGTYPES_URL, UPLOAD_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const TrainingTypesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTrainingTypes: builder.query({
      query: ({ keyword, pageNumber }) => ({
        url: TRAININGTYPES_URL,
        params: {
          keyword,
          pageNumber,
        },
      }),
      providesTags: ["TrainingType"] /** > reloads page */,
      keepUnusedDataFor: 5,
    }),
    getTrainingTypeDetails: builder.query({
      query: (TrainingTypeId) => ({
        url: `${TRAININGTYPES_URL}/${TrainingTypeId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createTrainingType: builder.mutation({
      query: () => ({
        url: TRAININGTYPES_URL,
        method: "POST",
      }),
      invalidatesTags: [
        "TrainingType",
      ] /* stops it from being cashed (always new data loading to the page) */,
    }),
    updateTrainingType: builder.mutation({
      query: ({ trainingTypeId, ...updatedTrainingType }) => ({
        url: `/api/trainingTypes/${trainingTypeId}`,  // ID na URL
        method: "PUT",
        body: updatedTrainingType,
      }),
    }),
    deleteTrainingType: builder.mutation({
      query: (TrainingTypeId) => ({
        url: `${TRAININGTYPES_URL}/${TrainingTypeId}`,
        method: "DELETE",
      }),
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `${TRAININGTYPES_URL}/${data.TrainingTypeId}/reviews`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["TrainingType"],
    }),    
  }),
});

export const {
  useGetTrainingTypesQuery,
  useGetTrainingTypeDetailsQuery,
  useCreateTrainingTypeMutation,
  useUpdateTrainingTypeMutation,  
  useDeleteTrainingTypeMutation,
  useCreateReviewMutation,
} = TrainingTypesApiSlice;
