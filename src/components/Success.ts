import { Component } from './base/Component';

export class Success extends Component<{ total: number }> {
    protected closeButton: HTMLButtonElement;
    protected totalElement: HTMLElement;

    constructor(container: HTMLElement, onClose: () => void) {
        super(container);
        this.closeButton = container.querySelector('.order-success__close') as HTMLButtonElement;
        this.totalElement = container.querySelector('.order-success__description') as HTMLElement;
        
        this.closeButton.addEventListener('click', onClose);
    }

    setTotal(total: number): void {
        this.setText(this.totalElement, `Списано ${total} синапсов`);
    }
}