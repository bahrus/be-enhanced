export type Enhancement = string; //camelCase;
export type Enh = string; //lisp case;

export interface IEnhancement extends HTMLElement{
    attach(el: Element, enhancement: Enhancement): Promise<void>;
    resolved: boolean;
    rejected: boolean;
}

export interface IBE extends IEnhancement{
    connectedCallback(): void;
}