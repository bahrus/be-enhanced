import {Enhancement, Enh} from './types';

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


export async function toImport(enhancement: Enhancement): Enh{

}

export async function beEnhanced(el: Element, enhancement: Enhancement){
    const aEl = el as any;
    const enh =  aEl[enhancement];
    switch(typeof enh){
        case 'function':
            return enh;
    }
}