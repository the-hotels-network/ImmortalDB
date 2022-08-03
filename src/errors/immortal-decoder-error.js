export class ImmortalDecoderError extends Error {
    constructor(message = 'Unable to decode the stored value') {
        super(message);
        this.name = 'ImmortalDecoderError';
    }
}
