export async function parse(enhancement, config, gatewayVal) {
    //console.log('begin parse', performance.now());
    const { enhancementInfo, enhancedElement } = enhancement;
    const { enh } = enhancementInfo;
    if (enh === undefined)
        return {};
    let attr = enhancedElement.getAttribute(enh) || gatewayVal;
    if (attr === null) {
        //console.log('empty attr', performance.now(), enhancement.localName);
        return {};
    }
    attr = attr.trim();
    enhancement.parsedFrom = attr;
    const { cache } = config;
    if (cache?.has(attr)) {
        //console.log('return from cache', performance.now(), enhancement.localName);
        return cache.get(attr);
    }
    //console.log({attr});
    if (typeof Sanitizer !== 'undefined') {
        const sanitizer = new Sanitizer();
        if (sanitizer.sanitizeFor !== undefined) {
            attr = sanitizer.sanitizeFor('template', attr).innerHTML;
        }
    }
    try {
        const firstChar = attr[0];
        const { primaryProp } = config;
        const { parseAndCamelize } = config;
        if (firstChar === '{' || firstChar === '[') {
            if (parseAndCamelize) {
                const { parseAndCamelize } = await import('./parseAndCamelize.js');
                const pAndC = parseAndCamelize(attr, config);
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
                return saveAndReturn(obj, attr, cache);
            }
        }
        else if (primaryProp !== undefined) {
            if (parseAndCamelize) {
                const { camelizeOptions } = config;
                const { camelize } = await import('./camelize.js');
                if (camelizeOptions !== undefined) {
                    const { camelPlus } = await import('./camelPlus.js');
                    const objToAssign = {
                        [primaryProp]: camelize(attr, config)
                    };
                    await camelPlus(objToAssign, camelizeOptions, primaryProp, config);
                    return saveAndReturn(objToAssign, attr, cache);
                }
                else {
                    //const {camelize} = await import('./camelize.js');
                    return saveAndReturn({
                        [primaryProp]: camelize(attr, config)
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
            //console.log('return empty', performance.now());
            return {};
        }
    }
    catch (e) {
        console.error(e);
        return {};
    }
}
function saveAndReturn(obj, attr, cache) {
    if (cache !== undefined) {
        //console.log('cache ' + attr);
        cache.set(attr, obj);
    }
    //console.log('saveAndReturn', performance.now());
    return obj;
}
