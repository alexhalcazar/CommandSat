/**
 * Base Error for all CommandSat errors
 * @class CommandSatError
 * @extends Error
 * @param {string} message - Human-readable error message
 * @param {number} status - HTTP status code associated with error
 */
export class CommandSatError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
        this.name = this.constructor.name;
    }
}

/**
 * Error thrown when the server responds with an error status
 * @class ServerResponseError
 * @extends CommandSatError
 * @param {string} [message='Server encountered an error'] - Optional custom message
 * @param {number} status - HTTP status code from the server response
 */
export class ServerResponseError extends CommandSatError {
    constructor(message = 'Server encountered an error', status) {
        super(message, status);
    }
}

/**
 * Error thrown when the client did not receive a reponse from the server
 * @class NoResponseError
 * @extends CommandSatError
 * @param {string} [message='No response from the server'] - Optional custom message
 * @param {number} [status=503] - Optional HTTP status code
 *
 */
export class NoResponseError extends CommandSatError {
    constructor(message = 'No response from the server', status = 503) {
        super(message, status);
    }
}

/**
 * Error thrown if client failed to send the request
 * @class RequestSetupError
 * @extends CommandSatError
 * @param {string} message - Error message
 * @param {number} [status=500] - Optional HTTP status code
 *
 */
export class RequestSetupError extends CommandSatError {
    constructor(message, status = 500) {
        super(message, status);
    }
}
