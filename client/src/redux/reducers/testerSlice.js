import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    datas: JSON.parse(localStorage.getItem('datas')) || [],
    data1Select: JSON.parse(localStorage.getItem('data1Select')) || [],
    data2Select: JSON.parse(localStorage.getItem('data2Select')) || [],
};

const testerSlice = createSlice({
    name: 'tester',
    initialState,
    reducers: {
      setCredentials: (state, action) => {
        state.datas = action.payload.datas || [];
        state.data1Select = action.payload.data1Select || [];
        state.data2Select = action.payload.data2Select || [];
      },
    },
});

export const { setCredentials } = testerSlice.actions;
export default testerSlice.reducer;