import { assignGingerly } from 'trans-render/lib/assignGingerly.js';
import { dispatchEvent } from 'trans-render/positractions/dispatchEvent.js';
const publicPrivateStore = Symbol();
export class BE extends EventTarget {
    sleep;
    awake() {
        throw new Error('Method not implemented.');
    }
    nudge() {
        throw new Error('Method not implemented.');
    }
    propagator = new EventTarget();
    [publicPrivateStore] = {};
    covertAssignment(obj) {
        assignGingerly(this[publicPrivateStore], obj);
    }
    #disconnectedAbortController = new AbortController();
    get disconnectedSignal() {
        return this.#disconnectedAbortController.signal;
    }
    get #config() {
        return this.constructor.config;
    }
    de = dispatchEvent;
    #enhancedElement;
    #ei;
    get enhancedElement() {
        return this.#enhancedElement;
    }
    async attach(el, enhancementInfo) {
        this.#enhancedElement = el;
        this.#ei = enhancementInfo;
        this.covertAssignment({ enhancedElement: el });
        const props = this.constructor.props;
        this.#propUp(props, enhancementInfo);
        await this.#instantiateRoundaboutIfApplicable(el);
    }
    /**
     * Needed for asynchronous loading
     * @param props Array of property names to "upgrade", without losing value set while element was Unknown
     * @param defaultValues:   If property value not set, set it from the defaultValues lookup
     * @private
     */
    #propUp(props, enhancementInfo) {
        const { initialPropValues } = enhancementInfo;
        const objToMerge = { ...initialPropValues };
        for (const key in props) {
            if (key in objToMerge)
                continue;
            const propInfo = props[key];
            const value = propInfo.def;
            if (value !== undefined) {
                objToMerge[key] = value;
            }
        }
        this.covertAssignment(objToMerge);
    }
    async detach(el) {
        this.propagator.dispatchEvent(new Event('disconnectedCallback'));
        this.#disconnectedAbortController.abort();
    }
    #roundabout;
    async #instantiateRoundaboutIfApplicable(container) {
        const config = this.#config;
        const { actions, compacts, infractions, handlers, positractions, hitch } = config;
        if ((actions || compacts || infractions || handlers || positractions) !== undefined) {
            const { roundabout } = await import('trans-render/froop/roundabout.js');
            const [vm, ra] = await roundabout({
                vm: this,
                container,
                actions,
                compacts,
                handlers,
                positractions,
                hitch
            }, infractions);
            this.#roundabout = ra;
        }
    }
    whenResolved() {
        return new Promise((resolve, reject) => {
            if (this.rejected) {
                resolve(false);
                return;
                //reject(false);
            }
            if (this.resolved) {
                resolve(true);
                return;
            }
            this.addEventListener('resolved', e => {
                if (this.resolved) {
                    resolve(true);
                }
            });
        });
    }
    dispatchEventFromEnhancedElement(type, init) {
        throw 'NI';
        // const prefixedType = 'enh-' + this.#ei!.enh + '.' + type;
        // const evt = init ? new CustomEvent(prefixedType, init) : new Event(prefixedType);
        // this.#enhancedElement!.dispatchEvent(evt);
    }
    static config;
    static async bootUp() {
        const config = this.config;
        const { propDefaults, propInfo } = config;
        const props = { ...this.props };
        Object.assign(props, propInfo);
        if (propDefaults !== undefined) {
            for (const key in propDefaults) {
                const def = propDefaults[key];
                const propInfo = {
                    ...defaultProp,
                    def,
                    propName: key
                };
                props[key] = propInfo;
            }
        }
        if (propInfo !== undefined) {
            for (const key in propInfo) {
                const prop = propInfo[key];
                const mergedPropInfo = {
                    ...defaultProp,
                    ...prop,
                    propName: key
                };
                props[key] = mergedPropInfo;
            }
        }
        this.props = props;
        this.addProps(this, props);
    }
    static addProps(newClass, props) {
        const proto = newClass.prototype;
        for (const key in props) {
            if (key in proto)
                continue;
            const prop = props[key];
            const { ro } = prop;
            if (ro) {
                Object.defineProperty(proto, key, {
                    get() {
                        return this[publicPrivateStore][key];
                    },
                    enumerable: true,
                    configurable: true,
                });
            }
            else {
                Object.defineProperty(proto, key, {
                    get() {
                        return this[publicPrivateStore][key];
                    },
                    set(nv) {
                        const ov = this[publicPrivateStore][key];
                        if (prop.dry && ov === nv)
                            return;
                        this[publicPrivateStore][key] = nv;
                        this.propagator.dispatchEvent(new Event(key));
                    },
                    enumerable: true,
                    configurable: true,
                });
            }
        }
    }
    static props = {};
}
const defaultProp = {
    dry: true,
};
export const propDefaults = {
    resolved: false,
    rejected: false,
};
