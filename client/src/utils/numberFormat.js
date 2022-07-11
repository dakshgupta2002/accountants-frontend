export function seperator(numb) {
    var str = numb.toString().split(".");
    str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return str.join(".");
}

export function round(numb){
    return Math.round((numb) * 100) / 100;
}