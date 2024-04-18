import {RoundaboutReady} from 'trans-render/froop/types';
import {assignGingerly} from 'trans-render/lib/assignGingerly.js';
import { RoundAbout } from 'trans-render/froop/roundabout.js';
import { EnhancementInfo, IEnhancement, BEConfig, PropInfo, PropLookup, AllProps } from './types';
import {dispatchEvent} from 'trans-render/positractions/dispatchEvent.js';
export {BEConfig} from './types';
const publicPrivateStore = Symbol();

export class BE<TProps = any, TActions=TProps, TElement extends Element = Element> 
    extends HTMLElement implements RoundaboutReady, IEnhancement<TElement>{
    propagator = new EventTarget();
    [publicPrivateStore]: Partial<TProps> = {};

    covertAssignment(obj: TProps): void {
        assignGingerly(this[publicPrivateStore], obj, (<any>this.constructor).props);
    }

    get #config(){
        return (<any>this.constructor).config as BEConfig;
    }

    de = dispatchEvent;

    #ee: TElement | undefined;
    #ei: EnhancementInfo | undefined;
    async attach(el: TElement, enhancementInfo: EnhancementInfo){
        this.#ee = el;
        this.#ei = enhancementInfo;
        await this.#instantiateRoundaboutIfApplicable();
    }

    async detach(el: TElement){
        this.propagator.dispatchEvent(new Event('disconnectedCallback'));
    }

    #roundabout: RoundAbout | undefined;

    async #instantiateRoundaboutIfApplicable(){
        
        const config = this.#config;
        const {actions, compacts, onsets, infractions, handlers, positractions} = config;
        if((actions || compacts || onsets || infractions || handlers || positractions) !== undefined){
            const {roundabout} = await import('trans-render/froop/roundabout.js');
            const [vm, ra] = await roundabout({
                vm: this,
                actions,
                compacts,
                onsets,
                handlers,
                positractions
            }, infractions);
            this.#roundabout = ra;
        }
        
    }

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

            this.addEventListener('resolved', e => {
                if(this.resolved){
                    resolve(true);
                }
            });
        })
    }

    dispatchEventFromEnhancedElement(type: string, init?: CustomEventInit){
        const prefixedType = 'enh-' + this.#ei!.enh + '.' + type;
        const evt = init ? new CustomEvent(prefixedType, init) : new Event(prefixedType);
        this.#ee!.dispatchEvent(evt);
    }

    static config: BEConfig | undefined;

    static async bootUp(){
        const config = this.config!;
        const {propDefaults, propInfo} = config;
        const props = {...this.props as PropLookup};
        Object.assign(props, propInfo);
        if(propDefaults !== undefined){
            for(const key in propDefaults){
                const def = propDefaults[key];
                const propInfo = {
                    ...defaultProp,
                    def,
                    propName: key
                } as PropInfo;
                props[key] = propInfo;

            }
            
        }
        if(propInfo !== undefined){
            for(const key in propInfo){
                const prop = propInfo[key]!;
                const mergedPropInfo = {
                    ...defaultProp,
                    prop,
                    propName: key
                } as PropInfo
                props[key] = mergedPropInfo;
            }
        }
        this.props = props;
        this.addProps(this, props);
        
    }

    static addProps(newClass: {new(): BE}, props: PropLookup){
        const proto = newClass.prototype;
        for(const key in props){
            if(key in proto) continue;
            const prop = props[key];
            const {ro} = prop;
            if(ro){
                Object.defineProperty(proto, key, {
                    get(){
                        return this[publicPrivateStore][key];
                    },
                    enumerable: true,
                    configurable: true,
                });
            }else{
                Object.defineProperty(proto, key, {
                    get(){
                        return this[publicPrivateStore][key];
                    },
                    set(nv: any){
                        const ov = this[publicPrivateStore][key];
                        if(prop.dry && ov === nv) return;
                        this[publicPrivateStore][key] = nv;
                        (this as BE).propagator.dispatchEvent(new Event(key));
                    },
                    enumerable: true,
                    configurable: true,
                });
            }

        }
    }

    static props: PropLookup = {};
}

export interface BE extends AllProps{}

const defaultProp: PropInfo = {
    dry: true,
};

export const propDefaults: Partial<{[key in keyof AllProps]: IEnhancement[key]}> = {
    resolved: false,
    rejected: false,
}