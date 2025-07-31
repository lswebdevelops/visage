import { CLIENTTYPES_URL, UPLOAD_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const ClientTypesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getClientTypes: builder.query({
      query: ({ keyword, pageNumber }) => ({
        url: CLIENTTYPES_URL,
        params: {
          keyword,
          pageNumber,
        },
      }),
      providesTags: ["ClientType"] /** > reloads page */,
      keepUnusedDataFor: 5,
    }),
    getClientTypeDetails: builder.query({
      query: (ClientTypeId) => ({
        url: `${CLIENTTYPES_URL}/${ClientTypeId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createClientType: builder.mutation({
      query: () => ({
        url: CLIENTTYPES_URL,
        method: "POST",
      }),
      invalidatesTags: [
        "ClientType",
      ] /* stops it from being cashed (always new data loading to the page) */,
    }),
    updateClientType: builder.mutation({
      query: ({ clientTypeId, ...updatedClientType }) => ({
        url: `/api/clientTypes/${clientTypeId}`,  // ID na URL
        method: "PUT",
        body: updatedClientType,
      }),
    }),
    deleteClientType: builder.mutation({
      query: (ClientTypeId) => ({
        url: `${CLIENTTYPES_URL}/${ClientTypeId}`,
        method: "DELETE",
      }),
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `${CLIENTTYPES_URL}/${data.ClientTypeId}/reviews`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ClientType"],
    }),    
  }),
});

export const {
  useGetClientTypesQuery,
  useGetClientTypeDetailsQuery,
  useCreateClientTypeMutation,
  useUpdateClientTypeMutation,  
  useDeleteClientTypeMutation,
  useCreateReviewMutation,
} = ClientTypesApiSlice;
