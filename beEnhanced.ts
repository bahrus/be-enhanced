import {Enhancement, Enh, FQN} from './types';
import {EnhancementInfo, EnhancementMountCnfg, IEnhancement} from  'trans-render/be/types';
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
        const def = customElements.get(enh) || await customElements.whenDefined(enh);
        const {self} = this;
        const beEnhanced = (<any>self)['beEnhanced'];
        const previouslySet = beEnhanced[enhancement];
        if(previouslySet instanceof def ) return previouslySet;
        
        const enhanceInfo: EnhancementInfo = {
            initialPropValues: previouslySet
        };
        const ce = new def() as any as IEnhancement<Element>;
        beEnhanced[enhancement] = ce;
        await ce.attach(self, enhanceInfo);
        return ce;
        
        // const ce = new def() as IEnhancement<Element>;
        // (<any>self)['beEnhanced'][enhancement] = ce;
        // await ce.attach(self, enhancementInfo);
        // //TODO:  leave this up to the individual enhancement
        // if(previouslySet !== undefined){
        //     Object.assign(ce, previouslySet);
        // }
        // const {inProgress} = inProgressAttachments;
        // //console.log(enhancementInfo);
        // inProgressAttachments.dispatchEvent(new CustomEvent(enhancement,  {
        //     detail:{
        //         element: self
        //     }
        // }));
        // const inProgressForElement = inProgress.get(self);
        // if(inProgressForElement !== undefined){
        //     //console.log('iah');
            
        //     inProgressForElement.delete(enhancement);
        //     if(inProgressForElement.size === 0){
        //         inProgress.delete(self);
        //     }
        // }
        // return ce;

    }

    // async attachAttr(enh: Enh | undefined, localName: string){
    //     const enhancement = lispToCamel(localName);
    //     return await this.attach(enhancement, enh, localName);
    // }

    getFQName(localName: string, ifWantsToBe: string){
        const {self} = this;
        const allowNonNamespaced = !self.localName.includes('-');
        const nonPrefixedName = `be-${ifWantsToBe}`;
        if(allowNonNamespaced && self.matches(`[${nonPrefixedName}]`)) return nonPrefixedName;
        let testKey = `enh-${nonPrefixedName}`;
        let test = `[${testKey}]`;
        if(self.matches(test)) return testKey;
        testKey = `data-enh-${nonPrefixedName}`;
        test = `[${testKey}]`;
        if(self.matches(test)) return testKey;
    }

    async #attach2(enhancementInfo: EnhancementInfo){
        throw 'NI';
        // const {self} = this;
        // const {localName, enhancement} = enhancementInfo;
        // let def = customElements.get(localName);
        // if(def === undefined) def = await customElements.whenDefined(localName);
        // const previouslySet = (<any>self)['beEnhanced'][enhancement];
        // if(previouslySet instanceof def ) return previouslySet;
        // enhancementInfo.initialPropValues = previouslySet;
        
        // const ce = new def() as IEnhancement<Element>;
        // (<any>self)['beEnhanced'][enhancement] = ce;
        // await ce.attach(self, enhancementInfo);
        // //TODO:  leave this up to the individual enhancement
        // if(previouslySet !== undefined){
        //     Object.assign(ce, previouslySet);
        // }
        // const {inProgress} = inProgressAttachments;
        // //console.log(enhancementInfo);
        // inProgressAttachments.dispatchEvent(new CustomEvent(enhancement,  {
        //     detail:{
        //         element: self
        //     }
        // }));
        // const inProgressForElement = inProgress.get(self);
        // if(inProgressForElement !== undefined){
        //     //console.log('iah');
            
        //     inProgressForElement.delete(enhancement);
        //     if(inProgressForElement.size === 0){
        //         inProgress.delete(self);
        //     }
        // }
        // return ce;
    }

    #attach(enhancementInfo: EnhancementInfo): Promise<IEnhancement<Element>>{
        throw 'NI';
        // return new Promise(async (resolve, rejected) => {
        //     const {enhancement, enh} = enhancementInfo;
        //     const {self} = this;
        //     const inProgressForElement = inProgressAttachments.inProgress.get(self);
        //     if(inProgressForElement !== undefined){
        //         if(inProgressForElement.has(enhancement)){
        //             const controller = new AbortController();
        //             //console.log('addEventListener', enhancement);
        //             inProgressAttachments.addEventListener(enhancement, async e => {
        //                 //console.log('iah');
        //                 const attachmentEvent = (<CustomEvent>e).detail as AttachedEvent;
        //                 const {element} = attachmentEvent;
        //                 if(element === self){
        //                     resolve(await this.#attach2(enhancementInfo) as IEnhancement<Element>);
        //                     controller.abort();
        //                 }
        //             }, {signal: controller.signal});
        //             return;
        //         }else{
        //             inProgressForElement.add(enhancement);
        //         }
        //     }else{
        //         const enhancements = new Set<string>();
        //         enhancements.add(enhancement);
        //         inProgressAttachments.inProgress.set(self, enhancements);
        //     }
        //     resolve(await this.#attach2(enhancementInfo) as IEnhancement<Element>);
            
        // });

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

    #getEnhanceInfo(fqn: string, ifWantsToBe: string, localName: string){
        throw 'NI'
        // const enh = fqn.replace('data-enh-', '').replace('enh-', '');
        // if(localName === undefined) localName = enh;
        // if(ifWantsToBe === undefined) ifWantsToBe = enh.replace('be-', '');
        // const enhancement = lispToCamel(localName);
        // //const enh = fqn;// this.getFQName(localName);
        // const enhancementInfo: EnhancementInfo = {
        //     enhancement,
        //     localName,
        //     enh,
        //     fqn,
        //     ifWantsToBe
        // };
        // return enhancementInfo;
    }

    async whenAttached(localName: string, ifWantsToBe?: string, fqn?: string){
        throw 'NI';
        // if(ifWantsToBe === undefined) ifWantsToBe = localName.replace('be-', '');
        // if(fqn === undefined) fqn = localName;
        // const enhancementInfo = this.#getEnhanceInfo(fqn, ifWantsToBe, localName);
        // const test = (<any>this.self)?.beEnhanced[enhancementInfo.enhancement];
        // if(test instanceof Element) return test;
        // return await this.#attach(enhancementInfo);
    }

    async whenResolved(emc: EnhancementMountCnfg){
        const {importEnh, enhPropKey} = emc;
        if(importEnh === undefined || enhPropKey === undefined) throw 'NI';
        const {self} = this;
        const enhancementConstructor = await importEnh();
        const initialPropValues = (<any>self)[enhPropKey!] || {};
        if(initialPropValues instanceof enhancementConstructor) return;
        const enhancementInstance =  new enhancementConstructor();
        (<any>self)[enhPropKey!] = enhancementInstance;
        await enhancementInstance.attach(self, {
            initialPropValues,
            mountCnfg: emc
        });
        await enhancementInstance.whenResolved();
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

if(customElements.get('be-enhanced') === undefined){
    customElements.define('be-enhanced', class extends HTMLElement{});
}

