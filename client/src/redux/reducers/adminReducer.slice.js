import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    info: [],
    payments: []
};

const adminReducer = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        getInfo(state, { payload }) {
            state.info = payload;
        },
        getPayments(state, { payload }) {
            state.payments = payload;
        }
        // setLoadingPostDetail(state, { payload }) {
        //     state.loadingPostDetail = payload;
        // }
    }
});

export const {
    getInfo,
    getPayments
} = adminReducer.actions;


export default adminReducer.reducer;
