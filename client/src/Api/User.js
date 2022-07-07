import { post } from "./rest";

export const UserRegister = async (data) => {
    const res = await post("POST", "user/register", {
        "email": data
    });
    return res;
}

export const UserVerify = async (data) => {
    const res = await post("POST", "user/register/verify", data);
    return res;
}

export const UserCreate = async (data) => {
    const res = await post("POST", "user/register/create", data);
    return res;
}

export const UserLogin = async (data) => {
    const res = await post("POST", "user/login", data);
    return res;
}

export const isAdmin = async (token) => {
    const res = await post("POST", "user/isAdmin", {
        token: token
    });
    if (res.status===200) {
        return true;
    }else return false;
}

export const removeAccount = async (token) => {
    const res = await post("POST", "user/removeAccount",{
        token
    });
    return res;
}