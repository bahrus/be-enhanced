export const TREnhancementEngagement = (superclass) => class extends superclass {
    async loadBe(be) { }
    async attachEnhancement(model, el, ctx) {
        const { be, with: w } = ctx;
        this.loadBe(be);
        if (w !== undefined) {
            Object.assign(el.beEnhanced.by[be], w);
        }
        return await el.beEnhanced.whenResolved(be);
    }
};
