class InProgressAttachments extends EventTarget {
    inProgress = new WeakMap();
}
const inProgressAttachments = new InProgressAttachments();
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
        const def = customElements.get(enh) || await customElements.whenDefined(enh);
        const { self } = this;
        const beEnhanced = self['beEnhanced'];
        const previouslySet = beEnhanced[enhancement];
        if (previouslySet instanceof def)
            return previouslySet;
        const enhanceInfo = {
            initialPropValues: previouslySet
        };
        const ce = new def();
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
    getFQName(localName, ifWantsToBe) {
        const { self } = this;
        const allowNonNamespaced = !self.localName.includes('-');
        const nonPrefixedName = `be-${ifWantsToBe}`;
        if (allowNonNamespaced && self.matches(`[${nonPrefixedName}]`))
            return nonPrefixedName;
        let testKey = `enh-${nonPrefixedName}`;
        let test = `[${testKey}]`;
        if (self.matches(test))
            return testKey;
        testKey = `data-enh-${nonPrefixedName}`;
        test = `[${testKey}]`;
        if (self.matches(test))
            return testKey;
    }
    async #attach2(enhancementInfo) {
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
    #attach(enhancementInfo) {
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
    async whenDetached(localName) {
        let def = customElements.get(localName);
        if (def === undefined)
            def = await customElements.whenDefined(localName);
        const { lispToCamel } = await import('trans-render/lib/lispToCamel.js');
        const enhancement = lispToCamel(localName);
        const { self } = this;
        const previouslySet = self['beEnhanced'][enhancement];
        if (previouslySet instanceof def) {
            await previouslySet.detach(this, { enhancement, enh: localName, localName });
            delete self['beEnhanced'][enhancement];
            self.removeAttribute(localName);
            self.removeAttribute('enh-by-' + localName);
            self.removeAttribute('data-enh-by-' + localName);
        }
        return previouslySet;
    }
    #getEnhanceInfo(fqn, ifWantsToBe, localName) {
        throw 'NI';
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
    async whenAttached(localName, ifWantsToBe, fqn) {
        throw 'NI';
        // if(ifWantsToBe === undefined) ifWantsToBe = localName.replace('be-', '');
        // if(fqn === undefined) fqn = localName;
        // const enhancementInfo = this.#getEnhanceInfo(fqn, ifWantsToBe, localName);
        // const test = (<any>this.self)?.beEnhanced[enhancementInfo.enhancement];
        // if(test instanceof Element) return test;
        // return await this.#attach(enhancementInfo);
    }
    async whenResolved(emc) {
        const { importEnh, enhPropKey } = emc;
        if (importEnh === undefined || enhPropKey === undefined)
            throw 'NI';
        const { self } = this;
        const enhancementConstructor = await importEnh();
        const initialPropValues = self[enhPropKey] || {};
        if (initialPropValues instanceof enhancementConstructor)
            return;
        const enhancementInstance = new enhancementConstructor();
        self[enhPropKey] = enhancementInstance;
        await enhancementInstance.attach(self, {
            initialPropValues,
            mountCnfg: emc
        });
        await enhancementInstance.whenResolved();
        return enhancementInstance;
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
