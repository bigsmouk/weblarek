import './scss/styles.scss';
import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { LarekApi } from './components/LarekApi';
import { ProductsModel } from './components/models/ProductsModel';
import { CartModel } from './components/models/CartModel';
import { BuyerModel } from './components/models/BuyerModel';
import { Modal } from './components/Modal';
import { Basket } from './components/Basket';
import { OrderForm } from './components/OrderForm';
import { ContactsForm } from './components/ContactsForm';
import { Success } from './components/Success';
import { API_URL } from './utils/constants';
import { IOrder } from './types';
import { CardCatalog } from './components/card/CardCatalog';
import { CardPreview } from './components/card/CardPreview';
import { CardBasket } from './components/card/CardBasket';

// Создаем экземпляры
const events = new EventEmitter();
const api = new Api(API_URL);
const larekApi = new LarekApi(api);
const productsModel = new ProductsModel(events);
const cartModel = new CartModel(events);
const buyerModel = new BuyerModel(events);

// DOM элементы
const gallery = document.querySelector('.gallery') as HTMLElement;
const basketButton = document.querySelector('.header__basket') as HTMLElement;
const basketCounter = basketButton.querySelector('.header__basket-counter') as HTMLElement;
const modalContainer = document.querySelector('#modal-container') as HTMLElement;

// Компоненты
const modal = new Modal(modalContainer, events);
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const basketContainer = basketTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
const basket = new Basket(basketContainer, events);

// Хелпер для обновления счетчика корзины
function updateBasketCounter() {
    basketCounter.textContent = String(cartModel.getItemCount());
}

// Подписка на события моделей
events.on('products:changed', () => {
    const cards = productsModel.getItems().map(product => {
        const cardTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
        const cardElement = cardTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
        const card = new CardCatalog(cardElement, events);
        card.setData(product);
        return card.render();
    });
    gallery.replaceChildren(...cards);
});

events.on('cart:changed', () => {
    updateBasketCounter();
});

// Подписка на события представлений
events.on('card:click', (data: { id: string }) => {
    const product = productsModel.getProductById(data.id);
    if (product) {
        const cardTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
        const cardElement = cardTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
        const card = new CardPreview(cardElement, events);
        card.setData(product);
        const isInCart = cartModel.isProductInCart(product.id);
        card.setButtonText(isInCart);
        modal.setContent(card.render());
        modal.open();
    }
});

events.on('card:add', (data: { id: string }) => {
    const product = productsModel.getProductById(data.id);
    if (product && product.price !== null) {
        cartModel.addItem(product);
    }
});

events.on('card:action', (data: { id: string }) => {
    const product = productsModel.getProductById(data.id);
    if (product) {
        if (cartModel.isProductInCart(product.id)) {
            cartModel.removeItem(product.id);
            modal.close();
        } else if (product.price !== null) {
            cartModel.addItem(product);
            modal.close();
        }
    }
});

events.on('basket:open', () => {
    const cards = cartModel.getItems().map((product, index) => {
        const cardTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
        const cardElement = cardTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
        const card = new CardBasket(cardElement, events);
        card.setData(product);
        card.setIndex(index + 1);
        return card.render();
    });
    basket.setItems(cards);
    basket.setTotal(cartModel.getTotalPrice());
    modal.setContent(basketContainer);
    modal.open();
});

events.on('basket:order', () => {
    const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
    const orderElement = orderTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
    const orderForm = new OrderForm(orderElement, events);
    modal.setContent(orderForm.render());
    modal.open();
});

events.on('form:change', (data: { field: string, value: string }) => {
    if (data.field === 'payment') {
        buyerModel.setData({ payment: data.value as 'card' | 'cash' });
    } else if (data.field === 'address') {
        buyerModel.setData({ address: data.value });
    } else if (data.field === 'email') {
        buyerModel.setData({ email: data.value });
    } else if (data.field === 'phone') {
        buyerModel.setData({ phone: data.value });
    }
    
    const activeModal = document.querySelector('.modal_active');
    if (activeModal) {
        const form = activeModal.querySelector('form');
        if (form) {
            const submitButton = form.querySelector('.order__button, .button[type="submit"]') as HTMLButtonElement;
            if (submitButton) {
                const isValid = buyerModel.isFirstStepValid();
                if (isValid) {
                    submitButton.removeAttribute('disabled');
                } else {
                    submitButton.setAttribute('disabled', 'disabled');
                }
            }
        }
    }
});

events.on('form:submit', () => {
    if (!buyerModel.isFirstStepValid()) {
        return;
    }
    const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
    const contactsElement = contactsTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
    const contactsForm = new ContactsForm(contactsElement, events);
    modal.setContent(contactsForm.render());
    modal.open();
});

events.on('contacts:submit', () => {
    if (!buyerModel.isSecondStepValid()) {
        return;
    }
    const order: IOrder = {
        payment: buyerModel.getData().payment!,
        email: buyerModel.getData().email,
        phone: buyerModel.getData().phone,
        address: buyerModel.getData().address,
        total: cartModel.getTotalPrice(),
        items: cartModel.getItemsIds()
    };
    larekApi.postOrder(order)
        .then(response => {
            const successTemplate = document.querySelector('#success') as HTMLTemplateElement;
            const successElement = successTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
            const success = new Success(successElement, events);
            success.setTotal(response.total);
            modal.setContent(success.render());
            modal.open();
            cartModel.clear();
            buyerModel.clear();
        })
        .catch(err => console.log(err));
});

events.on('success:close', () => {
    modal.close();
});

// Загрузка товаров с сервера
larekApi.getProducts()
    .then(response => {
        productsModel.setItems(response.items);
    })
    .catch(err => console.log(err));

// Кнопка корзины
basketButton.addEventListener('click', () => {
    events.emit('basket:open');
});

// Инициализация
updateBasketCounter();