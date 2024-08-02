import { Actions, Compacts, Handlers, Infractions, Positractions, Hitches } from 'trans-render/O.d.ts';
export {IEnhancement, BEAllProps} from 'trans-render/be.d.ts';

export type Enhancement = string; //camelCase;
export type EnhKey = string; //lisp case;
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
    actions?: Actions<TProps, TActions>;
    /**
     * inferred actions
     */
    infractions?: Infractions<TProps>,
    compacts?: Compacts<TProps, TProps & TActions>;
    hitch?: Hitches<TProps, TActions>
    handlers?: Handlers<ETProps, TActions>;
    positractions?: Positractions<TProps, TActions>;
    watchedBranches?: Set<number>;
}

