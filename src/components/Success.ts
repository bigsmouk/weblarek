import { Component } from './base/Component';
import { IEvents } from './base/Events';

export class Success extends Component<{ total: number }> {
    protected closeButton: HTMLButtonElement;
    protected total: HTMLElement;
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;
        this.closeButton = container.querySelector('.order-success__close') as HTMLButtonElement;
        this.total = container.querySelector('.order-success__description') as HTMLElement;

        this.closeButton.addEventListener('click', () => {
            this.events.emit('success:close');
        });
    }

    setTotal(total: number): void {
        this.setText(this.total, `Списано ${total} синапсов`);
    }

    close(): void {
        this.container.remove();
    }
}