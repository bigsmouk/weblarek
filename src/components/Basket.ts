import { Component } from './base/Component';
import { IEvents } from './base/Events';

export class Basket extends Component<{}> {
    protected list: HTMLElement;
    protected totalPrice: HTMLElement;
    protected button: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.list = container.querySelector('.basket__list') as HTMLElement;
        this.totalPrice = container.querySelector('.basket__price') as HTMLElement;
        this.button = container.querySelector('.basket__button') as HTMLButtonElement;
        
        if (this.button) {
            this.button.addEventListener('click', () => {
                events.emit('basket:order');
            });
        }
    }

    setItems(items: HTMLElement[]): void {
        this.list.innerHTML = '';
        if (items.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.textContent = 'Корзина пуста';
            emptyMessage.style.textAlign = 'center';
            this.list.appendChild(emptyMessage);
            if (this.button) this.button.setAttribute('disabled', 'disabled');
        } else {
            items.forEach(item => this.list.appendChild(item));
            if (this.button) this.button.removeAttribute('disabled');
        }
    }

    setTotal(total: number): void {
        this.setText(this.totalPrice, `${total} синапсов`);
    }
}