import { JSONValue } from "trans-render/lib/types";

export type Enhancement = string; //camelCase;
export type Enh = string; //lisp case;
export type FQN = string;

export interface AllProps {
    resolved: boolean;
    rejected: boolean;
}

export interface EnhancementInfo {
    enhancement: Enhancement,
    enh: Enh,
    fqn: FQN,
    localName: string,
    initialPropValues?: any,
}
export interface IEnhancement<TElement = Element> extends AllProps, HTMLElement{
    attach(el: TElement, enhancement: EnhancementInfo): Promise<void>;
    detach(el: TElement): void;
    resolved: boolean;
    rejected: boolean;
    readonly enhancedElement: TElement;
    whenResolved(): Promise<boolean>;
    parsedFrom: string;
    autoImport?: boolean | string;
}

export interface IBE<TElement = Element> extends IEnhancement<TElement>{
    connectedCallback(): void;
}

export interface BEConfig<TPrimaryProp = any>{
    parse?: boolean;
    cache?: Map<string, JSONValue>;
    primaryProp?: string;
    primaryPropReq?: boolean;
    parseAndCamelize?: boolean;
    camelizeOptions?: CamelizeOptions<TPrimaryProp>;
    defaultBucket?: string; //TODO
    isParsedProp?: keyof TPrimaryProp & string;
    attachWhenConnected?: boolean; //TODO
    /**
     * Used to signify the "main" property that holds state for enhancement.
     */
    stateProp?: keyof TPrimaryProp & string;
}

export interface CamelizeOptions<TPrimaryProp = any>{
    simpleSets?: (keyof TPrimaryProp & string)[];
    booleans?: (keyof TPrimaryProp & string)[];
    doSets?: boolean;
}

export type Declarations = {[key: string]: any}

export interface RegExpExt<TStatementGroup = any>{
    regExp: RegExp,
    defaultVals: TStatementGroup,
}

export type RegExpOrRegExpExt<TStatementGroup = any> = RegExp | RegExpExt<TStatementGroup>;

export interface BeSplitOutput {
    eventName: string,
    path: string,
}