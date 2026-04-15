import './scss/styles.scss';
import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { LarekApi } from './components/LarekApi';
import { ProductsModel } from './components/models/ProductsModel';
import { CartModel } from './components/models/CartModel';
import { BuyerModel } from './components/models/BuyerModel';
import { Modal } from './components/Modal';
import { Basket } from './components/Basket';
import { Gallery } from './components/Gallery';
import { OrderForm } from './components/OrderForm';
import { ContactsForm } from './components/ContactsForm';
import { Success } from './components/Success';
import { CardCatalog } from './components/card/CardCatalog';
import { CardPreview } from './components/card/CardPreview';
import { CardBasket } from './components/card/CardBasket';
import { API_URL, CDN_URL } from './utils/constants';
import { IOrder } from './types';

// ========== ИНИЦИАЛИЗАЦИЯ ==========
const events = new EventEmitter();
const api = new Api(API_URL);
const larekApi = new LarekApi(api);
const productsModel = new ProductsModel(events);
const cartModel = new CartModel(events);
const buyerModel = new BuyerModel(events);

// ========== DOM ЭЛЕМЕНТЫ ==========
const modalContainer = document.querySelector('#modal-container') as HTMLElement;
const galleryContainer = document.querySelector('.gallery') as HTMLElement;
const basketButton = document.querySelector('.header__basket') as HTMLElement;
const basketCounter = basketButton.querySelector('.header__basket-counter') as HTMLElement;

// ========== СОЗДАНИЕ ПРЕДСТАВЛЕНИЙ (ОДИН РАЗ) ==========
let modal: Modal;
let gallery: Gallery;
let basket: Basket;
let orderForm: OrderForm;
let contactsForm: ContactsForm;
let cardPreview: CardPreview;
let successView: Success;

// Функции для обновления UI
function updateBasketCounter() {
    basketCounter.textContent = String(cartModel.getItemCount());
}

function updateBasketView() {
    const cards = cartModel.getItems().map((product, index) => {
        const cardTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
        const cardElement = cardTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
        const card = new CardBasket(cardElement, () => {
            cartModel.removeItem(product.id);
        });
        card.setData(product, index + 1);
        return card.render();
    });
    basket.setItems(cards);
    basket.setTotal(cartModel.getTotalPrice());
}

function updateOrderFormValidity() {
    if (orderForm) {
        const isValid = buyerModel.isFirstStepValid();
        orderForm.setValid(isValid);
        const errors = buyerModel.validate();
        const errorMessages = [errors.payment, errors.address].filter(Boolean).join(', ');
        orderForm.setErrors(errorMessages);
        if (buyerModel.getData().payment) {
            orderForm.setPayment(buyerModel.getData().payment!);
        }
    }
}

function updateContactsFormValidity() {
    if (contactsForm) {
        const isValid = buyerModel.isSecondStepValid();
        contactsForm.setValid(isValid);
        const errors = buyerModel.validate();
        const errorMessages = [errors.email, errors.phone].filter(Boolean).join(', ');
        contactsForm.setErrors(errorMessages);
    }
}

// ========== СОЗДАНИЕ ПРЕДСТАВЛЕНИЙ ==========
modal = new Modal(modalContainer, () => modal.close());
gallery = new Gallery(galleryContainer);
basket = new Basket(
    document.querySelector('#basket')!.content.firstElementChild!.cloneNode(true) as HTMLElement,
    () => events.emit('basket:order')
);
orderForm = new OrderForm(
    document.querySelector('#order')!.content.firstElementChild!.cloneNode(true) as HTMLElement,
    () => events.emit('order:submit'),
    (field, value) => events.emit('form:change', { field, value })
);
contactsForm = new ContactsForm(
    document.querySelector('#contacts')!.content.firstElementChild!.cloneNode(true) as HTMLElement,
    () => events.emit('contacts:submit'),
    (field, value) => events.emit('form:change', { field, value })
);
cardPreview = new CardPreview(
    document.querySelector('#card-preview')!.content.firstElementChild!.cloneNode(true) as HTMLElement,
    () => events.emit('card:action')
);
successView = new Success(
    document.querySelector('#success')!.content.firstElementChild!.cloneNode(true) as HTMLElement,
    () => {
        modal.close();
        events.emit('success:close');
    }
);

// ========== ПОДПИСКА НА СОБЫТИЯ МОДЕЛЕЙ ==========
events.on('products:changed', () => {
    const cards = productsModel.getItems().map(product => {
        const cardTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
        const cardElement = cardTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
        const card = new CardCatalog(cardElement, () => {
            productsModel.setSelectedProduct(product);
            events.emit('card:selected');
        });
        card.setData(product);
        return card.render();
    });
    gallery.setItems(cards);
});

events.on('cart:changed', () => {
    updateBasketCounter();
    updateBasketView();
});

events.on('buyer:changed', () => {
    updateOrderFormValidity();
    updateContactsFormValidity();
});

// ========== ПОДПИСКА НА СОБЫТИЯ ПРЕДСТАВЛЕНИЙ ==========
events.on('card:selected', () => {
    const product = productsModel.getSelectedProduct();
    if (product) {
        cardPreview.setData(product);
        const isInCart = cartModel.isProductInCart(product.id);
        cardPreview.setButtonText(isInCart);
        modal.setContent(cardPreview.render());
        modal.open();
    }
});

events.on('card:action', () => {
    const product = productsModel.getSelectedProduct();
    if (product && product.price !== null) {
        if (cartModel.isProductInCart(product.id)) {
            cartModel.removeItem(product.id);
        } else {
            cartModel.addItem(product);
        }
        modal.close();
    }
});

events.on('basket:open', () => {
    modal.setContent(basket.render());
    modal.open();
});

events.on('basket:order', () => {
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
});

events.on('order:submit', () => {
    if (buyerModel.isFirstStepValid()) {
        modal.setContent(contactsForm.render());
        modal.open();
    }
});

events.on('contacts:submit', () => {
    if (!buyerModel.isSecondStepValid()) return;
    
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
            successView.setTotal(response.total);
            modal.setContent(successView.render());
            cartModel.clear();
            buyerModel.clear();
        })
        .catch(err => console.log(err));
});

events.on('success:close', () => {
    modal.close();
});

// ========== ЗАГРУЗКА ТОВАРОВ ==========
larekApi.getProducts()
    .then(response => {
        productsModel.setItems(response.items);
    })
    .catch(err => console.log(err));

// ========== КНОПКА КОРЗИНЫ ==========
basketButton.addEventListener('click', () => {
    events.emit('basket:open');
});

// ========== ИНИЦИАЛИЗАЦИЯ ==========
updateBasketCounter();