import { Form } from './Form';

export interface IContactsFormData {
    email: string;
    phone: string;
}

export class ContactsForm extends Form<IContactsFormData> {
    constructor(container: HTMLElement, onSubmit: () => void, onChange: (field: string, value: string) => void) {
        super(container, onSubmit, onChange);
    }
}