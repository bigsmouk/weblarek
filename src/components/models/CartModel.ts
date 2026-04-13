import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class CartModel {
    private _items: IProduct[] = [];
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    getItems(): IProduct[] {
        return this._items;
    }

    addItem(product: IProduct): void {
        if (!this.isProductInCart(product.id)) {
            this._items.push(product);
            this.events.emit('cart:changed', this._items);
        }
    }

    removeItem(productId: string): void {
        this._items = this._items.filter(item => item.id !== productId);
        this.events.emit('cart:changed', this._items);
    }

    clear(): void {
        this._items = [];
        this.events.emit('cart:changed', this._items);
    }

    getTotalPrice(): number {
        return this._items.reduce((total, item) => {
            return total + (item.price ?? 0);
        }, 0);
    }

    getItemCount(): number {
        return this._items.length;
    }

    isProductInCart(productId: string): boolean {
        return this._items.some(item => item.id === productId);
    }

    getItemsIds(): string[] {
        return this._items.map(item => item.id);
    }
}