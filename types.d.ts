export type Enhancement = string; //camelCase;
export type Enh = string; //lisp case;

export interface IEnhancement{
    attach(el: Element, enhancement: Enhancement)
}