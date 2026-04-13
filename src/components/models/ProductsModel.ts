import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class ProductsModel {
    private _items: IProduct[] = [];
    private _selectedProduct: IProduct | null = null;
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    setItems(items: IProduct[]): void {
        this._items = items;
        this.events.emit('products:changed', this._items);
    }

    getItems(): IProduct[] {
        return this._items;
    }

    getProductById(id: string): IProduct | undefined {
        return this._items.find(item => item.id === id);
    }

    setSelectedProduct(product: IProduct): void {
        this._selectedProduct = product;
        this.events.emit('product:selected', this._selectedProduct);
    }

    getSelectedProduct(): IProduct | null {
        return this._selectedProduct;
    }
}