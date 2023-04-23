import {Enhancement, Enh} from './types';

export class BeEnhanced extends EventTarget{
    by(enh: Enhancement){

    }
}

const wm = new WeakMap<Element, BeEnhanced>();

Object.defineProperty(Element.prototype, 'beEnhanced', {
    get() {
        if(!wm.has(this)){
            wm.set(this, new BeEnhanced());
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