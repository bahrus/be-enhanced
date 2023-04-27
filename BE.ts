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
    async parse(config: BEConfig): Promise<JSONValue>{
        const {parse} = await import('./parse.js');
        return await parse(this as BE, config);
    }
    async attach(enhancedElement: TElement, enhancementInfo: EnhancementInfo){
        this.#ee = enhancedElement;
        this.#enhancementInfo = enhancementInfo;
        await this.connectedCallback();
        const config = (this.constructor as any).beConfig as BEConfig;
        const objToAssign = config.parse ? await this.parse(config) : {};
        Object.assign(objToAssign as any, (<any>enhancedElement)[enhancementInfo.enhancement]);
        Object.assign(this, objToAssign);
    }

    async whenResolved(){
        if(this.rejected) return false;
        if(this.resolved) return true;
        this.addEventListener('resolved-changed', e => {
            return this.resolved;
        }, {once: true});
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







