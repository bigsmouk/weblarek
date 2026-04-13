import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IProduct } from '../../types';

export class CardBasket extends Component<IProduct> {
    protected title: HTMLElement;
    protected price: HTMLElement;
    protected index: HTMLElement;
    protected button: HTMLButtonElement;
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;
        this.title = container.querySelector('.card__title') as HTMLElement;
        this.price = container.querySelector('.card__price') as HTMLElement;
        this.index = container.querySelector('.basket__item-index') as HTMLElement;
        this.button = container.querySelector('.card__button') as HTMLButtonElement;
        
        this.button.addEventListener('click', () => {
            const id = this.container.getAttribute('data-id');
            events.emit('basket:remove', { id });
        });
    }

    setData(data: IProduct): void {
        this.setText(this.title, data.title);
        this.setText(this.price, data.price !== null ? `${data.price} синапсов` : 'Недоступно');
        this.container.setAttribute('data-id', data.id);
    }

    setIndex(index: number): void {
        this.setText(this.index, String(index));
    }
}