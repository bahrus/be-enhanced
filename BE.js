export class BE extends HTMLElement {
    #ee;
    get enhancedElement() {
        return this.#ee;
    }
    #enhancement;
    get enhancement() {
        return this.#enhancement;
    }
    async attach(enhancedElement, enhancement) {
        this.#ee = enhancedElement;
        this.#enhancement = enhancement;
        await this.connectedCallback();
        Object.assign(this, enhancedElement[enhancement]);
    }
    async whenResolved() {
        if (this.rejected)
            return false;
        if (this.resolved)
            return true;
        this.addEventListener('resolved-changed', e => {
            return this.resolved;
        }, { once: true });
    }
}
export const propDefaults = {
    resolved: false,
    rejected: false,
};
export const propInfo = {
    resolved: {
        notify: {
            dispatch: true
        }
    },
    rejected: {
        notify: {
            dispatch: true
        }
    }
};
