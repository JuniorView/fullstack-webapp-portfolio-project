import {configureStore, } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice.jsx"

export const store = configureStore({
    reducer: {
        user:userReducer,
    },
    //to avoid serialization
    middelware: (getDefaultMiddleware) => {
        getDefaultMiddleware({serializableCheck: false});
    },
});