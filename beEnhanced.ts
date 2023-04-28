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
                        obj[prop] = {};
                    }
                    return obj[prop];
                }
            });
        }
        return this.#proxy;
    }

    async attachProp(enhancement: Enhancement){
        const {camelToLisp} = await import('trans-render/lib/camelToLisp.js');
        const enh = camelToLisp(enhancement);
        return await this.attach(enhancement, enh);
    }

    async attachAttr(enh: Enh){
        const {lispToCamel} = await import('trans-render/lib/lispToCamel.js');
        const enhancement = lispToCamel(enh);
        return await this.attach(enhancement, enh);
    }

    async attach(enhancement: Enhancement, enh: Enh){
        const {self} = this;
        const def = await customElements.whenDefined(enh);
        const previouslySet = (<any>self)['beEnhanced'][enhancement]
        if(previouslySet instanceof def ) return previouslySet;
        const ce = new def() as IEnhancement;
        (<any>self)['beEnhanced'][enhancement] = ce;
        await ce.attach(self, {enhancement, enh});
        return ce;
    }

    async whenDefined(enh: Enh){
        return await this.attachAttr(enh);
    }

    async whenResolved(enh: Enh){
        const enhancement = await this.whenDefined(enh) as IEnhancement;
        await enhancement.whenResolved();
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

customElements.define('be-enhanced', class extends HTMLElement{});
