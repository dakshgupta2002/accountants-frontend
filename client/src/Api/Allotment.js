import { get, post } from "./rest"

export const FetchAllotment = async () => {
    const res = await get("allotment");
    return res;
}

export const CreateAllotment = async (data) => {
    const res = await post("POST", "allotment", data);
    return res;
}

export const UpdateAllotment = async (data) => {
    const res = await post("PUT", "allotment", data);
    return res;
}

export const RemoveAllotment = async (data) => {
    const res = await post("DELETE", "allotment", data)
    return res;
}