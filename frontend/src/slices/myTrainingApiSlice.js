import { apiSlice } from "./apiSlice";
import { MYWORKOUT_URL } from "../constants";

export const myWorkoutApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyWorkoutDetails: builder.query({
      query: () => MYWORKOUT_URL, // Remove ID to fetch logged-in user's workout
      providesTags: ["MyWorkout"],
    }),
    createMyWorkout: builder.mutation({
      query: (workoutData) => ({
        url: MYWORKOUT_URL,
        method: "POST",
        body: workoutData,
      }),
      invalidatesTags: ["MyWorkout"],
    }),
    updateMyWorkout: builder.mutation({
      query: ({ id, workoutData }) => ({
        url: `${MYWORKOUT_URL}/${id}`,
        method: "PUT",
        body: workoutData,
      }),
      invalidatesTags: ["MyWorkout"],
    }),
    deleteMyWorkout: builder.mutation({
      query: (id) => ({
        url: `${MYWORKOUT_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MyWorkout"],
    }),
  }),
});

export const {
  useGetMyWorkoutDetailsQuery,
  useCreateMyWorkoutMutation,
  useUpdateMyWorkoutMutation,
  useDeleteMyWorkoutMutation,
} = myWorkoutApiSlice;
