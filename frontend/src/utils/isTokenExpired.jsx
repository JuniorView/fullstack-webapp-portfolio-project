import {jwtDecode} from "jwt-decode";

export function formatTime (timestamp){
    const date = new Date(timestamp * 1000);
    const hour  = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hour}:${minutes}`;
}

export  function isTokenExpired(token) {
    if (token) {
        const decodedToken = jwtDecode(token);
        //current time in utc
        const currentTimeUTC = Math.floor( Date.now() / 1000);
        const expirationTimeUTC = decodedToken.exp ;

        const expirationTimeFormatted = formatTime(expirationTimeUTC);
        const currentLocalTimeFormatted = formatTime(currentTimeUTC);

        console.log(currentLocalTimeFormatted);
        console.log(expirationTimeFormatted);

        // if expirationTmeUtc is less than currentTimeUTc , sign user out
        return expirationTimeUTC < currentTimeUTC;
    } else {
        // if no token provided , consider it as expired
        return true;
    }
}