export class BE extends HTMLElement {
    _ee;
    get enhancedElement() {
        return this._ee;
    }
    async attach(enhancedElement, enhancement) {
        this._ee = enhancedElement;
        await this.connectedCallback();
        Object.assign(this, enhancedElement[enhancement]);
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
