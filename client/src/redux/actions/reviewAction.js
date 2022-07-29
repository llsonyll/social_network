import { AllReviewes, NewReview } from "../reducers/reviewReducer";

import { apiConnection } from "../../utils/axios";
//AAAAAAAADMIN
export const getAllReviewes = () => async (dispatch) => {
  try {
    const { data } = await apiConnection.get("review");
    return dispatch(AllReviewes(data));
  } catch (error) {
    console.log(error);
  }
};
//UUUUUUUUSER
export const createNewReview = (userId, info) => async (dispatch) => {
  try {
    const { data } = await apiConnection.post(`review/${userId}`, info);
    return dispatch(NewReview(data));
  } catch (error) {
    
    console.log(error);
  }
};
//UUUUUUUSER
export const modifyReview = (userId, reviewId, info) => async (dispatch) => {
  try {
    const { data } = await apiConnection.put(
      `review/${userId}/${reviewId}`,
      info
    );
    return dispatch(AllReviewes(data));
  } catch (error) {
    console.log(error);
  }
};
//AAAAAAAADMIN
export const deleteReview = (userId, reviewId) => async (dispatch) => {
  try {
    const { data } = await apiConnection.delete(`review/${userId}/${reviewId}`);
    return dispatch(AllReviewes(data));
  } catch (error) {
    console.log(error);
  }
};
