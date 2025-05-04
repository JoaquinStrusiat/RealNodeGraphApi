class ErrorState extends Error {
    constructor(codigo, title, message) {
        super(message);
        this.title = title || 'Error State';
        this.statusCode = codigo || 400;
        this.name = 'ErrorState';
        Error.captureStackTrace?.(this, ErrorState);
    }

    toResponse() {
        return {
            title: this.title,
            message: this.message,
            statusCode: this.statusCode
        };
    }
}
module.exports = ErrorState;