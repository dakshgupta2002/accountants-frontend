import { get, post } from "./rest";

export const GetEmployee = async (id) => {
    const res = await get(`salary/${id}`);
    return res;
}

export const PostEmployee = async (id, data) => {
    const res = await post("POST", `salary/${id}`, data);
    return res;
}