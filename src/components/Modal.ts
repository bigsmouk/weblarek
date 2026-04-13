import { Component } from './base/Component';
import { IEvents } from './base/Events';

export class Modal extends Component<{}> {
    protected modal: HTMLElement;
    protected content: HTMLElement;
    protected closeButton: HTMLElement;
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;
        this.modal = container;
        this.content = container.querySelector('.modal__content') as HTMLElement;
        this.closeButton = container.querySelector('.modal__close') as HTMLElement;

        this.closeButton.addEventListener('click', () => this.close());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });
    }

    open(): void {
        this.modal.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    close(): void {
        this.modal.classList.remove('modal_active');
        this.events.emit('modal:close');
    }

    setContent(content: HTMLElement): void {
        this.content.innerHTML = '';
        this.content.appendChild(content);
    }

    render(data?: {}): HTMLElement {
        return this.container;
    }
}