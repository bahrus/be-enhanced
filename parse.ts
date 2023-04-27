import {BE} from './BE.js';
import {BEConfig} from './types';
import {JSONValue} from 'trans-render/lib/types';
export async function parse(enhancement: BE, config: BEConfig): Promise<JSONValue>{
    const {enhancementInfo, enhancedElement} = enhancement;
    const {enh} = enhancementInfo;
    const attr = enhancedElement.getAttribute(enh);
    if( attr === null) return {};
    try{
        const obj = JSON.parse(attr);
        const {primaryProp, primaryPropReq} = config;
        if(primaryProp && primaryPropReq && obj[primaryProp] === undefined){
            return {
                [primaryProp]: obj
            };
        }
        return obj;
    } catch (e) {
        console.error(e);
        return {};
    }
}