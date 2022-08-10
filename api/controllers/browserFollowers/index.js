"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIndex = void 0;
const getIndex = (array, id) => {
    if (array[0]._id !== id) {
        return 0;
    }
    else {
        return 1;
    }
};
exports.getIndex = getIndex;
