// import React , {createContext,useState,useEffect} from 'react';
// import axiosInstance from '../utils/axiosInstance';
// import {API_PATHS} from '../utils/apiPaths';

// export const UserContext=createContext();

// const UserProvider=({children})=>{
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         if(user) return;

//         const accessToken = localStorage.getItem("token");
//         if(!accessToken){
//             setLoading(false);
//             return;
//         }

//         const fetchUser = async () => {
//             try {
//                 const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
//                 setUser(response.data);
//             } catch (error) {
//                 console.error("User not authenticated", error);
//                 clearUser();
//             }finally{
//                 setLoading(false);
//             }
//         };

//         fetchUser();
//     }, []);

//     const updateUser = (userData) => {
//         setUser(userData);
//         localStorage.setItem("token",userData.token);//Save token
//         setLoading(false);
//     };

//     const clearUser = () => {
//         setUser(null);
//         localStorage.removeItem("token");
//     };

//     return (
//         <UserContext.Provider value={{ user,loading,updateUser,clearUser }}>
//             {children}
//         </UserContext.Provider>
//     );
// };

// export default UserProvider;






import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // ✅ Try to load user from localStorage first
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
                setLoading(false);
                return;
            } catch (e) {
                console.error("Failed to parse saved user", e);
            }
        }

        // If no saved user, try to fetch from API
        const accessToken = localStorage.getItem("token");
        if (!accessToken) {
            setLoading(false);
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
                setUser(response.data);
                // ✅ Save to localStorage
                localStorage.setItem("user", JSON.stringify(response.data));
            } catch (error) {
                console.error("User not authenticated", error);
                clearUser();
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem("token", userData.token); // Save token
        // ✅ Save user object to localStorage
        localStorage.setItem("user", JSON.stringify(userData));
        setLoading(false);
    };

    const clearUser = () => {
        setUser(null);
        localStorage.removeItem("token");
        // ✅ Remove user object from localStorage
        localStorage.removeItem("user");
    };

    return (
        <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
