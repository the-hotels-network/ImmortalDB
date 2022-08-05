import { ImmortalError } from './immortal-error';

export class ImmortalStoresTotalError extends ImmortalError {
    constructor(message = 'All stores failed to perform operation') {
        super(message);
        this.name = 'ImmortalStoresPartialError';
    }
}
