import { Component } from './base/Component';

export class Gallery extends Component<{ items: HTMLElement[] }> {
    protected container: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this.container = container;
    }

    setItems(items: HTMLElement[]): void {
        this.container.replaceChildren(...items);
    }
}