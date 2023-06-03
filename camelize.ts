import { BEConfig } from "./types";

export function camelize(strToCamelize: string, config: BEConfig){
    const statements = strToCamelize.split('.');
    const objToMerge: {[key: string]: string[]} = {};
    let prevSplitStatement: string[] | undefined;
    for(const statement of statements){
        const trimmedStatement = statement.trim();
        if(trimmedStatement.length === 0) continue;
        if(trimmedStatement.startsWith('//')) continue;
        const normalizedStatement = trimmedStatement.replace(/\s+/g, ' ');
        const splitStatement = normalizedStatement.split(' ');
        if(prevSplitStatement !== undefined){
            let idx = 0;
            for(const token of splitStatement){
                if(token === '^'){
                    splitStatement[idx] = prevSplitStatement[idx];
                }
                idx++;
            }
        }
        prevSplitStatement = splitStatement;
        const head = splitStatement[0];
        let bucket = objToMerge[head];
        if(bucket === undefined){
            bucket = [];
            objToMerge[head] = bucket;
        }
        const tail = splitStatement.slice(1).map((s, idx) => idx === 0 ? s : s[0].toUpperCase() + s.substring(1)).join('');
        bucket.push(tail);
    }
    return objToMerge;
}