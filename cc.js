/** @import {BEConfig, IEnhancement, BEAllProps} from './ts-refs/be-enhanced/types.d.ts' */
/** @import {Positraction, PropLookup, PropInfo} from './ts-refs/trans-render/froop/types.d.ts' */

/** @type {Positraction<IEnhancement>} */
export const resolved =  {
    do: 'de',
    ifAllOf:['resolved'],
    pass:['$0+', '`resolved`']
}

/** @type {Positraction<IEnhancement>} */
export const rejected = {
    do: 'de',
    ifAllOf: ['rejected'],
    pass: ['$0+', '`rejected`']
}

/** @type {Partial<{[key in keyof IEnhancement]: PropInfo}>;} */
export const propInfo = {
    enhancedElement:{
        ro: true,
    },
    resolved: {},
    rejected: {}
};