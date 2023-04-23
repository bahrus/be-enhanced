export class BeEnhanced extends EventTarget {
    by(enh) {
    }
}
const wm = new WeakMap();
Object.defineProperty(Element.prototype, 'beEnhanced', {
    get() {
        if (!wm.has(this)) {
            wm.set(this, new BeEnhanced());
        }
        return wm.get(this);
    },
    enumerable: true,
    configurable: true,
});
export async function toImport(enhancement) {
}
export async function beEnhanced(el, enhancement) {
    const aEl = el;
    const enh = aEl[enhancement];
    switch (typeof enh) {
        case 'function':
            return enh;
    }
}
