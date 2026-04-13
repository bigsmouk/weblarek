import { Component } from './base/Component';

export class Basket extends Component<{ items: HTMLElement[], total: number }> {
    protected list: HTMLElement;
    protected totalPrice: HTMLElement;
    protected button: HTMLButtonElement;

    constructor(container: HTMLElement, onOrder: () => void) {
        super(container);
        this.list = container.querySelector('.basket__list') as HTMLElement;
        this.totalPrice = container.querySelector('.basket__price') as HTMLElement;
        this.button = container.querySelector('.basket__button') as HTMLButtonElement;
        
        this.button.addEventListener('click', onOrder);
    }

    setItems(items: HTMLElement[]): void {
        this.list.innerHTML = '';
        if (items.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.textContent = 'Корзина пуста';
            emptyMessage.style.textAlign = 'center';
            this.list.appendChild(emptyMessage);
            this.button.setAttribute('disabled', 'disabled');
        } else {
            items.forEach(item => this.list.appendChild(item));
            this.button.removeAttribute('disabled');
        }
    }

    setTotal(total: number): void {
        this.setText(this.totalPrice, `${total} синапсов`);
    }
}