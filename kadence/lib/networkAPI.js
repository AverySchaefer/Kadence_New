import HTTPError from './errors/HTTPError';

async function fetchWrapper(url, method = 'GET', data = {}) {
    const options = {
        method,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    };

    // Add body if not GET request (they can't have body, only query params)
    if (method !== 'GET') {
        options.body = JSON.stringify(data);
    }

    const resp = await fetch(url, options);
    if (!resp.ok) {
        throw new HTTPError(resp);
    }
    return resp.json();
}

const NetworkAPI = {
    _fetch(url, method, data) {
        switch (method.trim().toUpperCase()) {
            case 'GET':
                return this.get(url, data);
            case 'POST':
                return this.post(url, data);
            case 'PATCH':
                return this.patch(url, data);
            case 'DELETE':
                return this.delete(url, data);
            default:
                throw new Error('Method not supported');
        }
    },

    get(url, queryParams = {}) {
        // Convert null to undefined for GET Requests
        const paramsCopy = { ...queryParams };
        paramsCopy.forEach((param) => {
            if (paramsCopy[param] === null) delete paramsCopy[param];
        });

        // Add query parameters into URL
        const finalURL =
            Object.keys(paramsCopy).length > 0
                ? `${url}?${new URLSearchParams(paramsCopy).toString()}`
                : url;

        // Do GET Request on finalized URL
        return fetchWrapper(finalURL, 'GET');
    },

    post(url, data) {
        return fetchWrapper(url, 'POST', data);
    },

    patch(url, data) {
        return fetchWrapper(url, 'PATCH', data);
    },

    delete(url, data) {
        return fetchWrapper(url, 'DELETE', data);
    },
};

export default NetworkAPI;
