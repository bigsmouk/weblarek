import { IBuyer, TPayment } from '../../types';

export class BuyerModel {
    private _payment: TPayment | null = null;
    private _address: string = '';
    private _email: string = '';
    private _phone: string = '';

    setData(data: Partial<IBuyer>): void {
        if (data.payment !== undefined) this._payment = data.payment;
        if (data.address !== undefined) this._address = data.address;
        if (data.email !== undefined) this._email = data.email;
        if (data.phone !== undefined) this._phone = data.phone;
    }

    getData(): IBuyer {
        return {
            payment: this._payment,
            address: this._address,
            email: this._email,
            phone: this._phone,
        };
    }

    clear(): void {
        this._payment = null;
        this._address = '';
        this._email = '';
        this._phone = '';
    }

    validate(): Partial<Record<keyof IBuyer, string>> {
        const errors: Partial<Record<keyof IBuyer, string>> = {};

        if (!this._payment) {
            errors.payment = 'Не выбран способ оплаты';
        }
        if (!this._address.trim()) {
            errors.address = 'Адрес доставки не может быть пустым';
        }
        if (!this._email.trim()) {
            errors.email = 'Email не может быть пустым';
        }
        if (!this._phone.trim()) {
            errors.phone = 'Телефон не может быть пустым';
        }

        return errors;
    }

    isFirstStepValid(): boolean {
        return !!this._payment && this._address.trim().length > 0;
    }

    isSecondStepValid(): boolean {
        return this._email.trim().length > 0 && this._phone.trim().length > 0;
    }
}