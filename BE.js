export class BE extends HTMLElement {
    #ee;
    get enhancedElement() {
        return this.#ee;
    }
    #enhancementInfo;
    get enhancementInfo() {
        return this.#enhancementInfo;
    }
    static get beConfig() {
        return {};
    }
    async parse() {
        const { parse } = await import('./parse.js');
        return await parse(this);
    }
    async attach(enhancedElement, enhancementInfo) {
        this.#ee = enhancedElement;
        this.#enhancementInfo = enhancementInfo;
        await this.connectedCallback();
        const objToAssign = this.constructor.beConfig.parse ? await this.parse() : {};
        Object.assign(objToAssign, enhancedElement[enhancementInfo.enhancement]);
        Object.assign(this, objToAssign);
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
