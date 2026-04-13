import { Form } from './Form';

export interface IOrderFormData {
    payment: string;
    address: string;
}

export class OrderForm extends Form<IOrderFormData> {
    protected cardButton: HTMLButtonElement;
    protected cashButton: HTMLButtonElement;

    constructor(container: HTMLElement, onSubmit: () => void, onChange: (field: string, value: string) => void) {
        super(container, onSubmit, onChange);
        
        this.submitButton = container.querySelector('.order__button') as HTMLButtonElement;
        this.cardButton = container.querySelector('[name="card"]') as HTMLButtonElement;
        this.cashButton = container.querySelector('[name="cash"]') as HTMLButtonElement;

        this.cardButton.addEventListener('click', () => {
            onChange('payment', 'card');
        });

        this.cashButton.addEventListener('click', () => {
            onChange('payment', 'cash');
        });
    }

    setPayment(payment: string): void {
        if (payment === 'card') {
            this.cardButton.classList.add('button_alt-active');
            this.cashButton.classList.remove('button_alt-active');
        } else if (payment === 'cash') {
            this.cashButton.classList.add('button_alt-active');
            this.cardButton.classList.remove('button_alt-active');
        }
    }
}