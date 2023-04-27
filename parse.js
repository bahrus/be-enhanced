export async function parse(enhancement) {
    const { beConfig, enhancementInfo, enhancedElement } = enhancement;
    const { enh } = enhancementInfo;
    const attr = enhancedElement.getAttribute(enh);
    if (attr === null)
        return {};
    try {
        return JSON.parse(attr);
    }
    catch (e) {
        console.error(e);
        return {};
    }
}
