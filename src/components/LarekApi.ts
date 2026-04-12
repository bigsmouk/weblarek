import { Api } from './base/Api';
import { IOrder, IOrderResponse, IProductsResponse } from '../types';

export class LarekApi {
    constructor(private _api: Api) {}

    // GET /product — получение каталога товаров
    getProducts(): Promise<IProductsResponse> {
        return this._api.get('/product') as Promise<IProductsResponse>;
    }

    // POST /order — отправка заказа
    postOrder(order: IOrder): Promise<IOrderResponse> {
        return this._api.post('/order', order) as Promise<IOrderResponse>;
    }
}