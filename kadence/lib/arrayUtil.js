function removeFromArray(arr, idx) {
    const arrayCopy = [...arr];
    arrayCopy.splice(idx, 1);
    return arrayCopy;
}

function appendToArray(arr, item) {
    return [...arr, item];
}

function shuffleArray(arr) {
    return arr
        .map((a) => ({ value: a, _val: Math.random() }))
        .sort((a, b) => a._val - b._val)
        .map(({ value }) => value);
}

export { removeFromArray, appendToArray, shuffleArray };
