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
        const def = await customElements.whenDefined(enh);
        const ce = new def() as IEnhancement;
        const {self} = this;
        await ce.attach(self, enhancement);
        (<any>self)[enhancement] = ce;
        return ce;
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
