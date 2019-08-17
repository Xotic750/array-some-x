import attempt from 'attempt-x';
import toObject from 'to-object-x';
import assertIsFunction from 'assert-is-function-x';
import requireObjectCoercible from 'require-object-coercible-x';
import any from 'array-any-x';
import toBoolean from 'to-boolean-x';
import methodize from 'simple-methodize-x';
import call from 'simple-call-x';
var ns = [].some;
var nativeSome = typeof ns === 'function' && methodize(ns);

var test1 = function test1() {
  var spy = 0;
  var res = attempt(function attemptee() {
    return nativeSome([1, 2], function spyAdd1(item) {
      spy += item;
      return false;
    });
  });
  return res.threw === false && res.value === false && spy === 3;
};

var test2 = function test2() {
  var spy = '';
  var res = attempt(function attemptee() {
    return nativeSome(toObject('abc'), function spyAdd2(item, index) {
      spy += item;
      return index === 1;
    });
  });
  return res.threw === false && res.value === true && spy === 'ab';
};

var test3 = function test3() {
  var spy = 0;
  var res = attempt(function attemptee() {
    var args = function getArgs() {
      /* eslint-disable-next-line prefer-rest-params */
      return arguments;
    }(1, 2, 3);

    return nativeSome(args, function spyAdd3(item, index) {
      spy += item;
      return index === 2;
    });
  });
  return res.threw === false && res.value === true && spy === 6;
};

var test4 = function test4() {
  var spy = 0;
  var res = attempt(function attemptee() {
    return nativeSome({
      0: 1,
      1: 2,
      3: 3,
      4: 4,
      length: 4
    }, function spyAdd4(item) {
      spy += item;
      return false;
    });
  });
  return res.threw === false && res.value === false && spy === 6;
};

var doc = typeof document !== 'undefined' && document;

var test5 = function test5() {
  if (doc) {
    var spy = null;
    var fragment = doc.createDocumentFragment();
    var div = doc.createElement('div');
    fragment.appendChild(div);
    var res = attempt(function attemptee() {
      return nativeSome(fragment.childNodes, function spyAssign(item) {
        spy = item;
        return item;
      });
    });
    return res.threw === false && res.value === true && spy === div;
  }

  return true;
};

var isStrict = function getIsStrict() {
  /* eslint-disable-next-line babel/no-invalid-this */
  return toBoolean(this) === false;
}();

var test6 = function test6() {
  if (isStrict) {
    var spy = null;

    var thisTest = function thisTest() {
      /* eslint-disable-next-line babel/no-invalid-this */
      spy = typeof this === 'string';
    };

    var res = attempt(function attemptee() {
      return nativeSome([1], thisTest, 'x');
    });
    return res.threw === false && res.value === false && spy === true;
  }

  return true;
};

var test7 = function test7() {
  var spy = {};
  var fn = 'return nativeSome("foo", function (_, __, context) {' + 'if (castBoolean(context) === false || typeof context !== "object") {' + 'spy.value = true;}});';
  var res = attempt(function attemptee() {
    /* eslint-disable-next-line no-new-func */
    return Function('nativeSome', 'spy', 'castBoolean', fn)(nativeSome, spy, toBoolean);
  });
  return res.threw === false && res.value === false && spy.value !== true;
};

var isWorking = toBoolean(nativeSome) && test1() && test2() && test3() && test4() && test5() && test6() && test7();
console.log(isWorking);

var patchedSome = function some(array, callBack
/* , thisArg */
) {
  /* eslint-disable-next-line prefer-rest-params */
  return nativeSome(requireObjectCoercible(array), assertIsFunction(callBack), arguments[2]);
}; // ES5 15.4.4.17
// http://es5.github.com/#x15.4.4.17
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some


export var implementation = function some(array, callBack
/* , thisArg */
) {
  var object = toObject(array); // If no callback function or if callback is not a callable function

  assertIsFunction(callBack);

  var iteratee = function iteratee() {
    /* eslint-disable-next-line prefer-rest-params */
    var i = arguments[1];
    /* eslint-disable-next-line prefer-rest-params */

    if (i in arguments[2]) {
      /* eslint-disable-next-line prefer-rest-params,babel/no-invalid-this */
      if (call(callBack, this, [arguments[0], i, object])) {
        return true;
      }
    }

    return false;
  };
  /* eslint-disable-next-line prefer-rest-params */


  return any(object, iteratee, arguments[2]);
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

var $some = isWorking ? patchedSome : implementation;
export default $some;

//# sourceMappingURL=array-some-x.esm.js.map