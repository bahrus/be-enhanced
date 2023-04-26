import {IEnhancement, IBE} from './types';
import {XEArgs, PropInfoExt} from 'xtal-element/types';

export class BE<TProps = any, TActions = TProps, TElement = Element> extends HTMLElement implements IEnhancement<TElement>{
    _ee!: TElement;
    get enhancedElement(){
        return this._ee;
    }
    async attach(enhancedElement: TElement, enhancement: string){
        this._ee = enhancedElement;
        await this.connectedCallback();
        Object.assign(this, (<any>enhancedElement)[enhancement]);
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


export const propDefaults: Partial<{[key in keyof IEnhancement]: IEnhancement[key]}> = {
    resolved: false,
    rejected: false,
}

export const propInfo: Partial<{[key in keyof IEnhancement]: PropInfoExt<IEnhancement>}> = {
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







