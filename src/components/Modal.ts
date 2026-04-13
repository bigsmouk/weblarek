import { Component } from './base/Component';

export class Modal extends Component<{ content: HTMLElement }> {
    protected modal: HTMLElement;
    protected contentContainer: HTMLElement;
    protected closeButton: HTMLElement;

    constructor(container: HTMLElement, onClose: () => void) {
        super(container);
        this.modal = container;
        this.contentContainer = container.querySelector('.modal__content') as HTMLElement;
        this.closeButton = container.querySelector('.modal__close') as HTMLElement;

        this.closeButton.addEventListener('click', onClose);
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) onClose();
        });
    }

    open(): void {
        this.modal.classList.add('modal_active');
    }

    close(): void {
        this.modal.classList.remove('modal_active');
    }

    setContent(content: HTMLElement): void {
        this.contentContainer.innerHTML = '';
        this.contentContainer.appendChild(content);
    }

    render(): HTMLElement {
        return this.container;
    }
}