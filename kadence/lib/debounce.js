export default function debounce(func, delay = 250) {
    let timeout = null;

    return (...args) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            func(...args);
        }, delay);
    };
}
