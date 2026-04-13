import { IBuyer, TPayment, ErrorsBuyer } from '../../types';
import { IEvents } from '../base/Events';

export class BuyerModel {
    private payment: TPayment | null = null;
    private address: string = '';
    private email: string = '';
    private phone: string = '';
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    setData(data: Partial<IBuyer>): void {
        if (data.payment !== undefined) this.payment = data.payment;
        if (data.address !== undefined) this.address = data.address;
        if (data.email !== undefined) this.email = data.email;
        if (data.phone !== undefined) this.phone = data.phone;
        this.events.emit('buyer:changed', this.getData());
    }

    getData(): IBuyer {
        return {
            payment: this.payment,
            address: this.address,
            email: this.email,
            phone: this.phone,
        };
    }

    clear(): void {
        this.payment = null;
        this.address = '';
        this.email = '';
        this.phone = '';
        this.events.emit('buyer:changed', this.getData());
    }

    validate(): ErrorsBuyer {
        const errors: ErrorsBuyer = {};

        if (!this.payment) {
            errors.payment = 'Не выбран способ оплаты';
        }
        if (!this.address.trim()) {
            errors.address = 'Адрес доставки не может быть пустым';
        }
        if (!this.email.trim()) {
            errors.email = 'Email не может быть пустым';
        }
        if (!this.phone.trim()) {
            errors.phone = 'Телефон не может быть пустым';
        }

        return errors;
    }

    isFirstStepValid(): boolean {
        return !!this.payment && this.address.trim().length > 0;
    }

    isSecondStepValid(): boolean {
        return this.email.trim().length > 0 && this.phone.trim().length > 0;
    }
}