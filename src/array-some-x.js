/**
 * @file Tests whether some element passes the provided function.
 * @version 2.5.0.
 * @author Xotic750 <Xotic750@gmail.com>.
 * @copyright  Xotic750.
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module Array-some-x.
 */

import cachedCtrs from 'cached-constructors-x';

const ArrayCtr = cachedCtrs.Array;
const castObject = cachedCtrs.Object;
const nativeSome = typeof ArrayCtr.prototype.some === 'function' && ArrayCtr.prototype.some;

let isWorking;

if (nativeSome) {
  const attempt = require('attempt-x');
  let spy = 0;
  let res = attempt.call([1, 2], nativeSome, function(item) {
    spy += item;

    return false;
  });

  isWorking = res.threw === false && res.value === false && spy === 3;

  if (isWorking) {
    spy = '';
    res = attempt.call(castObject('abc'), nativeSome, function(item, index) {
      spy += item;

      return index === 1;
    });

    isWorking = res.threw === false && res.value === true && spy === 'ab';
  }

  if (isWorking) {
    spy = 0;
    res = attempt.call(
      (function() {
        return arguments;
      })(1, 2, 3),
      nativeSome,
      function(item, index) {
        spy += item;

        return index === 2;
      },
    );

    isWorking = res.threw === false && res.value === true && spy === 6;
  }

  if (isWorking) {
    spy = 0;
    res = attempt.call(
      {
        0: 1,
        1: 2,
        3: 3,
        4: 4,
        length: 4,
      },
      nativeSome,
      function(item) {
        spy += item;

        return false;
      },
    );

    isWorking = res.threw === false && res.value === false && spy === 6;
  }

  if (isWorking) {
    const doc = typeof document !== 'undefined' && document;

    if (doc) {
      spy = null;
      const fragment = doc.createDocumentFragment();
      const div = doc.createElement('div');
      fragment.appendChild(div);
      res = attempt.call(fragment.childNodes, nativeSome, function(item) {
        spy = item;

        return item;
      });

      isWorking = res.threw === false && res.value === true && spy === div;
    }
  }

  if (isWorking) {
    const isStrict = (function() {
      // eslint-disable-next-line no-invalid-this
      return Boolean(this) === false;
    })();

    if (isStrict) {
      spy = null;
      res = attempt.call(
        [1],
        nativeSome,
        function() {
          // eslint-disable-next-line no-invalid-this
          spy = typeof this === 'string';
        },
        'x',
      );

      isWorking = res.threw === false && res.value === false && spy === true;
    }
  }

  if (isWorking) {
    spy = {};
    const fn = [
      'return nativeSome.call("foo", function (_, __, context) {',
      'if (Boolean(context) === false || typeof context !== "object") {',
      'spy.value = true;}});',
    ].join('');

    // eslint-disable-next-line no-new-func
    res = attempt(Function('nativeSome', 'spy', fn), nativeSome, spy);

    isWorking = res.threw === false && res.value === false && spy.value !== true;
  }
}

let $some;

if (nativeSome) {
  $some = function some(array, callBack /* , thisArg */) {
    const args = [callBack];

    if (arguments.length > 2) {
      args[1] = arguments[2];
    }

    return nativeSome.apply(array, args);
  };
} else {
  // ES5 15.4.4.17
  // http://es5.github.com/#x15.4.4.17
  // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some
  const splitIfBoxedBug = require('split-if-boxed-bug-x');
  const toLength = require('to-length-x').toLength2018;
  const isUndefined = require('validate.io-undefined');
  const toObject = require('to-object-x');
  const assertIsFunction = require('assert-is-function-x');

  $some = function some(array, callBack /* , thisArg */) {
    const object = toObject(array);
    // If no callback function or if callback is not a callable function
    assertIsFunction(callBack);
    const iterable = splitIfBoxedBug(object);
    const length = toLength(iterable.length);
    let thisArg;

    if (arguments.length > 2) {
      thisArg = arguments[2];
    }

    const noThis = isUndefined(thisArg);
    for (let i = 0; i < length; i += 1) {
      if (i in iterable) {
        const item = iterable[i];

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
 * @param {Array} array - The array to iterate over.
 * @param {Function} callBack - Function to test for each element.
 * @param {*} [thisArg] - Value to use as this when executing callback.
 * @throws {TypeError} If array is null or undefined.
 * @throws {TypeError} If callBack is not a function.
 * @returns {boolean} `true` if the callback function returns a truthy value for
 *  any array element; otherwise, `false`.
 * @example
 * var some = require('array-some-x');.
 *
 * function isBiggerThan10(element, index, array) {
 *   return element > 10;
 * }
 *
 * some([2, 5, 8, 1, 4], isBiggerThan10);  // false
 * some([12, 5, 8, 1, 4], isBiggerThan10); // true
 */
export default $some;
