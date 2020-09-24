"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.abiEncodeWithSelector = void 0;
var ethers_1 = require("ethers");
function abiEncodeWithSelector(abi, functionName, inputs) {
    try {
        var interFace = new ethers_1.utils.Interface(abi);
        var functionFragment = void 0;
        try {
            functionFragment = interFace.getFunction(functionName);
        }
        catch (error) {
            throw new Error("\n \u274C abi-encode-with-selector: functionName \"" + functionName + "\" not found");
        }
        var payloadWithSelector = void 0;
        if (inputs) {
            var iterableInputs = void 0;
            try {
                iterableInputs = __spread(inputs);
            }
            catch (error) {
                iterableInputs = [inputs];
            }
            payloadWithSelector = interFace.encodeFunctionData(functionFragment, iterableInputs);
        }
        else {
            payloadWithSelector = interFace.encodeFunctionData(functionFragment, []);
        }
        return payloadWithSelector;
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
}
exports.abiEncodeWithSelector = abiEncodeWithSelector;
//# sourceMappingURL=abiEncodeWithSelector.js.map