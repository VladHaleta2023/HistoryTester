import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuthenticated: false,
    admin: false,
    token: null,
    user: null,
    message: "",
    status: null,
    title: "",
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      setAuth: (state, action) => {
        state.isAuthenticated = action.payload.isAuthenticated || false;
        localStorage.setItem('auth', action.payload.isAuthenticated || false);
      },
      setAlert: (state, action) => {
        state.status = action.payload.status || null;
        state.message = action.payload.message || "";
        state.title = action.payload.title || "";
      },
      setCredentials: (state, action) => {
        state.token = action.payload.token || null;
        state.user = action.payload.user || null;
        if (action.payload.user) {
          if (action.payload.user.username === "Admin")
            state.admin = true;
          else
            state.admin = false;
        }
      },
      logOut: (state) => {
        state.token = null;
        state.user = null;
        state.message = "";
        state.status = null;
        state.title = "";
      },
    },
});

export const { setCredentials, logOut, setAuth, setAlert } = authSlice.actions;
export default authSlice.reducer;