import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    datas: JSON.parse(localStorage.getItem('datas')) || [],
    data1: JSON.parse(localStorage.getItem('data1')) || [],
    data2: JSON.parse(localStorage.getItem('data2')) || [],
};

const testerSlice = createSlice({
    name: 'tester',
    initialState,
    reducers: {
      setCredentials: (state, action) => {
        state.datas = action.payload.datas || [];
        state.data1 = action.payload.data1 || [];
        state.data2 = action.payload.data2 || [];
      },
    },
});

export const { setCredentials } = testerSlice.actions;
export default testerSlice.reducer;