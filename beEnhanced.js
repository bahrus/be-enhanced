class InProgressAttachments extends EventTarget {
    inProgress = new WeakMap();
}
// interface AttachedEvent{
//     element: Element,
// }
export class EnhancerRegistry extends EventTarget {
    #enhancers = new Map();
    get enhancers() {
        return this.#enhancers;
    }
    define(emc) {
        const { enhPropKey } = emc;
        if (this.#enhancers.has(enhPropKey))
            throw 'Only One!';
        this.#enhancers.set(enhPropKey, emc);
        this.dispatchEvent(new Event('register'));
    }
    whenDefined(key) {
        return new Promise(resolve => {
            if (this.#enhancers.has(key)) {
                resolve(this.#enhancers.get(key));
                return;
            }
            const ac = new AbortController();
            this.addEventListener('register', e => {
                if (!this.#enhancers.has(key)) {
                    resolve(this.#enhancers.get(key));
                    ac.abort();
                }
            }, { signal: ac.signal });
        });
    }
}
export const Enhancers = new EnhancerRegistry();
const inProgressAttachments = new InProgressAttachments();
export class BeEnhanced extends EventTarget {
    self;
    constructor(self) {
        super();
        this.self = self;
    }
    #proxy;
    get by() {
        if (this.#proxy === undefined) {
            const self = this;
            this.#proxy = new Proxy(self, {
                get(obj, prop) {
                    if (obj[prop] === undefined) {
                        self.with(prop);
                        obj[prop] = {};
                    }
                    return obj[prop];
                }
            });
        }
        return this.#proxy;
    }
    async with(key) {
        const emc = await Enhancers.whenDefined(key);
        return await this.whenResolved(emc, true);
    }
    async whenDetached(localName) {
        let def = customElements.get(localName);
        if (def === undefined)
            def = await customElements.whenDefined(localName);
        const { lispToCamel } = await import('trans-render/lib/lispToCamel.js');
        const enhancement = lispToCamel(localName);
        const { self } = this;
        const previouslySet = self['beEnhanced'][enhancement];
        if (previouslySet instanceof def) {
            await previouslySet.detach(this, { enhancement, enh: localName, localName });
            delete self['beEnhanced'][enhancement];
            self.removeAttribute(localName);
            self.removeAttribute('enh-by-' + localName);
            self.removeAttribute('data-enh-by-' + localName);
        }
        return previouslySet;
    }
    async whenAttached(emc) {
        return await this.whenResolved(emc, true);
    }
    async whenResolved(emc, skipResolvedWait = false) {
        const { importEnh, enhPropKey } = emc;
        if (importEnh === undefined || enhPropKey === undefined)
            throw 'NI';
        const { self } = this;
        const beEnhanced = self.beEnhanced;
        const enhancementConstructor = await importEnh();
        const initialPropValues = beEnhanced[enhPropKey] || {};
        if (initialPropValues instanceof enhancementConstructor)
            return;
        const enhancementInstance = new enhancementConstructor();
        beEnhanced[enhPropKey] = enhancementInstance;
        await enhancementInstance.attach(self, {
            initialPropValues,
            mountCnfg: emc
        });
        if (!skipResolvedWait) {
            await enhancementInstance.whenResolved();
        }
        return enhancementInstance;
    }
}
const wm = new WeakMap();
Object.defineProperty(Element.prototype, 'beEnhanced', {
    get() {
        if (!wm.has(this)) {
            wm.set(this, new BeEnhanced(this));
        }
        return wm.get(this);
    },
    enumerable: true,
    configurable: true,
});
// if(customElements.get('be-enhanced') === undefined){
//     customElements.define('be-enhanced', class extends HTMLElement{});
// }
