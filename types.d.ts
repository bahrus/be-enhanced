export type Enhancement = string; //camelCase;
export type Enh = string; //lisp case;

export interface AllProps {
    resolved: boolean;
    rejected: boolean;
}
export interface IEnhancement<TElement = Element> extends AllProps, HTMLElement{
    attach(el: TElement, enhancement: Enhancement): Promise<void>;
    resolved: boolean;
    rejected: boolean;
    readonly enhancedElement: TElement
}

export interface IBE<TElement = Element> extends IEnhancement<TElement>{
    connectedCallback(): void;
}