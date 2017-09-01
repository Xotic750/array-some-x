/**
 * @file Tests whether some element passes the provided function.
 * @version 2.1.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module array-some-x
 */

'use strict';

var toObject = require('to-object-x');
var assertIsFunction = require('assert-is-function-x');
var documentElement = typeof document !== 'undefined' && document.documentElement;

var argObj = (function () {
  return arguments;
}(1));

var nativeSome = typeof Array.prototype.some === 'function' && Array.prototype.some;
if (nativeSome) {
  try {
    var worksWithStrings;
    nativeSome.call('abc', function () {
      worksWithStrings = true;
      return worksWithStrings;
    });

    if (worksWithStrings !== true) {
      throw new Error('failed string');
    }

    var worksWithArguments;
    nativeSome.call(argObj, function () {
      worksWithArguments = true;
      return worksWithStrings;
    });

    if (worksWithArguments !== true) {
      throw new Error('failed arguments');
    }

    if (documentElement) {
      var fragment = document.createDocumentFragment();
      var div = document.createElement('div');
      fragment.appendChild(div);

      var worksWithDOMElements;
      nativeSome.call(fragment.childNodes, function () {
        worksWithDOMElements = true;
        return worksWithDOMElements;
      });

      if (worksWithDOMElements !== true) {
        throw new Error('failed documentElement');
      }
    }

    var tests = {
      // Check node 0.6.21 bug where third parameter is not boxed
      properlyBoxesNonStrict: true,
      properlyBoxesStrict: true
    };

    var isStrict = (function () {
      // eslint-disable-next-line no-invalid-this
      return Boolean(this) === false;
    }());

    if (isStrict) {
      nativeSome.call([1], function () {
      // eslint-disable-next-line no-invalid-this
        tests.properlyBoxesStrict = typeof this === 'string';
      }, 'x');

      if (tests.properlyBoxesStrict !== true) {
        throw new Error('failed properlyBoxesStrict');
      }
    }

    var fn = [
      'return nativeSome.call("foo", function (_, __, context) {',
      'if (Boolean(context) === false || typeof context !== "object") {',
      'tests.properlyBoxesNonStrict = false;}});'
    ].join('');

    // eslint-disable-next-line no-new-func
    Function('nativeSome', 'tests', fn)(nativeSome, tests);

    if (tests.properlyBoxesNonStrict !== true) {
      throw new Error('failed properlyBoxesNonStrict');
    }
  } catch (ignore) {
    nativeSome = null;
  }
}

var $some;
if (nativeSome) {
  $some = function some(array, callBack /* , thisArg */) {
    var object = toObject(array);
    var args = [assertIsFunction(callBack)];
    if (arguments.length > 2) {
      args[1] = arguments[2];
    }

    return nativeSome.apply(object, args);
  };
} else {
  // ES5 15.4.4.17
  // http://es5.github.com/#x15.4.4.17
  // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some
  var splitString = require('has-boxed-string-x') === false;
  var isString;
  var slice;
  if (splitString) {
    isString = require('is-string');
    slice = require('array-slice-x');
  }

  var toLength = require('to-length-x');
  var isUndefined = require('validate.io-undefined');

  $some = function some(array, callBack /* , thisArg */) {
    var object = toObject(array);
    // If no callback function or if callback is not a callable function
    assertIsFunction(callBack);
    var iterable = splitString && isString(object) ? slice(object) : object;
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
 * @param {array} array - The array to iterate over.
 * @param {Function} callBack - Function to test for each element.
 * @param {*} [thisArg] - Value to use as this when executing callback.
 * @throws {TypeError} If array is null or undefined.
 * @throws {TypeError} If callBack is not a function.
 * @returns {boolean} `true` if the callback function returns a truthy value for
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
