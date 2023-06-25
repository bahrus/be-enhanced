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
    async parse(config, attr) {
        const { parse } = await import('./parse.js');
        return await parse(this, config, attr);
    }
    async attach(enhancedElement, enhancementInfo) {
        this.#ee = enhancedElement;
        this.#enhancementInfo = enhancementInfo;
        await this.connectedCallback();
        const config = (this.constructor.beConfig || {});
        const { primaryProp, primaryPropReq, parse } = config;
        const { previouslySet } = enhancementInfo;
        let gatewayVal = previouslySet;
        if (gatewayVal === undefined) {
            const t = enhancedElement.beEnhanced[enhancementInfo.enhancement];
            if (!(t instanceof Element)) {
                gatewayVal = t;
            }
        }
        const attr = (gatewayVal && typeof gatewayVal === 'string') ? gatewayVal : null;
        const objToAssign = parse ? await this.parse(config, attr) : {};
        if (primaryPropReq && gatewayVal) {
            if (!gatewayVal[primaryProp]) {
                gatewayVal = {
                    [primaryProp]: gatewayVal
                };
            }
        }
        if (gatewayVal instanceof Object) {
            Object.assign(objToAssign, gatewayVal);
        }
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
