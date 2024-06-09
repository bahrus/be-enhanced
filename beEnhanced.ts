import {Enhancement, EnhKey, FQN} from './types';
import {EnhancementInfo, EMC, IEnhancement} from  'trans-render/be/types';
import {lispToCamel} from 'trans-render/lib/lispToCamel.js';

class InProgressAttachments extends EventTarget{
    inProgress = new WeakMap<Element, Set<string>>();
}

// interface AttachedEvent{
//     element: Element,
// }


export class EnhancerRegistry extends EventTarget{
    #enhancers: Map<EnhKey, EMC> = new Map();
    get enhancers(){
        return this.#enhancers;
    }
    define(emc: EMC){
        const {enhPropKey} = emc;
        if(this.#enhancers.has(enhPropKey)) throw 'Only One!';
        this.#enhancers.set(enhPropKey, emc);
        this.dispatchEvent(new Event('register'));
    }
    whenDefined(key: EnhKey): Promise<EMC>{
        return new Promise<EMC>(resolve => {
            if(this.#enhancers.has(key)) {
                resolve(this.#enhancers.get(key)!);
                return;
            }
            const ac = new AbortController();
            this.addEventListener('register', e => {
                if(!this.#enhancers.has(key)){
                    resolve(this.#enhancers.get(key)!);
                    ac.abort();
                }
            }, {signal: ac.signal})
        })
    }
}

export const Enhancers = new EnhancerRegistry();

const inProgressAttachments = new InProgressAttachments();
export class BeEnhanced extends EventTarget{
    constructor(public self: Element){
        super();
    }
    #proxy: any
    get by(){
        if(this.#proxy === undefined){
            const self = this;
            this.#proxy = new Proxy(self, {
                get(obj: any, prop: EnhKey){
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

    async with(key: EnhKey){
        const emc = await Enhancers.whenDefined(key);
        return await this.whenResolved(emc, true);
    }

    async whenDetached(localName: string){
        let def = customElements.get(localName);
        if(def === undefined) def = await customElements.whenDefined(localName);
        const {lispToCamel} = await import('trans-render/lib/lispToCamel.js');
        const enhancement = lispToCamel(localName);
        const {self} = this;
        const previouslySet = (<any>self)['beEnhanced'][enhancement];
        if(previouslySet instanceof def ){
            await (<any>previouslySet).detach(this, {enhancement, enh: localName, localName});
            delete (<any>self)['beEnhanced'][enhancement];
            self.removeAttribute(localName);
            self.removeAttribute('enh-by-' + localName);
            self.removeAttribute('data-enh-by-' + localName);
        }
        return previouslySet;
    }

    async whenAttached(emc: EMC){
        return await this.whenResolved(emc, true);
    }

    async whenResolved(emc: EMC, skipResolvedWait = false){
        const {importEnh, enhPropKey} = emc;
        if(importEnh === undefined || enhPropKey === undefined) throw 'NI';
        const {self} = this;
        const beEnhanced = (<any>self).beEnhanced;
        const enhancementConstructor = await importEnh();
        const initialPropValues = beEnhanced[enhPropKey!] || {};
        if(initialPropValues instanceof enhancementConstructor) return;
        const enhancementInstance =  new enhancementConstructor();
        (<any>beEnhanced)[enhPropKey!] = enhancementInstance;
        await enhancementInstance.attach(self, {
            initialPropValues,
            mountCnfg: emc
        });
        if(!skipResolvedWait){
            await enhancementInstance.whenResolved();
        }
        
        return enhancementInstance;
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

// if(customElements.get('be-enhanced') === undefined){
//     customElements.define('be-enhanced', class extends HTMLElement{});
// }

