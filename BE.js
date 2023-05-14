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
    async parse(config) {
        const { parse } = await import('./parse.js');
        return await parse(this, config);
    }
    async attach(enhancedElement, enhancementInfo) {
        this.#ee = enhancedElement;
        this.#enhancementInfo = enhancementInfo;
        await this.connectedCallback();
        const config = this.constructor.beConfig;
        const objToAssign = config.parse ? await this.parse(config) : {};
        Object.assign(objToAssign, enhancedElement[enhancementInfo.enhancement]);
        Object.assign(this, objToAssign);
    }
    detach(detachedElement) { }
    whenResolved() {
        return new Promise((resolve, reject) => {
            if (this.rejected) {
                resolve(false);
                return;
                //reject(false);
            }
            if (this.resolved) {
                resolve(true);
                return;
            }
            this.addEventListener('resolved-changed', e => {
                if (this.resolved) {
                    resolve(true);
                }
            });
        });
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
