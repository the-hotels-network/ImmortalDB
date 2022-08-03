export class ImmortalEncoderError extends Error {
    constructor(message = 'Unable to encode the value to be stored') {
        super(message);
        this.name = 'ImmortalEncoderError';
    }
}
