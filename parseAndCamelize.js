export function parseAndCamelize(json, config) {
    if (json.startsWith('```')) {
        const split = json.split('```').filter(s => s.trim() !== '');
        //No nested ```'s
        return split.map(s => parseAndCamelize(s, config));
    }
    const lastChar = json.lastIndexOf('}');
    const strToCamelize = json.substring(lastChar + 1);
    json = json?.substring(0, lastChar + 1);
    const parsedObj = JSON.parse(json);
    //TODO:  conditionally load code below only if string after JSON is non trivial
    const statements = strToCamelize.split('.');
    const objToMerge = {};
    let prevSplitStatement;
    for (const statement of statements) {
        const trimmedStatement = statement.trim();
        if (trimmedStatement.startsWith('//'))
            continue;
        const normalizedStatement = trimmedStatement.replace(/\s+/g, ' ');
        const splitStatement = normalizedStatement.split(' ');
        if (prevSplitStatement !== undefined) {
            let idx = 0;
            for (const token of splitStatement) {
                if (token === '^') {
                    splitStatement[idx] = prevSplitStatement[idx];
                }
                idx++;
            }
        }
        prevSplitStatement = splitStatement;
        const head = splitStatement[0];
        let bucket = objToMerge[head];
        if (bucket === undefined) {
            bucket = [];
            objToMerge[head] = bucket;
        }
        const tail = splitStatement.slice(1).map((s, idx) => idx === 0 ? s : s[0].toUpperCase() + s.substring(1)).join('');
        bucket.push(tail);
    }
    Object.assign(parsedObj, objToMerge);
    return parsedObj;
}
