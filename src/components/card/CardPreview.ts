import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IProduct } from '../../types';
import { categoryMap } from '../../utils/constants';
import { CDN_URL } from '../../utils/constants';

export class CardPreview extends Component<IProduct> {
    protected title: HTMLElement;
    protected price: HTMLElement;
    protected description: HTMLElement;
    protected category: HTMLElement;
    protected image: HTMLImageElement;
    protected button: HTMLButtonElement;
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;
        this.title = container.querySelector('.card__title') as HTMLElement;
        this.price = container.querySelector('.card__price') as HTMLElement;
        this.description = container.querySelector('.card__text') as HTMLElement;
        this.category = container.querySelector('.card__category') as HTMLElement;
        this.image = container.querySelector('.card__image') as HTMLImageElement;
        this.button = container.querySelector('.card__button') as HTMLButtonElement;
        
        this.button.addEventListener('click', () => {
            const id = this.container.getAttribute('data-id');
            if (id) {
                events.emit('card:action', { id });
            }
        });
    }

    setData(data: IProduct): void {
        this.setText(this.title, data.title);
        this.setText(this.price, data.price !== null ? `${data.price} синапсов` : 'Недоступно');
        this.setText(this.description, data.description);
        this.setText(this.category, data.category);
        this.setImage(this.image, CDN_URL + data.image, data.title);
        
        const categoryClass = categoryMap[data.category as keyof typeof categoryMap];
        if (categoryClass) {
            this.category.classList.add(categoryClass);
        }
        
        this.container.setAttribute('data-id', data.id);
        
        if (data.price === null) {
            this.button.setAttribute('disabled', 'disabled');
            this.button.textContent = 'Недоступно';
        }
    }

    setButtonText(isInCart: boolean): void {
        if (this.button) {
            this.button.textContent = isInCart ? 'Удалить из корзины' : 'Купить';
        }
    }
}