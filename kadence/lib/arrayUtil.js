function removeFromArray(arr, idx) {
    const arrayCopy = [...arr];
    arrayCopy.splice(idx, 1);
    return arrayCopy;
}

function appendToArray(arr, item) {
    return [...arr, item];
}

export { removeFromArray, appendToArray };
