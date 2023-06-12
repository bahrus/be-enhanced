import {IEnhancement, IBE, AllProps, EnhancementInfo, BEConfig} from './types';
import {XEArgs, PropInfoExt} from 'xtal-element/types';
import {JSONValue} from 'trans-render/lib/types';


export class BE<TProps = any, TActions = TProps, TElement = Element> extends HTMLElement implements IEnhancement<TElement>{
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
        const config = (this.constructor as any).beConfig as BEConfig;
        const gatewayVal = (<any>enhancedElement)[enhancementInfo.enhancement];
        const attr = typeof gatewayVal === 'string' ? gatewayVal : null;
        const objToAssign = config.parse ? await this.parse(config, attr) : {};
        if(gatewayVal instanceof Object){
            Object.assign(objToAssign as any, gatewayVal);
        }
        Object.assign(this, objToAssign);
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
            this.addEventListener('resolved-changed', e => {
                if(this.resolved){
                    resolve(true);
                }
            });
        })
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







