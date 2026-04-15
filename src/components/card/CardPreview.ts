import { Card } from '../Card';
import { IProduct } from '../../types';
import { categoryMap } from '../../utils/constants';
import { CDN_URL } from '../../utils/constants';

export class CardPreview extends Card<IProduct> {
    protected description: HTMLElement;
    protected category: HTMLElement;
    protected image: HTMLImageElement;
    protected button: HTMLButtonElement;

    constructor(container: HTMLElement, onAction: () => void) {
        super(container);
        this.description = container.querySelector('.card__text') as HTMLElement;
        this.category = container.querySelector('.card__category') as HTMLElement;
        this.image = container.querySelector('.card__image') as HTMLImageElement;
        this.button = container.querySelector('.card__button') as HTMLButtonElement;
        
        this.button.addEventListener('click', onAction);
    }

    setData(data: IProduct): void {
        super.setData(data);
        this.setText(this.description, data.description);
        this.setText(this.category, data.category);
        this.setImage(this.image, CDN_URL + data.image, data.title);
        
        const categoryClass = categoryMap[data.category as keyof typeof categoryMap];
        if (categoryClass) {
            this.category.classList.add(categoryClass);
        }
        
        // Удали эту строку:
        // this.container.setAttribute('data-id', data.id);
        
        if (data.price === null) {
            this.button.setAttribute('disabled', 'disabled');
            this.button.textContent = 'Недоступно';
        }
    }

    setButtonText(isInCart: boolean): void {
        this.button.textContent = isInCart ? 'Удалить из корзины' : 'Купить';
        this.button.removeAttribute('disabled');
    }
}