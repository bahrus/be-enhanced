import {Enhancement, IEnhancement, Enh, EnhancementInfo, FQN} from './types';
import {lispToCamel} from 'trans-render/lib/lispToCamel.js';

class InProgressAttachments extends EventTarget{
    inProgress = new WeakMap<Element, Set<string>>();
}

interface AttachedEvent{
    element: Element,
    //enhancement: Enhancement,
}

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
        return await this.#attach(enh);
    }

    // async attachAttr(enh: Enh | undefined, localName: string){
    //     const enhancement = lispToCamel(localName);
    //     return await this.attach(enhancement, enh, localName);
    // }

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
    }

    async #attach2(enhancementInfo: EnhancementInfo){
        const {self} = this;
        const {localName, enhancement} = enhancementInfo;
        let def = customElements.get(localName);
        if(def === undefined) def = await customElements.whenDefined(localName);
        const previouslySet = (<any>self)['beEnhanced'][enhancement];
        if(previouslySet instanceof def ) return previouslySet;
        enhancementInfo.initialPropValues = previouslySet;
        
        const ce = new def() as IEnhancement<Element>;
        (<any>self)['beEnhanced'][enhancement] = ce;
        await ce.attach(self, enhancementInfo);
        //TODO:  leave this up to the individual enhancement
        if(previouslySet !== undefined){
            Object.assign(ce, previouslySet);
        }
        const {inProgress} = inProgressAttachments;
        const inProgressForElement = inProgress.get(self);
        if(inProgressForElement !== undefined){
            inProgressForElement.delete(enhancement);
            if(inProgressForElement.size === 0){
                inProgress.delete(self);
            }
        }
        return ce;
    }

    #attach(fqn: FQN): Promise<IEnhancement<Element>>{
        return new Promise(async (resolve, rejected) => {
            const enhancementInfo = this.#getEnhanceInfo(fqn);
            const {enhancement, enh} = enhancementInfo;
            const {self} = this;
            const inProgressForElement = inProgressAttachments.inProgress.get(self);
            if(inProgressForElement !== undefined){
                if(inProgressForElement.has(enhancement)){
                    const controller = new AbortController();
                    inProgressAttachments.addEventListener(enhancement, async e => {
                        const attachmentEvent = (<CustomEvent>e).detail as AttachedEvent;
                        const {element} = attachmentEvent;
                        if(element === self){
                            resolve(await this.#attach2(enhancementInfo));
                            controller.abort();
                        }
                    }, {signal: controller.signal});
                    return;
                }else{
                    inProgressForElement.add(enhancement);
                }
            }else{
                const enhancements = new Set<string>();
                enhancements.add(enhancement);
                inProgressAttachments.inProgress.set(self, enhancements);
            }
            resolve(await this.#attach2(enhancementInfo));
            
        });

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

    #getEnhanceInfo(fqn: string){
        const enh = fqn.replace('data-enh-by-', '').replace('enh-by-', '')
        const enhancement = lispToCamel(enh);
        //const enh = fqn;// this.getFQName(localName);
        const enhancementInfo: EnhancementInfo = {
            enhancement,
            localName: enh,
            enh,
            fqn
        };
        return enhancementInfo;
    }

    async whenAttached(fqn: Enh){
        return await this.#attach(fqn);
    }

    async whenResolved(localName: Enh){
        //const test = (<any>enh.beEnhanced
        //console.log(enh);
        // const enhancementS = lispToCamel(enh);
        // const test = ((<any>this.self)?.enhancements || {}) [enhancementS];
        // if(test !== undefined){
        //     if(test.resolved) return test;
        //     await test.whenResolved();
        // }else{
        //     const enhancement = await this.whenAttached(enh) as IEnhancement;
        //     await enhancement.whenResolved();
        //     return enhancement;
        // }
        const enhancementInfo = this.#getEnhanceInfo(localName);
        const test = (<any>this.self)?.beEnhanced[enhancementInfo.enhancement];
        if(typeof test?.constructor === 'function' && test.resolved) return test;
        const enhancement = await this.whenAttached(localName) as IEnhancement;
        if(enhancement.resolved) return enhancement;
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

