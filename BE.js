export class BE extends HTMLElement {
    _ee;
    async attach(enhancedElement, enhancement) {
        this._ee = enhancedElement;
        this.connectedCallback();
        Object.assign(this, enhancedElement[enhancement]);
    }
}
export const defaultArgs = {
    config: {
        propDefaults: {
            resolved: false,
            rejected: false,
        },
        propInfo: {
            resolved: {
                notify: {
                    dispatch: true
                }
            }
        }
    }
};
export const propDefaults = {
    resolved: false,
    rejected: false,
};
export const propInfo = {
    resolved: {
        notify: {
            dispatch: true
        }
    },
    rejected: {
        notify: {
            dispatch: true
        }
    }
};
