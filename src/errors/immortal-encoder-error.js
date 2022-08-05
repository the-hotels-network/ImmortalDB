import { ImmortalError } from './immortal-error';

export class ImmortalEncoderError extends ImmortalError {
    constructor(message = 'Unable to encode the value to be stored') {
        super(message);
        this.name = 'ImmortalEncoderError';
    }
}
