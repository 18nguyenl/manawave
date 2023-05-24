import { TickerItem } from ".";
import { Template } from "../clones";
import Component from "../web/Component";
import styles from "src/web/ticker.module.css";

// Represents front-facing Ticker that is rendered
// Logic for placing clones in front-facing ticker should go here
// Logic representing the system should not go here
export default class Ticker {
    private _wrapperElement: HTMLElement;
    private _element: HTMLElement;
    private _height: number; // needed to make the absolute positioning work
    private _width: number;

    private _initialTemplate: Template | undefined | null; // needed to restore the state of the ticker before start

    private _wrapperComputedStyles: CSSStyleDeclaration;

    constructor(element: HTMLElement) {
        // The main element that contains anything relating to Billboard
        this._wrapperElement = element;
        this._wrapperComputedStyles = window.getComputedStyle(
            this._wrapperElement
        );

        this._width = 0;
        this._height = 0;

        // Billboard-ticker refers to what represents the entire Billboard-ticker itself
        this._element = document.createElement("div");
        this._element.classList.add(styles.tickerContainer);

        if (!(this._wrapperElement instanceof Component)) {
            this._wrapperElement.classList.add(styles.ticker);
        }

        this.measure();
    }

    get isRendered(): boolean {
        return this._wrapperElement.contains(this._element);
    }

    get initialTemplate() {
        return this._initialTemplate;
    }

    get dimensions(): Dimensions {
        return {
            width: this._width,
            height: this._height,
        };
    }

    get height() {
        return this._height;
    }

    set height(height: number) {
        this._height = height;

        // Override any height if there's one already defined in the parent
        if (
            this._wrapperElement.style.height ||
            this._wrapperElement.style.maxHeight ||
            this._wrapperElement.style.minHeight
        ) {
            this._height = parseFloat(this._wrapperComputedStyles.height);
        }

        this._element.style.height = `${this._height}px`;
    }

    set width(width: number) {
        this._width = width;

        // Override any width if there's one already defined in the parent
        if (
            this._wrapperElement.style.width ||
            this._wrapperElement.style.maxWidth ||
            this._wrapperElement.style.minWidth
        ) {
            this._width = parseFloat(this._wrapperComputedStyles.width);
        }

        this._element.style.width = `${this._width}px`;
    }

    measure() {
        this.width = parseFloat(this._wrapperComputedStyles.width);
        this.height = parseFloat(this._wrapperComputedStyles.height);
    }

    reloadInitialTemplate() {
        if (!this._initialTemplate) {
            this._initialTemplate = new Template(this._wrapperElement.children);
        }
    }

    load() {
        if (!(this._wrapperElement instanceof Component)) {
            this._wrapperElement.classList.add(styles.ticker);
        }

        this.reloadInitialTemplate();

        this._wrapperElement.append(this._element);
    }

    unload() {
        if (this._initialTemplate) {
            this._initialTemplate.restore();
            this._initialTemplate = null;
        }
        if (this._element) {
            this._element.remove();
        }
        if (this._wrapperElement) {
            this._wrapperElement.classList.remove(styles.ticker);
        }
        this._height = -1;
    }

    // Add in a lil element but if it's a lil too big, then the ticker needs to resize
    // [TODO] figure out responsiveness part
    // might need to remove this part if someone already gave it a height that's less
    // than any other height :/
    append(item: TickerItem) {
        item.appendTo(this._element);
    }
}
