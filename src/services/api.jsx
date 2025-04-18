import axios from "axios";
import { useEffect, } from "react";
import { useNavigate } from "react-router-dom";

const API = axios.create({
    baseURL: "http://192.168.121.47:5000", // Backend URL
    withCredentials: true
});
//"http://192.168.254.47:5000"
//https://sellease-backend.onrender.com
export const signup = (userData) => API.post("/auth/signup", userData);

// Verify OTP & Complete Signup
export const verifyOTP = (data) => {
    return API.post("/auth/verify-otp", data, {
        headers: { "Content-Type": "application/json" }
    });
};


// Login User
export const login = (credentials) => API.post("/auth/login", credentials);
export const sell = (formData) => API.post("/sell/", formData, {
    headers: {
        "Content-Type": "multipart/form-data", // Let Axios handle FormData
    }
});
export const forgotPass = (email) =>API.post("auth/Forgot_Password", { email });//forgot password
export const BuyItem = () =>
    API.get("/buy", {
        headers: {
            "Content-Type": "application/json",
        },
    });
// Logout User
export const logout = () => {
    API.post("/auth/logout");
}
export const historyFetch = () =>
    API.get("/history", {
        headers: {
            "Content-Type": "application/json",
        },
    });
export const check = (isLoggedIn) => {
    const navigate = useNavigate();
    useEffect(() => {
        //console.log(isLoggedIn);
        if (!isLoggedIn) {
            navigate("/login");
        }
    });

}
export const unreadMessage = () => {
    return API.get("/api/chat/unread", {
        headers: {
            "Content-Type": "application/json",
        },
    });
}
export const chatHistory = (sellerId) => {
    return API.post("/api/chat/history", { sellerId }, {
        headers: {
            "Content-Type": "application/json",
        },
    });
}
export const chatSeen = (sellerId) => {
    return API.put("/api/chat/markAsRead", { sellerId }, {
        headers: {
            "Content-Type": "application/json",
        },
    });
}
export const getChatUsers = () =>
    API.get("/api/chat/chatUser", {
        headers: {
            "Content-Type": "application/json",
        },
    });
export const SetName = (friendId, friendName) => API.post("api/chat/setName", { friendId, friendName });//save name
export const GetName = (friendId) => API.post("api/chat/getName", { friendId });//get name
export default API;
