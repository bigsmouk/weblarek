import { Form } from './Form';
import { IEvents } from './base/Events';

export interface IContactsFormData {
    email: string;
    phone: string;
}

export class ContactsForm extends Form<IContactsFormData> {
    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        
        // Переопределяем событие submit для этой формы
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            events.emit('contacts:submit');
        });
    }

    getData(): IContactsFormData {
        const email = (this.form.querySelector('[name="email"]') as HTMLInputElement)?.value || '';
        const phone = (this.form.querySelector('[name="phone"]') as HTMLInputElement)?.value || '';
        return { email, phone };
    }
}