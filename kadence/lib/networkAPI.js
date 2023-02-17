function fetch_wrapper(url, method = 'GET', data = {}) {
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

    return new Promise((resolve, reject) => {
        fetch(url, options)
            .then((resp) => {
                if (resp.ok) {
                    resp.text().then((text) => {
                        try {
                            const body = JSON.parse(text);
                            return resolve({
                                status: resp.status,
                                message: resp.statusText,
                                data: body,
                            });
                        } catch (err) {
                            return resolve({
                                status: resp.status,
                                message: resp.statusText,
                                data: text,
                            });
                        }
                    });
                } else {
                    resp.text().then((errorObj) => {
                        try {
                            const body = JSON.parse(errorObj);
                            return reject({
                                status: resp.status,
                                message: resp.statusText,
                                error: body,
                            });
                        } catch (err) {
                            return reject({
                                status: resp.status,
                                message: resp.statusText,
                                error: errorObj,
                            });
                        }
                    });
                }
            })
            .catch((error) => {
                reject({
                    status: -1,
                    message: `Error: ${error.message}`,
                    error: error,
                });
            });
    });
}

const NetworkAPI = {
    _fetch: function (url, method, data) {
        switch (method.trim().toUpperCase()) {
            case 'GET':
                return this.get(url, data);
            case 'POST':
                return this.post(url, data);
            case 'PATCH':
                return this.patch(url, data);
            case 'DELETE':
                return this.delete(url, data);
        }
    },

    get: function (url, queryParams = {}) {
        // Convert null to undefined for GET Requests
        const paramsCopy = { ...queryParams };
        for (const param in paramsCopy) {
            if (paramsCopy[param] === null) delete paramsCopy[param];
        }
        // Add query parameters into URL
        if (Object.keys(paramsCopy).length > 0) {
            url = `${url}?${new URLSearchParams(paramsCopy).toString()}`;
        }
        // Do GET Request on finalized URL
        return fetch_wrapper(url, 'GET');
    },

    post: function (url, data) {
        return fetch_wrapper(url, 'POST', data);
    },

    patch: function (url, data) {
        return fetch_wrapper(url, 'PATCH', data);
    },

    delete: function (url, data) {
        return fetch_wrapper(url, 'DELETE', data);
    },
};

export default NetworkAPI;
