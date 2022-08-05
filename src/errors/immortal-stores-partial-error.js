import { ImmortalError } from './immortal-error';

export class ImmortalStoresPartialError extends ImmortalError {
    constructor(message = 'Some stores failed to perform operation') {
        super(message);
        this.name = 'ImmortalStoresPartialError';
    }
}
