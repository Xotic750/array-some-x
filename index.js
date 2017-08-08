/**
 * @file Tests whether some element passes the provided function.
 * @version 1.0.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module array-some-x
 */

'use strict';

// Check failure of by-index access of string characters (IE < 9)
// and failure of `0 in boxedString` (Rhino)
var boxedString = Object('a');
var splitString = boxedString[0] !== 'a' || (0 in boxedString) === false;

var isStrict = (function () {
  // eslint-disable-next-line no-invalid-this
  return Boolean(this) === false;
}());

// Check node 0.6.21 bug where third parameter is not boxed
var properlyBoxesNonStrict = true;
var properlyBoxesStrict = true;
var nativeSome = Array.prototype.some;
if (nativeSome) {
  try {
    if (isStrict) {
      nativeSome.call([1], function () {
        // eslint-disable-next-line no-invalid-this
        properlyBoxesStrict = typeof this === 'string';
      }, 'x');
    } else {
      nativeSome.call('foo', function (_, __, context) {
        if (Boolean(context) === false || typeof context !== 'object') {
          properlyBoxesNonStrict = false;
        }
      });
    }
  } catch (e) {
    nativeSome = null;
  }
}

var $some;
if (nativeSome && properlyBoxesNonStrict && properlyBoxesStrict) {
  $some = function some(array, callBack /* , thisArg */) {
    var args = [callBack];
    if (arguments.length > 2) {
      args.push(arguments[2]);
    }

    return nativeSome.apply(array, args);
  };
} else {
  // ES5 15.4.4.17
  // http://es5.github.com/#x15.4.4.17
  // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some
  var toObject = require('to-object-x');
  var assertIsFunction = require('assert-is-function-x');
  var isString = require('is-string');
  var toLength = require('to-length-x');
  var isUndefined = require('validate.io-undefined');
  $some = function some(array, callBack /* , thisArg */) {
    var object = toObject(array);
    // If no callback function or if callback is not a callable function
    assertIsFunction(callBack);
    var iterable = splitString && isString(object) ? object.split('') : object;
    var length = toLength(iterable.length);
    var thisArg;
    if (arguments.length > 2) {
      thisArg = arguments[2];
    }

    for (var i = 0; i < length; i += 1) {
      if (i in iterable) {
        var result;
        if (isUndefined(thisArg)) {
          result = callBack(iterable[i], i, object);
        } else {
          result = callBack.call(thisArg, iterable[i], i, object);
        }

        if (result) {
          return true;
        }
      }
    }

    return false;
  };
}

/**
 * This method tests whether some element in the array passes the test
 * implemented by the provided function.
 *
 * @param {array} array The array to iterate over.
 * @param {Function} callBack Function to test for each element.
 * @param {*} [thisArg] Value to use as this when executing callback.
 * @throws {TypeError} If array is null or undefined.
 * @throws {TypeError} If callBack is not a function.
 * @return {boolean} `true` if the callback function returns a truthy value for
 *  any array element; otherwise, `false`.
 * @example
 * var some = require('array-some-x');
 *
 * function isBiggerThan10(element, index, array) {
 *   return element > 10;
 * }
 *
 * some([2, 5, 8, 1, 4], isBiggerThan10);  // false
 * some([12, 5, 8, 1, 4], isBiggerThan10); // true
 */
module.exports = $some;
