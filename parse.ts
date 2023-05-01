import {BE} from './BE.js';
import {BEConfig} from './types';
import {JSONValue} from 'trans-render/lib/types';
declare const Sanitizer: any;

export async function parse(enhancement: BE, config: BEConfig): Promise<JSONValue>{
    const {enhancementInfo, enhancedElement} = enhancement;
    const {enh} = enhancementInfo;
    let attr = enhancedElement.getAttribute(enh);
    if( attr === null) return {};
    attr = attr.trim();
    if(typeof Sanitizer !== 'undefined'){
        const sanitizer = new Sanitizer();
        if(sanitizer.sanitizeFor !== undefined){
            attr = sanitizer.sanitizeFor('template', attr).innerHTML as string;
        }
        
    }
    try{
        const firstChar = attr[0];
        const {primaryProp} = config;
        if (firstChar === '{' || firstChar === '[') {
            const {parseAndCamelize} = config;
            if(parseAndCamelize){
                const {parseAndCamelize} = await import('./parseAndCamelize.js');
                return parseAndCamelize(attr)
            }else{
                const obj = JSON.parse(attr);
                const {primaryPropReq} = config;
                if(primaryProp && primaryPropReq && obj[primaryProp] === undefined){
                    return {
                        [primaryProp]: obj
                    };
                }
                return obj;
            }

        }else if(primaryProp !== undefined){
            return {
                [primaryProp]: attr
            }
        }else{
            throw 400;
        } 
        
    } catch (e) {
        console.error(e);
        return {};
    }
}