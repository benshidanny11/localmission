import { jwtDecode } from "jwt-decode";

export const decodeJWT=(token)=>{
    const decoded = jwtDecode(token);
    return decoded;
}