import './scss/styles.scss';
import { Api } from './components/base/Api';
import { LarekApi } from './components/LarekApi';
import { ProductsModel } from './components/models/ProductsModel';
import { CartModel } from './components/models/CartModel';
import { BuyerModel } from './components/models/BuyerModel';
import { API_URL } from './utils/constants';

const productsModel = new ProductsModel();
const cartModel = new CartModel();
const buyerModel = new BuyerModel();
const api = new Api(API_URL);
const larekApi = new LarekApi(api);

larekApi.getProducts()
    .then(response => {
        console.log('Сервер ответил:', response);
        productsModel.setItems(response.items);
        console.log('Товары сохранены в модель:', productsModel.getItems());
    })
    .catch(err => {
        console.log('Ошибка сервера:', err);
    });