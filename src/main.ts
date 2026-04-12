import './scss/styles.scss';
import { Api } from './components/base/Api';
import { LarekApi } from './components/LarekApi';
import { ProductsModel } from './components/models/ProductsModel';
import { CartModel } from './components/models/CartModel';
import { BuyerModel } from './components/models/BuyerModel';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';

const productsModel = new ProductsModel();
const cartModel = new CartModel();
const buyerModel = new BuyerModel();
const api = new Api(API_URL);
const larekApi = new LarekApi(api);

// Проверка модели каталога
productsModel.setItems(apiProducts.items);
console.log('Массив товаров из каталога:', productsModel.getItems());
console.log('Товар по id "854cef69...":', productsModel.getProductById('854cef69-976d-4c2a-a18c-2aa45046c390'));
productsModel.setSelectedProduct(apiProducts.items[0]);
console.log('Выбранный товар для просмотра:', productsModel.getSelectedProduct());

// Проверка модели корзины
cartModel.addItem(apiProducts.items[0]);
cartModel.addItem(apiProducts.items[1]);
console.log('Товары в корзине после добавления:', cartModel.getItems());
console.log('Общая стоимость корзины:', cartModel.getTotalPrice());
console.log('Количество товаров в корзине:', cartModel.getItemCount());
console.log('Есть ли товар "854cef69..." в корзине?:', cartModel.isProductInCart('854cef69-976d-4c2a-a18c-2aa45046c390'));
cartModel.removeItem(apiProducts.items[0].id);
console.log('Товары в корзине после удаления:', cartModel.getItems());
console.log('Массив id товаров в корзине:', cartModel.getItemsIds());
cartModel.clear();
console.log('Корзина после очистки:', cartModel.getItems());

// Проверка модели покупателя
buyerModel.setData({ payment: 'card', address: 'ул. Пушкина, д.1' });
buyerModel.setData({ email: 'test@example.com', phone: '+79991234567' });
console.log('Данные покупателя:', buyerModel.getData());
console.log('Первый шаг формы (оплата+адрес) валиден?:', buyerModel.isFirstStepValid());
console.log('Второй шаг формы (email+телефон) валиден?:', buyerModel.isSecondStepValid());
console.log('Ошибки валидации:', buyerModel.validate());
buyerModel.clear();
console.log('Данные покупателя после очистки:', buyerModel.getData());

// Запрос к серверу
larekApi.getProducts()
    .then(response => {
        console.log('Ответ сервера с товарами:', response);
        productsModel.setItems(response.items);
        console.log('Товары с сервера сохранены в каталог:', productsModel.getItems());
    })
    .catch(err => {
        console.log('Ошибка при запросе к серверу:', err);
    });