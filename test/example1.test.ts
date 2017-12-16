import * as tape from "tape"

tape(('should return -1 when the value is not present in Array'), (t: tape.Test) =>{
    t.equal(-1, [1,2,3].indexOf(4)); // 4 is not present in this array so passes
    t.end();
})