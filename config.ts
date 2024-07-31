import { BEConfig} from "./ts-refs/be-enhanced/types";
import {IEnhancement} from './ts-refs/trans-render/be/types';

export const config: BEConfig<IEnhancement> = {
    propInfo: {
        enhancedElement:{
            ro: true,
        },
        resolved: {
            //Need to allow external components to set resolved to true (e.g. be-exportable)
            //ro: true,
        },
        rejected: {
            //ro: true,
        }
    },
    positractions:[
        {
            do: 'de',
            ifAllOf:['resolved'],
            pass:['$0+', '`resolved`']
        },
        {
            do: 'de',
            ifAllOf: ['rejected'],
            pass: ['$0+', '`rejected`']
        }
    ]

}