'use strict';

/**
 * Test JSON string validity
 */

// Use this function to see if you have a valid JSON
// string. If you pass it a json object you will see
// this error: "Unexpected token o". (?) If so try
// JSON.stringify(yourJSONobject) and pass that in.
exports.isValidJSON = function (jsonString) {
    try {
        var o = JSON.parse(jsonString);
        // Handle non-exception-throwing cases:
        // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
        // but... JSON.parse(null) returns 'null', and typeof null === 'object',
        // so we must check for that too. (!)
        if (o && typeof o === 'object' && o !== null) {
            return true;
        } else {
            return false;
        }
    }
    catch (e) {
        console.log('Error: ' + e.message);
    }
    return false;
};