import {Enhancement, IEnhancement, Enh} from './types';

export class BeEnhanced extends EventTarget{
    constructor(public self: Element){
        super();
    }
    #proxy: any
    get by(){
        if(this.#proxy === undefined){
            const self = this;
            this.#proxy = new Proxy(self, {
                get(obj: any, prop: string){
                    if(obj[prop] === undefined){
                        self.with(prop);
                        obj[prop] = {};
                    }
                    return obj[prop];
                }
            });
        }
        return this.#proxy;
    }

    async with(enhancement: Enhancement){
        const {camelToLisp} = await import('trans-render/lib/camelToLisp.js');
        const enh = camelToLisp(enhancement);
        return await this.attach(enhancement, enh, enh);
    }

    async attachAttr(enh: Enh | undefined, localName: string){
        const {lispToCamel} = await import('trans-render/lib/lispToCamel.js');
        const enhancement = lispToCamel(localName);
        return await this.attach(enhancement, enh, localName);
    }

    getFQName(localName: string){
        const {self} = this;
        const allowNonNamespaced = !self.localName.includes('-');
        if(allowNonNamespaced && self.matches(`[${localName}]`)) return localName;
        let testKey = `enh-by-${localName}`;
        let test = `[${testKey}]`;
        if(self.matches(test)) return testKey;
        testKey = `data-enh-by-${localName}`;
        test = `[${testKey}]`;
        if(self.matches(test)) return testKey;
        //return localName;
    }

    async attach(enhancement: Enhancement, enh: Enh | undefined, localName: string){
        const {self} = this;
        const def = await customElements.whenDefined(localName);
        const previouslySet = (<any>self)['beEnhanced'][enhancement]
        if(previouslySet instanceof def ) return previouslySet;
        const ce = new def() as IEnhancement;
        (<any>self)['beEnhanced'][enhancement] = ce;
        await ce.attach(self, {enhancement, enh, localName, previouslySet});
        if(previouslySet !== undefined){
            Object.assign(ce, previouslySet);
        }
        return ce;
    }

    async whenDefined(localName: string){
        const enh = this.getFQName(localName); 
        return await this.attachAttr(enh || localName, localName);
    }

    async whenResolved(enh: Enh){
        const enhancement = await this.whenDefined(enh) as IEnhancement;
        await enhancement.whenResolved();
        return enhancement;
    }
}

const wm = new WeakMap<Element, BeEnhanced>();

Object.defineProperty(Element.prototype, 'beEnhanced', {
    get() {
        if(!wm.has(this)){
            wm.set(this, new BeEnhanced(this));
        }
        return wm.get(this);
    },
    enumerable: true,
    configurable: true,
});

if(customElements.get('be-enhanced') === undefined){
    customElements.define('be-enhanced', class extends HTMLElement{});
}

