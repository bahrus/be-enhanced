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
            attr = sanitizer.sanitizeFor('template', attr).innerHTML;
        }
    }
    //let parsedObj: any;
    try {
        const firstChar = attr[0];
        const { primaryProp } = config;
        const { parseAndCamelize } = config;
        if (firstChar === '{' || firstChar === '[') {
            if (parseAndCamelize) {
                const { parseAndCamelize } = await import('./parseAndCamelize.js');
                const pAndC = parseAndCamelize(attr);
                if (primaryProp !== undefined) {
                    return { [primaryProp]: pAndC };
                }
                else {
                    return pAndC;
                }
            }
            else {
                const obj = JSON.parse(attr);
                const { primaryPropReq } = config;
                if (primaryProp && primaryPropReq && obj[primaryProp] === undefined) {
                    return {
                        [primaryProp]: obj
                    };
                }
                return obj;
            }
        }
        else if (primaryProp !== undefined) {
            if (parseAndCamelize) {
                const { camelizeOptions } = config;
                if (camelizeOptions !== undefined) {
                    const { camelPlus } = await import('./camelPlus.js');
                    const objToAssign = {};
                    await camelPlus(objToAssign, camelizeOptions, primaryProp, config);
                    return {
                        [primaryProp]: objToAssign,
                    };
                }
                else {
                    const { camelize } = await import('./camelize.js');
                    return {
                        [primaryProp]: camelize(attr)
                    };
                }
            }
            else {
                return {
                    [primaryProp]: attr
                };
            }
        }
        else {
            return {};
        }
    }
    catch (e) {
        console.error(e);
        return {};
    }
}
