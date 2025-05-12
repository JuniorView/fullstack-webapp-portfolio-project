import {createSlice} from '@reduxjs/toolkit';

export const userSlice = createSlice ({
    name: "user",
    initialState: {
        tokenexpiration : "",
        idnumber: "",
        phone: "",
        email: "",
        username: "",
        doctor: false,
        admin: false,

    },
    reducers: {
        login: (state, action) => {
            console.log("from userSlice " , action.payload);
            const {
                idnumber,
                phone,
                email,
                username,
                doctor,
                admin,
                tokenexpiration,
            } = action.payload;

            state.idnumber = idnumber;
            state.phone = phone;
            state.email = email;
            state.username = username;
            state.doctor = doctor;
            state.admin = admin;
            state.tokenexpiration = tokenexpiration;

        },
        logout: (state) => {  /// i don't use state here , because I don't receive any value from backend
            state.idnumber = "";
            state.phone = "";
            state.email = "";
            state.username = "";
            state.doctor = false;
            state.admin = false;
            state.tokenexpiration = "";
        }
    }
});
// so that we can use the userslice function , we need to do this :

export const {login, logout} = userSlice.actions;
export default userSlice.reducer;
//✅ reducers (Plural) → Enthält mehrere Funktionen zur State-Änderung (setUser, clearUser …).
//✅ reducer (Singular) → Ist die Hauptfunktion, die Redux im Store verwendet.
//
// 🚀 Deshalb exportieren wir userSlice.reducer (ohne "s"), weil Redux nur EINE Funktion erwartet!

