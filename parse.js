export async function parse(enhancement, config) {
    const { enhancementInfo, enhancedElement } = enhancement;
    const { enh } = enhancementInfo;
    let attr = enhancedElement.getAttribute(enh);
    if (attr === null)
        return {};
    attr = attr.trim();
    if (typeof Sanitizer !== 'undefined') {
        const sanitizer = new Sanitizer();
        if (sanitizer.sanitizeFor !== undefined) {
            attr = sanitizer.sanitizeFor('template', json).innerHTML;
        }
    }
    try {
        const firstChar = attr[0];
        const { primaryProp } = config;
        if (firstChar === '{' || firstChar === '[') {
            //todo:  parse and camelize
            const obj = JSON.parse(attr);
            const { primaryPropReq } = config;
            if (primaryProp && primaryPropReq && obj[primaryProp] === undefined) {
                return {
                    [primaryProp]: obj
                };
            }
            return obj;
        }
        else if (primaryProp !== undefined) {
            return {
                [primaryProp]: attr
            };
        }
        else {
            throw 400;
        }
    }
    catch (e) {
        console.error(e);
        return {};
    }
}
