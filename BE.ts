import {IEnhancement, IBE, AllProps, EnhancementInfo, BEConfig} from './types';
import {XEArgs, PropInfoExt} from 'xtal-element/types';
import {JSONValue} from 'trans-render/lib/types';


export class BE<TProps = any, TActions = TProps, TElement extends Element = Element> extends HTMLElement implements IEnhancement<TElement>{
    #ee!: TElement;
    get enhancedElement(){
        return this.#ee;
    }
    #enhancementInfo!: EnhancementInfo;
    get enhancementInfo(){
        return this.#enhancementInfo;
    }
    static get beConfig(): BEConfig{
        return {};
    }
    async parse(config: BEConfig, attr: string | null): Promise<JSONValue>{
        const {parse} = await import('./parse.js');
        return await parse(this as BE, config, attr);
    }
    async attach(enhancedElement: TElement, enhancementInfo: EnhancementInfo){
        this.#ee = enhancedElement;
        this.#enhancementInfo = enhancementInfo;
        await this.connectedCallback();
        const config = ((this.constructor as any).beConfig || {}) as BEConfig;
        const {primaryProp, primaryPropReq, parse, isParsedProp} = config;
        const {previouslySet} = enhancementInfo;
        let gatewayVal = previouslySet;
        if(gatewayVal === undefined){
            const t = (<any>enhancedElement).beEnhanced[enhancementInfo.enhancement];
            if(!(t instanceof Element)){
                gatewayVal = t;
            }
        }
        const attr = (gatewayVal && typeof gatewayVal === 'string') ? gatewayVal : null;
        const objToAssign = parse ? await this.parse(config, attr) : {};
        if(primaryPropReq && gatewayVal){
            if(!gatewayVal[primaryProp!]){
                gatewayVal = {
                    [primaryProp!]: gatewayVal
                };
            }
        }
        if(gatewayVal instanceof Object){
            Object.assign(objToAssign as any, gatewayVal);
        }
        Object.assign(this, objToAssign);
        if(isParsedProp !== undefined){
            Object.assign(this, {[isParsedProp]: true});
        }
    }

    detach(detachedElement: TElement){}

    whenResolved(): Promise<boolean>{
        return new Promise((resolve, reject) => {
            if(this.rejected) {
                resolve(false);
                return;
                //reject(false);
            }
            if(this.resolved){
                resolve(true);
                return;
            }
            //TODO deprecate
            this.addEventListener('resolved-changed', e => {
                console.warn({msg: 'Need to configure isEnh: true', enhancementInfo: this.enhancementInfo});
                if(this.resolved){
                    resolve(true);
                }
            });
            this.addEventListener('resolved', e => {
                if(this.resolved){
                    resolve(true);
                }
            });
        })
    }

    dispatchEventFromEnhancedElement(type: string, init?: CustomEventInit){
        const prefixedType = 'enh-' + this.enhancementInfo.enh + '.' + type;
        const evt = init ? new CustomEvent(prefixedType, init) : new Event(prefixedType);
        this.#ee.dispatchEvent(evt);
    }

}

export interface BE<TProps = any, TActions = TProps, TElement = Element> extends IBE<TElement>{}


export const propDefaults: Partial<{[key in keyof AllProps]: IEnhancement[key]}> = {
    resolved: false,
    rejected: false,
}

export const propInfo: Partial<{[key in keyof AllProps]: PropInfoExt<IEnhancement>}> = {
    resolved: {
        notify: {
            dispatch: true
        }
    },
    rejected:  {
        notify: {
            dispatch: true
        }
    }
}







