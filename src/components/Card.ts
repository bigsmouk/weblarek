import { Component } from './base/Component';
import { IEvents } from './base/Events';
import { IProduct } from '../types';
import { categoryMap } from '../utils/constants';

export class Card<T extends IProduct> extends Component<T> {
    protected title: HTMLElement;
    protected price: HTMLElement;
    protected button: HTMLButtonElement;
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;
        this.title = container.querySelector('.card__title') as HTMLElement;
        this.price = container.querySelector('.card__price') as HTMLElement;
        this.button = container.querySelector('.card__button') as HTMLButtonElement;
    }

    setData(data: T): void {
        this.setText(this.title, data.title);
        this.setText(this.price, data.price !== null ? `${data.price} синапсов` : 'Недоступно');
        
        if (data.price === null) {
            this.setDisabled(this.button, true);
            this.setText(this.button, 'Недоступно');
        } else {
            this.setDisabled(this.button, false);
        }
    }

    setDisabled(button: HTMLButtonElement, disabled: boolean): void {
        if (disabled) {
            button.setAttribute('disabled', 'disabled');
        } else {
            button.removeAttribute('disabled');
        }
    }
}