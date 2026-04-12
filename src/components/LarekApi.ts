import { IApi } from '../types';
import { IOrder, IOrderResponse, IProductsResponse } from '../types';

export class LarekApi {
    constructor(private _api: IApi) {}

    getProducts(): Promise<IProductsResponse> {
        return this._api.get('/product') as Promise<IProductsResponse>;
    }

    postOrder(order: IOrder): Promise<IOrderResponse> {
        return this._api.post('/order', order) as Promise<IOrderResponse>;
    }
}