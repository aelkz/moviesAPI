'use strict';

/**
 * Capitalize the first letter of a string
 */
exports.capitalize = function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
};