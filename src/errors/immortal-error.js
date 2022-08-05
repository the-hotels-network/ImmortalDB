export class ImmortalError extends Error {
    constructor(message = 'ImmortalDB unexpected error') {
        super(message);
        this.name = 'ImmortalError';
    }
}
