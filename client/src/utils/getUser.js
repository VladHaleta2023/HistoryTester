import axiosAuthInstance from '../axios/axiosAuthInstance.js';
import { setCredentials, setAuth, setAlert } from "../redux/reducers/authSlice.js";

export const fetchUser = async (dispatch, navigate) => {
    try {
        const response = await axiosAuthInstance.get("/getMe", {
            withCredentials: true
        });
        const token = response.data.token;
        const user = response.data.user;
        if (user.status !== "blocked") {
            dispatch(setCredentials({token, user}));
            dispatch(setAuth({isAuthenticated: true}));
        }
        else {
            dispatch(setAlert({status: 400, title: "Autoryzacja", message: "Dany użytkownik jest zablokowany"}));
            dispatch(setAuth({isAuthenticated: false}));
            localStorage.setItem('auth', false);
        }
    } 
    catch (error) {
        dispatch(setAuth({isAuthenticated: false}));
        localStorage.setItem('auth', false);
        
        if (error.response) {
            dispatch(setAlert({status: error.response.status, title: "Autoryzacja", message: error.response.data.message}));
        }
        else {
            dispatch(setAlert({status: 500, title: "Autoryzacja", message: error.message}));
            
        }
    }

    navigate('/');
}