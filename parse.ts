import {BE} from './BE.js';
import {JSONValue} from 'trans-render/lib/types';
export async function parse(enhancement: BE): Promise<JSONValue>{
    const {beConfig, enhancementInfo, enhancedElement} = enhancement;
    const {enh} = enhancementInfo;
    const attr = enhancedElement.getAttribute(enh);
    if( attr === null) return {};
    try{
        return JSON.parse(attr);
    } catch (e) {
        console.error(e);
        return {};
    }
}