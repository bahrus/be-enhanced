import {BE} from './BE.js';
import {BEConfig} from './types';
import {JSONValue} from 'trans-render/lib/types';
declare const Sanitizer: any;

export async function parse(enhancement: BE, config: BEConfig, gatewayVal: string | null): Promise<JSONValue>{
    const {enhancementInfo, enhancedElement} = enhancement;
    const {fqn} = enhancementInfo;
    if(fqn === undefined) return {};
    let attr = enhancedElement.getAttribute(fqn) || gatewayVal;

    if( attr === null) {
        return {};
    }
    
    attr = attr.trim();
    enhancement.parsedFrom = attr;
    const {cache} = config;
    if(cache?.has(attr)){
        return cache!.get(attr)!;
    } 
    if(typeof Sanitizer !== 'undefined'){
        const sanitizer = new Sanitizer();
        if(sanitizer.sanitizeFor !== undefined){
            attr = sanitizer.sanitizeFor('template', attr).innerHTML as string;
        }
        
    }
    try{
        const firstChar = attr[0];
        const {primaryProp, parseAndCamelize} = config;
        if(parseAndCamelize){
            const {parseAndCamelize} = await import('./parseAndCamelize.js');
            const pAndC =  parseAndCamelize(attr, config);
            if(primaryProp !== undefined) {
                return saveAndReturn( {[primaryProp]: pAndC}, attr, cache);
            }else{
                return saveAndReturn( pAndC, attr, cache);
            }
        }
        if (firstChar === '{' || firstChar === '[') {
            
           
            const obj = JSON.parse(attr);
            const {primaryPropReq} = config;
            if(primaryProp && primaryPropReq && obj[primaryProp] === undefined){
                return saveAndReturn( {
                    [primaryProp]: obj
                }, attr, cache);
            }
            return saveAndReturn(obj, attr, cache);

        }else if(primaryProp !== undefined){

            return saveAndReturn( {
                [primaryProp]: attr
            }, attr, cache);

        }else{
            //console.log('return empty', performance.now());
            return {};
        } 

        
    } catch (e) {
        console.error(e);
        return {};
    }
}

function saveAndReturn(obj: JSONValue, attr: string, cache?: Map<string, JSONValue>){
    if(cache !== undefined) {
        //console.log('cache ' + attr);
        cache.set(attr, obj);
    }
    //console.log('saveAndReturn', performance.now());
    return obj;
}