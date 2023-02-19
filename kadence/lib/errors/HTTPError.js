/**
 * Class representing an HTTP error response, which makes the status code and statusText available for front end error handling
 * @extends Error
 */
export default class HTTPError extends Error {
    /**
     * @param {Response} resp - The response object received from a failed HTTP request.
     * @param {Object} [options={}] - Additional options to pass to the Error constructor.
     * @param {String} customMessage Allows override of error message, which is resp.statusText by default.
     */
    constructor(resp, options = {}, customMessage = undefined) {
        super(customMessage || resp.statusText, options);

        if (resp.ok) {
            throw new Error(
                'HTTPError cannot be instantiated with non-error responses'
            );
        }
        this.status = resp.status;
        this.statusText = resp.statusText;
    }
}
