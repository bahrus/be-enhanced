export type Enhancement = string; //camelCase;
export type Enh = string; //lisp case;

export interface AllProps {
    resolved: boolean;
    rejected: boolean;
}

export interface EnhancementInfo {
    enhancement: Enhancement,
    enh: Enh,
}
export interface IEnhancement<TElement = Element> extends AllProps, HTMLElement{
    attach(el: TElement, enhancement: EnhancementInfo): Promise<void>;
    resolved: boolean;
    rejected: boolean;
    readonly enhancedElement: TElement;
    whenResolved(): Promise<boolean>;
}

export interface IBE<TElement = Element> extends IEnhancement<TElement>{
    connectedCallback(): void;
}

export interface BEConfig{
    parse?: boolean;
    primaryProp?: string;
    primaryPropReq?: boolean;
}