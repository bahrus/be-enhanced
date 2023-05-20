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
    const { cache } = config;
    if (cache?.has(attr))
        return cache.get(attr);
    try {
        const firstChar = attr[0];
        const { primaryProp } = config;
        const { parseAndCamelize } = config;
        if (firstChar === '{' || firstChar === '[') {
            if (parseAndCamelize) {
                const { parseAndCamelize } = await import('./parseAndCamelize.js');
                const pAndC = parseAndCamelize(attr);
                if (primaryProp !== undefined) {
                    return saveAndReturn({ [primaryProp]: pAndC }, attr, cache);
                }
                else {
                    return saveAndReturn(pAndC, attr, cache);
                }
            }
            else {
                const obj = JSON.parse(attr);
                const { primaryPropReq } = config;
                if (primaryProp && primaryPropReq && obj[primaryProp] === undefined) {
                    return saveAndReturn({
                        [primaryProp]: obj
                    }, attr, cache);
                }
                return obj;
            }
        }
        else if (primaryProp !== undefined) {
            if (parseAndCamelize) {
                const { camelizeOptions } = config;
                const { camelize } = await import('./camelize.js');
                if (camelizeOptions !== undefined) {
                    const { camelPlus } = await import('./camelPlus.js');
                    const objToAssign = {
                        [primaryProp]: camelize(attr)
                    };
                    await camelPlus(objToAssign, camelizeOptions, primaryProp, config);
                    return saveAndReturn(objToAssign, attr, cache);
                }
                else {
                    //const {camelize} = await import('./camelize.js');
                    return saveAndReturn({
                        [primaryProp]: camelize(attr)
                    }, attr, cache);
                }
            }
            else {
                return saveAndReturn({
                    [primaryProp]: attr
                }, attr, cache);
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
function saveAndReturn(obj, attr, cache) {
    if (cache !== undefined)
        cache.set(attr, obj);
    return obj;
}
