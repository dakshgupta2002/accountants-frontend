const base = "http://localhost:3333";


export const post = async (method, url, data = null) => {
    const URL = `${base}/${url}`;
    const response = await fetch(URL, {
        method: method,
        headers: {
            'content-type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            Authorization: localStorage.getItem("token")
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    
    return await response.json(); // parses JSON response into native JavaScript objects
}

export const get = async (url) => {
    const URL = `${base}/${url}`;
    const response = await fetch(URL, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            Authorization: localStorage.getItem("token")
        }
    });
    return await response.json(); // parses JSON response into native JavaScript objects
}