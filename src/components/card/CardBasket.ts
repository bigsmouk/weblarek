import { Card } from '../Card';
import { IProduct } from '../../types';

export class CardBasket extends Card<IProduct> {
    protected index: HTMLElement;
    protected button: HTMLButtonElement;

    constructor(container: HTMLElement, onRemove: (id: string) => void) {
        super(container);
        this.index = container.querySelector('.basket__item-index') as HTMLElement;
        this.button = container.querySelector('.card__button') as HTMLButtonElement;
        
        this.button.addEventListener('click', () => {
            const id = this.container.getAttribute('data-id');
            if (id) onRemove(id);
        });
    }

    setData(data: IProduct, index: number): void {
        super.setData(data);
        this.setText(this.index, String(index));
        this.container.setAttribute('data-id', data.id);
    }
}