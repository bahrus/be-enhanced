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
                        obj[prop] = {};
                    }
                    return obj[prop];
                }
            });
        }
        return this.#proxy;
    }
    async attachProp(enhancement) {
        const { camelToLisp } = await import('trans-render/lib/camelToLisp.js');
        const enh = camelToLisp(enhancement);
        return await this.attach(enhancement, enh);
    }
    async attachAttr(enh) {
        const { lispToCamel } = await import('trans-render/lib/lispToCamel.js');
        const enhancement = lispToCamel(enh);
        return await this.attach(enhancement, enh);
    }
    async attach(enhancement, enh) {
        const { self } = this;
        const def = await customElements.whenDefined(enh);
        const previouslySet = self['beEnhanced'][enhancement];
        if (previouslySet instanceof def)
            return previouslySet;
        const ce = new def();
        self['beEnhanced'][enhancement] = ce;
        await ce.attach(self, { enhancement, enh });
        return ce;
    }
    async whenDefined(enh) {
        return await this.attachAttr(enh);
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
customElements.define('be-enhanced', class extends HTMLElement {
});
