function convertDate(date) {
    return `${date.slice(8, 10)}.${date.slice(5, 7)}.${date.slice(0, 4)} ${Number(date.slice(11, 13)) + 3}${date.slice(13, 16)}`;
}

export {convertDate};