"use strict";

/**
 * Works as Object.assign do, but skips assigning "undefined" values. Undefined values are kept in
 * target object only.
 * @param {...Object} objects
 * @returns {Object|*}
 */
module.exports = function (objects) {
    for (let i = 1; i < arguments.length; ++i) {
        for (const prop in arguments[i])
            if (arguments[i].hasOwnProperty(prop) && typeof arguments[i][prop] !== "undefined")
                arguments[0][prop] = arguments[i][prop];
    }
    return arguments[0];
};