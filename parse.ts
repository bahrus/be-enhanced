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
    //let parsedObj: any;
    try{
        const firstChar = attr[0];
        const {primaryProp} = config;
        const {parseAndCamelize} = config;
        if (firstChar === '{' || firstChar === '[') {
            
            if(parseAndCamelize){
                const {parseAndCamelize} = await import('./parseAndCamelize.js');
                
                const pAndC =  parseAndCamelize(attr);
                if(primaryProp !== undefined) {
                    return {[primaryProp]: pAndC};
                }else{
                    return pAndC;
                }
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
            if(parseAndCamelize){
                const {camelizeOptions} = config;
                const {camelize} = await import('./camelize.js');
                if(camelizeOptions !== undefined){
                    const {camelPlus} = await import('./camelPlus.js');
                    const objToAssign = {
                        [primaryProp]: camelize(attr)
                    };
                    await camelPlus(objToAssign, camelizeOptions, primaryProp, config);
                    return objToAssign;
                }else{
                    //const {camelize} = await import('./camelize.js');
                    return {
                        [primaryProp]: camelize(attr)
                    }
                }

            }else{
                return {
                    [primaryProp]: attr
                }
            }

        }else{
            return {};
        } 

        
    } catch (e) {
        console.error(e);
        return {};
    }
}