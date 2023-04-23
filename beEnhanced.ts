import {Enhancement, Enh} from './types';



export async function toImport(enhancement: Enhancement): Enh{

}

export async function beEnhanced(el: Element, enhancement: Enhancement){
    const aEl = el as any;
    const enh =  aEl[enhancement];
    switch(typeof enh){
        case 'function':
            return enh;
    }
}