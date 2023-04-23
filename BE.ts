import {IEnhancement, IBE} from './types';
import {XEArgs, PropInfoExt} from 'xtal-element/types';

export class BE<TProps = any, TActions = TProps> extends HTMLElement implements IEnhancement{
    _ee: Element | undefined;
    async attach(enhancedElement: Element, enhancement: string){
        this._ee = enhancedElement;
        this.connectedCallback();
        Object.assign(this, (<any>enhancedElement)[enhancement]);
    }
}

export interface BE extends IBE{}

export const defaultArgs = {
    config: {
        propDefaults: {
            resolved: false,
            rejected: false,
        },
        propInfo: {
            resolved: {
                notify: {
                    dispatch: true
                }
            }
        }
    }
} as XEArgs<IEnhancement>

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







