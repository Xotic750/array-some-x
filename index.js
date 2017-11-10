/**
 * @file Tests whether some element passes the provided function.
 * @version 2.5.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module array-some-x
 */

'use strict';

var cachedCtrs = require('cached-constructors-x');
var ArrayCtr = cachedCtrs.Array;
var castObject = cachedCtrs.Object;
var nativeSome = typeof ArrayCtr.prototype.some === 'function' && ArrayCtr.prototype.some;

var isWorking;
if (nativeSome) {
  var attempt = require('attempt-x');
  var spy = 0;
  var res = attempt.call([1, 2], nativeSome, function (item) {
    spy += item;
    return false;
  });

  isWorking = res.threw === false && res.value === false && spy === 3;

  if (isWorking) {
    spy = '';
    res = attempt.call(castObject('abc'), nativeSome, function (item, index) {
      spy += item;
      return index === 1;
    });

    isWorking = res.threw === false && res.value === true && spy === 'ab';
  }

  if (isWorking) {
    spy = 0;
    res = attempt.call((function () {
      return arguments;
    }(1, 2, 3)), nativeSome, function (item, index) {
      spy += item;
      return index === 2;
    });

    isWorking = res.threw === false && res.value === true && spy === 6;
  }

  if (isWorking) {
    spy = 0;
    res = attempt.call({
      0: 1,
      1: 2,
      3: 3,
      4: 4,
      length: 4
    }, nativeSome, function (item) {
      spy += item;
      return false;
    });

    isWorking = res.threw === false && res.value === false && spy === 6;
  }

  if (isWorking) {
    var doc = typeof document !== 'undefined' && document;
    if (doc) {
      spy = null;
      var fragment = doc.createDocumentFragment();
      var div = doc.createElement('div');
      fragment.appendChild(div);
      res = attempt.call(fragment.childNodes, nativeSome, function (item) {
        spy = item;
        return item;
      });

      isWorking = res.threw === false && res.value === true && spy === div;
    }
  }

  if (isWorking) {
    var isStrict = (function () {
      // eslint-disable-next-line no-invalid-this
      return Boolean(this) === false;
    }());

    if (isStrict) {
      spy = null;
      res = attempt.call([1], nativeSome, function () {
        // eslint-disable-next-line no-invalid-this
        spy = typeof this === 'string';
      }, 'x');

      isWorking = res.threw === false && res.value === false && spy === true;
    }
  }

  if (isWorking) {
    spy = {};
    var fn = [
      'return nativeSome.call("foo", function (_, __, context) {',
      'if (Boolean(context) === false || typeof context !== "object") {',
      'spy.value = true;}});'
    ].join('');

    // eslint-disable-next-line no-new-func
    res = attempt(Function('nativeSome', 'spy', fn), nativeSome, spy);

    isWorking = res.threw === false && res.value === false && spy.value !== true;
  }
}

var $some;
if (nativeSome) {
  $some = function some(array, callBack /* , thisArg */) {
    var args = [callBack];
    if (arguments.length > 2) {
      args[1] = arguments[2];
    }

    return nativeSome.apply(array, args);
  };
} else {
  // ES5 15.4.4.17
  // http://es5.github.com/#x15.4.4.17
  // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some
  var splitIfBoxedBug = require('split-if-boxed-bug-x');
  var toLength = require('to-length-x').toLength2018;
  var isUndefined = require('validate.io-undefined');
  var toObject = require('to-object-x');
  var assertIsFunction = require('assert-is-function-x');

  $some = function some(array, callBack /* , thisArg */) {
    var object = toObject(array);
    // If no callback function or if callback is not a callable function
    assertIsFunction(callBack);
    var iterable = splitIfBoxedBug(object);
    var length = toLength(iterable.length);
    var thisArg;
    if (arguments.length > 2) {
      thisArg = arguments[2];
    }

    var noThis = isUndefined(thisArg);
    for (var i = 0; i < length; i += 1) {
      if (i in iterable) {
        var item = iterable[i];
        if (noThis ? callBack(item, i, object) : callBack.call(thisArg, item, i, object)) {
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
