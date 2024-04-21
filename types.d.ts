import { JSONValue } from "trans-render/lib/types";
import { Actions, Compacts, Handlers, Infractions, Onsets, Positractions } from 'trans-render/froop/types';
import { AttrChangeInfo, MountInit } from 'mount-observer/types';

export type Enhancement = string; //camelCase;
export type Enh = string; //lisp case;
export type FQN = string;





export interface PropInfo{
    dry?: boolean;
    ro?: boolean;
    def?: any;
    propName?: string,
}

export type PropLookup = {[key: string]: PropInfo}

export interface BEConfig<TProps = any, TActions = TProps, ETProps = TProps>{
    propDefaults?: Partial<{[key in keyof TProps]: TProps[key]}>;
    propInfo?: Partial<{[key in keyof TProps]: PropInfo}>;
    onsets?: Onsets<TProps, TActions>;
    actions?: Actions<TProps, TActions>;
    /**
     * inferred actions
     */
    infractions?: Infractions<TProps>,
    compacts?: Compacts<TProps>;
    handlers?: Handlers<ETProps, TActions>;
    positractions?: Positractions<TProps, TActions>;
    watchedBranches?: Set<number>;
}

// export interface IBE<TElement = Element> extends IEnhancement<TElement>{
//     connectedCallback(): void;
// }

// export interface BEConfig<TPrimaryProp = any>{
//     parse?: boolean;
//     cache?: Map<string, JSONValue>;
//     /**
//      * For JSON configured enhancements, this is the property that a primitive
//      * string attribute gets assigned to.
//      */
//     primaryProp?: keyof TPrimaryProp & string;
//     primaryPropReq?: boolean;
//     parseAndCamelize?: boolean;
//     camelizeOptions?: CamelizeOptions<TPrimaryProp>;
//     defaultBucket?: string; //TODO
//     isParsedProp?: keyof TPrimaryProp & string;
//     attachWhenConnected?: boolean; //TODO
//     /**
//      * Used to signify the "main" property that holds state for enhancement.
//      */
//     stateProp?: keyof TPrimaryProp & string;
// }

// export interface CamelizeOptions<TPrimaryProp = any>{
//     simpleSets?: (keyof TPrimaryProp & string)[];
//     booleans?: (keyof TPrimaryProp & string)[];
//     doSets?: boolean;
// }

// export type Declarations = {[key: string]: any}

// export interface RegExpExt<TStatementGroup = any>{
//     regExp: RegExp,
//     defaultVals: Partial<TStatementGroup>,
// }

// export type RegExpOrRegExpExt<TStatementGroup = any> = RegExp | RegExpExt<TStatementGroup>;

// export interface BeSplitOutput {
//     eventName: string,
//     path: string,
// }

// export interface TREnhancementEngagementProps {}
// export interface TREnhancementEngagementMethods{
//     attachEnhancement(model: any, el: Element, ctx: EngagementCtx<any>): Promise<IBE>
// }
// export interface TREnhancementEngagement extends HTMLElement, TREnhancementEngagementProps, TREnhancementEngagementMethods{}
// export type TREnhancementEngagementType = {new(): TREnhancementEngagement}