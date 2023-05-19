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
    async with(enhancement) {
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
        if (previouslySet !== undefined) {
            Object.assign(ce, previouslySet);
        }
        return ce;
    }
    async whenDefined(enh) {
        return await this.attachAttr(enh);
    }
    async whenResolved(enh) {
        const enhancement = await this.whenDefined(enh);
        await enhancement.whenResolved();
        return enhancement;
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
if (customElements.get('be-enhanced') === undefined) {
    customElements.define('be-enhanced', class extends HTMLElement {
    });
}
