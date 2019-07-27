import attempt from 'attempt-x';
import splitIfBoxedBug from 'split-if-boxed-bug-x';
import toLength from 'to-length-x';
import toObject from 'to-object-x';
import assertIsFunction from 'assert-is-function-x';
import requireObjectCoercible from 'require-object-coercible-x';
var ns = [].some;
var nativeSome = typeof ns === 'function' && ns;

var test1 = function test1() {
  var spy = 0;
  var res = attempt.call([1, 2], nativeSome, function spyAdd1(item) {
    spy += item;
    return false;
  });
  return res.threw === false && res.value === false && spy === 3;
};

var test2 = function test2() {
  var spy = '';
  var res = attempt.call({}.constructor('abc'), nativeSome, function spyAdd2(item, index) {
    spy += item;
    return index === 1;
  });
  return res.threw === false && res.value === true && spy === 'ab';
};

var test3 = function test3() {
  var spy = 0;
  var res = attempt.call(function getArgs() {
    /* eslint-disable-next-line prefer-rest-params */
    return arguments;
  }(1, 2, 3), nativeSome, function spyAdd3(item, index) {
    spy += item;
    return index === 2;
  });
  return res.threw === false && res.value === true && spy === 6;
};

var test4 = function test4() {
  var spy = 0;
  var res = attempt.call({
    0: 1,
    1: 2,
    3: 3,
    4: 4,
    length: 4
  }, nativeSome, function spyAdd4(item) {
    spy += item;
    return false;
  });
  return res.threw === false && res.value === false && spy === 6;
};

var test5 = function test5() {
  var doc = typeof document !== 'undefined' && document;

  if (doc) {
    var spy = null;
    var fragment = doc.createDocumentFragment();
    var div = doc.createElement('div');
    fragment.appendChild(div);
    var res = attempt.call(fragment.childNodes, nativeSome, function spyAssign(item) {
      spy = item;
      return item;
    });
    return res.threw === false && res.value === true && spy === div;
  }

  return true;
};

var test6 = function test6() {
  var isStrict = function getIsStrict() {
    /* eslint-disable-next-line babel/no-invalid-this */
    return true.constructor(this) === false;
  }();

  if (isStrict) {
    var spy = null;
    var res = attempt.call([1], nativeSome, function thisTest() {
      /* eslint-disable-next-line babel/no-invalid-this */
      spy = typeof this === 'string';
    }, 'x');
    return res.threw === false && res.value === false && spy === true;
  }

  return true;
};

var test7 = function test7() {
  var spy = {};
  var fn = 'return nativeSome.call("foo", function (_, __, context) {' + 'if (castBoolean(context) === false || typeof context !== "object") {' + 'spy.value = true;}});';
  /* eslint-disable-next-line no-new-func */

  var res = attempt(Function('nativeSome', 'spy', 'castBoolean', fn), nativeSome, spy, true.constructor);
  return res.threw === false && res.value === false && spy.value !== true;
};

var isWorking = true.constructor(nativeSome) && test1() && test2() && test3() && test4() && test5() && test6() && test7();

var patchedSome = function patchedSome() {
  return function some(array, callBack
  /* , thisArg */
  ) {
    requireObjectCoercible(array);
    var args = [assertIsFunction(callBack)];

    if (arguments.length > 2) {
      /* eslint-disable-next-line prefer-rest-params,prefer-destructuring */
      args[1] = arguments[2];
    }

    return nativeSome.apply(array, args);
  };
}; // ES5 15.4.4.17
// http://es5.github.com/#x15.4.4.17
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some


var implementation = function implementation() {
  return function some(array, callBack
  /* , thisArg */
  ) {
    var object = toObject(array); // If no callback function or if callback is not a callable function

    assertIsFunction(callBack);
    var iterable = splitIfBoxedBug(object);
    var length = toLength(iterable.length);
    var thisArg;

    if (arguments.length > 2) {
      /* eslint-disable-next-line prefer-rest-params,prefer-destructuring */
      thisArg = arguments[2];
    }

    var noThis = typeof thisArg === 'undefined';

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
};
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
 */


var $some = isWorking ? patchedSome() : implementation();
export default $some;

//# sourceMappingURL=array-some-x.esm.js.map