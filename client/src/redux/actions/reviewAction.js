import { AllReviewes, NewReview } from "../reducers/reviewReducer";

import { apiConnection } from "../../utils/axios";

export const getAllReviewes = () => async (dispatch) => {
  try {
    // const response = await axios.get('http://localhost:3001/review');
    const { data } = await apiConnection.get("review");
    return dispatch(AllReviewes(data));
  } catch (error) {
    console.log(error);
  }
};

export const createNewReview = (userId, info) => async (dispatch) => {
  try {
    // const response = await axios.post(
    //   `http://localhost:3001/review/${userId}`,
    //   info,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${localStorage.getItem("token")}`,
    //     },
    //   }
    // );
    const { data } = await apiConnection.post(`review/${userId}`, info);
    return dispatch(NewReview(data));
  } catch (error) {
    console.log(error);
  }
};

export const modifyReview = (userId, reviewId, info) => async (dispatch) => {
  try {
    // const response = await axios.put(
    //   `http://localhost:3001/review/${userId}/${reviewId}`,
    //   info,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${localStorage.getItem("token")}`,
    //     },
    //   }
    // );
    const { data } = await apiConnection.put(
      `review/${userId}/${reviewId}`,
      info
    );
    return dispatch(AllReviewes(data));
  } catch (error) {
    console.log(error);
  }
};

export const deleteReview = (userId, reviewId) => async (dispatch) => {
  try {
    // const response = await axios.delete(
    //   `http://localhost:3001/review/${userId}/${reviewId}`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${localStorage.getItem("token")}`,
    //     },
    //   }
    // );
    const { data } = await apiConnection.delete(`review/${userId}/${reviewId}`);
    return dispatch(AllReviewes(data));
  } catch (error) {
    console.log(error);
  }
};
