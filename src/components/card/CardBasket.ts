import { Card } from '../Card';
import { IProduct } from '../../types';

export class CardBasket extends Card<IProduct> {
    protected index: HTMLElement;
    protected button: HTMLButtonElement;
    private productId: string = '';

    constructor(container: HTMLElement, onRemove: (id: string) => void) {
        super(container);
        this.index = container.querySelector('.basket__item-index') as HTMLElement;
        this.button = container.querySelector('.card__button') as HTMLButtonElement;
        
        this.button.addEventListener('click', () => {
            if (this.productId) onRemove(this.productId);
        });
    }

    setData(data: IProduct, index: number): void {
        super.setData(data);
        this.productId = data.id;
        this.setText(this.index, String(index));
    }
}