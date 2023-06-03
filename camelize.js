export function camelize(strToCamelize, config) {
    const statements = strToCamelize.split('.');
    const objToMerge = {};
    let prevSplitStatement;
    const { defaultBucket } = config;
    for (const statement of statements) {
        const trimmedStatement = statement.trim();
        if (trimmedStatement.length === 0)
            continue;
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
        else if (defaultBucket !== undefined && splitStatement[0] === '^') {
            splitStatement[0] = defaultBucket;
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
    return objToMerge;
}
