import { Component } from './base/Component';
import { IProduct } from '../types';

export class Card<T extends IProduct> extends Component<T> {
    protected title: HTMLElement;
    protected price: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this.title = container.querySelector('.card__title') as HTMLElement;
        this.price = container.querySelector('.card__price') as HTMLElement;
    }

    setData(data: T): void {
        this.setText(this.title, data.title);
        this.setText(this.price, data.price !== null ? `${data.price} синапсов` : 'Недоступно');
    }
}