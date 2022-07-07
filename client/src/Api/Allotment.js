import { get, post } from "./rest"

export const FetchAllotment = async () => {
    const res = await get("allotment");
    return res;
}

export const CreateAllotment = async (data) => {
    const res = await post("POST", "allotment", data);
    return res;
}