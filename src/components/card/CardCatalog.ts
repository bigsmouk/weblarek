import { Card } from '../Card';
import { IProduct } from '../../types';
import { categoryMap } from '../../utils/constants';
import { CDN_URL } from '../../utils/constants';

export class CardCatalog extends Card<IProduct> {
    protected category: HTMLElement;
    protected image: HTMLImageElement;

    constructor(container: HTMLElement, onClick: () => void) {
        super(container);
        this.category = container.querySelector('.card__category') as HTMLElement;
        this.image = container.querySelector('.card__image') as HTMLImageElement;
        
        container.addEventListener('click', () => {
            onClick();
        });
    }

    setData(data: IProduct): void {
        super.setData(data);
        this.setText(this.category, data.category);
        this.setImage(this.image, CDN_URL + data.image, data.title);
        
        const categoryClass = categoryMap[data.category as keyof typeof categoryMap];
        if (categoryClass) {
            this.category.classList.add(categoryClass);
        }
    }
}
