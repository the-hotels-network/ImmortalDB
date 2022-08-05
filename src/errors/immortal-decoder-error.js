import { ImmortalError } from './immortal-error';

export class ImmortalDecoderError extends ImmortalError {
    constructor(message = 'Unable to decode the stored value') {
        super(message);
        this.name = 'ImmortalDecoderError';
    }
}
