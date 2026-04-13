import { Form } from './Form';
import { IEvents } from './base/Events';

export interface IOrderFormData {
    payment: string;
    address: string;
}

export class OrderForm extends Form<IOrderFormData> {
    protected cardButton: HTMLButtonElement;
    protected cashButton: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        
        this.submitButton = container.querySelector('.order__button') as HTMLButtonElement;
        
        this.cardButton = container.querySelector('[name="card"]') as HTMLButtonElement;
        this.cashButton = container.querySelector('[name="cash"]') as HTMLButtonElement;

        this.cardButton.addEventListener('click', () => {
            this.setPayment('card');
        });

        this.cashButton.addEventListener('click', () => {
            this.setPayment('cash');
        });

        const addressInput = container.querySelector('[name="address"]') as HTMLInputElement;
        addressInput.addEventListener('input', () => {
            this.events.emit('form:change', { field: 'address', value: addressInput.value });
        });
    }

    setPayment(type: string): void {
        if (type === 'card') {
            this.cardButton.classList.add('button_alt-active');
            this.cashButton.classList.remove('button_alt-active');
        } else {
            this.cashButton.classList.add('button_alt-active');
            this.cardButton.classList.remove('button_alt-active');
        }
        
        this.events.emit('form:change', { field: 'payment', value: type });
    }

    getData(): IOrderFormData {
        const address = (this.form.querySelector('[name="address"]') as HTMLInputElement)?.value || '';
        let payment = '';
        if (this.cardButton.classList.contains('button_alt-active')) payment = 'card';
        if (this.cashButton.classList.contains('button_alt-active')) payment = 'cash';
        return { payment, address };
    }
}