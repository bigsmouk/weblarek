import { Component } from './base/Component';

export class Form<T> extends Component<T> {
    protected form: HTMLFormElement;
    protected submitButton: HTMLButtonElement;
    protected errors: HTMLElement;

    constructor(container: HTMLElement, onSubmit: () => void, onChange: (field: string, value: string) => void) {
        super(container);
        this.form = container as HTMLFormElement;
        this.submitButton = container.querySelector('.button') as HTMLButtonElement;
        this.errors = container.querySelector('.form__errors') as HTMLElement;

        this.form.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            onChange(target.name, target.value);
        });

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            onSubmit();
        });
    }

    setData(data: Partial<T>): void {
        Object.entries(data).forEach(([key, value]) => {
            const input = this.form.querySelector(`[name="${key}"]`) as HTMLInputElement;
            if (input) input.value = String(value);
        });
    }

    setErrors(errors: string): void {
        if (this.errors) {
            this.errors.textContent = errors;
        }
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