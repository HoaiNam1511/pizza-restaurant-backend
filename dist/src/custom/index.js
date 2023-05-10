"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToUSD = void 0;
function convertToUSD(num) {
    const result = num.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    return result;
}
exports.convertToUSD = convertToUSD;
