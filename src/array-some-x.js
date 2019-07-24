import attempt from 'attempt-x';
import splitIfBoxedBug from 'split-if-boxed-bug-x';
import toLength from 'to-length-x';
import toObject from 'to-object-x';
import assertIsFunction from 'assert-is-function-x';

/** @type {BooleanConstructor} */
const castBoolean = true.constructor;
/** @type {ObjectConstructor} */
const castObject = {}.constructor;
const ns = [].some;
const nativeSome = typeof ns === 'function' && ns;

let isWorking;

if (nativeSome) {
  let spy = 0;
  let res = attempt.call([1, 2], nativeSome, (item) => {
    spy += item;

    return false;
  });

  isWorking = res.threw === false && res.value === false && spy === 3;

  if (isWorking) {
    spy = '';
    res = attempt.call(castObject('abc'), nativeSome, (item, index) => {
      spy += item;

      return index === 1;
    });

    isWorking = res.threw === false && res.value === true && spy === 'ab';
  }

  if (isWorking) {
    spy = 0;
    res = attempt.call(
      (function getArgs() {
        /* eslint-disable-next-line prefer-rest-params */
        return arguments;
      })(1, 2, 3),
      nativeSome,
      (item, index) => {
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
      (item) => {
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
      res = attempt.call(fragment.childNodes, nativeSome, (item) => {
        spy = item;

        return item;
      });

      isWorking = res.threw === false && res.value === true && spy === div;
    }
  }

  if (isWorking) {
    const isStrict = (function getIsStrict() {
      /* eslint-disable-next-line babel/no-invalid-this */
      return castBoolean(this) === false;
    })();

    if (isStrict) {
      spy = null;
      res = attempt.call(
        [1],
        nativeSome,
        () => {
          /* eslint-disable-next-line babel/no-invalid-this */
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

    /* eslint-disable-next-line no-new-func */
    res = attempt(Function('nativeSome', 'spy', fn), nativeSome, spy);

    isWorking = res.threw === false && res.value === false && spy.value !== true;
  }
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
 */
let $some;

if (nativeSome) {
  $some = function some(array, callBack /* , thisArg */) {
    const args = [callBack];

    if (arguments.length > 2) {
      /* eslint-disable-next-line prefer-rest-params,prefer-destructuring */
      args[1] = arguments[2];
    }

    return nativeSome.apply(array, args);
  };
} else {
  // ES5 15.4.4.17
  // http://es5.github.com/#x15.4.4.17
  // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some

  $some = function some(array, callBack /* , thisArg */) {
    const object = toObject(array);
    // If no callback function or if callback is not a callable function
    assertIsFunction(callBack);
    const iterable = splitIfBoxedBug(object);
    const length = toLength(iterable.length);
    let thisArg;

    if (arguments.length > 2) {
      /* eslint-disable-next-line prefer-rest-params,prefer-destructuring */
      thisArg = arguments[2];
    }

    const noThis = typeof thisArg === 'undefined';
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

const s = $some;

export default s;