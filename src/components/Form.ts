import { Component } from './base/Component';
import { IEvents } from './base/Events';

export class Form<T> extends Component<T> {
    protected form: HTMLFormElement;
    protected submitButton: HTMLButtonElement;
    protected errors: HTMLElement;
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;
        this.form = container as HTMLFormElement;
        this.submitButton = container.querySelector('.button') as HTMLButtonElement;
        this.errors = container.querySelector('.form__errors') as HTMLElement;

        this.form.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            const field = target.name;
            const value = target.value;
            this.events.emit('form:change', { field, value });
        });

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.events.emit('form:submit');
        });
    }

    setData(data: Partial<T>): void {
        Object.entries(data).forEach(([key, value]) => {
            const input = this.form.querySelector(`[name="${key}"]`) as HTMLInputElement;
            if (input) input.value = String(value);
        });
    }

    getData(): T {
        const formData = new FormData(this.form);
        const data = {} as T;
        formData.forEach((value, key) => {
            (data as any)[key] = value;
        });
        return data;
    }

    setErrors(errors: Partial<Record<keyof T, string>>): void {
        const errorMessages = Object.values(errors).filter(Boolean).join(', ');
        if (this.errors) {
            this.errors.textContent = errorMessages;
        }
        this.setValid(Object.keys(errors).length === 0);
    }

    setValid(valid: boolean): void {
        if (this.submitButton) {
            if (valid) {
                this.submitButton.removeAttribute('disabled');
            } else {
                this.submitButton.setAttribute('disabled', 'disabled');
            }
        }
    }
}