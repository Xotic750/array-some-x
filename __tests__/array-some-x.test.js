let some;

if (typeof module === 'object' && module.exports) {
  require('es5-shim');
  require('es5-shim/es5-sham');

  if (typeof JSON === 'undefined') {
    JSON = {};
  }

  require('json3').runInContext(null, JSON);
  require('es6-shim');
  const es7 = require('es7-shim');
  Object.keys(es7).forEach(function(key) {
    const obj = es7[key];

    if (typeof obj.shim === 'function') {
      obj.shim();
    }
  });
  some = require('../../index.js');
} else {
  some = returnExports;
}

const itHasDoc = typeof document !== 'undefined' && document ? it : xit;

// IE 6 - 8 have a bug where this returns false.
const canDistinguish = 0 in [void 0];
const undefinedIfNoSparseBug = canDistinguish
  ? void 0
  : {
      valueOf() {
        return 0;
      },
    };

const createArrayLike = function(arr) {
  const o = {};
  arr.forEach(function(e, i) {
    o[i] = e;
  });

  o.length = arr.length;

  return o;
};

describe('some', function() {
  let actual;
  let expected;
  let numberOfRuns;
  let testSubject;

  beforeEach(function() {
    expected = {
      0: 2,
      2: undefinedIfNoSparseBug,
      3: true,
    };

    actual = {};
    numberOfRuns = 0;
    testSubject = [2, 3, undefinedIfNoSparseBug, true, 'hej', null, false, 0];

    delete testSubject[1];
  });

  it('is a function', function() {
    expect(typeof some).toBe('function');
  });

  it('should throw when array is null or undefined', function() {
    expect(function() {
      some();
    }).toThrow();

    expect(function() {
      some(void 0);
    }).toThrow();

    expect(function() {
      some(null);
    }).toThrow();
  });

  it('should pass the correct values along to the callback', function() {
    const callback = jasmine.createSpy('callback');
    const array = ['1'];
    some(array, callback);
    expect(callback).toHaveBeenCalledWith('1', 0, array);
  });

  it('should not affect elements added to the array after it has begun', function() {
    const arr = [1, 2, 3];

    let i = 0;
    some(arr, function(a) {
      i += 1;
      arr.push(a + 3);

      return i > 3;
    });

    expect(arr).toStrictEqual([1, 2, 3, 4, 5, 6]);

    expect(i).toBe(3);
  });

  it('should set the right context when given none', function() {
    let context;
    some([1], function() {
      // eslint-disable-next-line no-invalid-this
      context = this;
    });

    expect(context).toBe(
      function() {
        // eslint-disable-next-line no-invalid-this
        return this;
      }.call(),
    );
  });

  it('should return false if it runs to the end', function() {
    actual = some(testSubject, function() {});
    expect(actual).toBe(false);
  });

  it('should return true if it is stopped somewhere', function() {
    actual = some(testSubject, function() {
      return true;
    });

    expect(actual).toBe(true);
  });

  it('should return false if there are no elements', function() {
    actual = some([], function() {
      return true;
    });

    expect(actual).toBe(false);
  });

  it('should stop after 3 elements', function() {
    some(testSubject, function(obj, index) {
      actual[index] = obj;
      numberOfRuns += 1;

      return numberOfRuns === 3;
    });

    expect(actual).toStrictEqual(expected);
  });

  it('should stop after 3 elements using a context', function() {
    const o = {a: actual};
    some(
      testSubject,
      function(obj, index) {
        // eslint-disable-next-line no-invalid-this
        this.a[index] = obj;
        numberOfRuns += 1;

        return numberOfRuns === 3;
      },
      o,
    );

    expect(actual).toStrictEqual(expected);
  });

  it('should stop after 3 elements in an array-like object', function() {
    const ts = createArrayLike(testSubject);
    some(ts, function(obj, index) {
      actual[index] = obj;
      numberOfRuns += 1;

      return numberOfRuns === 3;
    });

    expect(actual).toStrictEqual(expected);
  });

  it('should stop after 3 elements in an array-like object using a context', function() {
    const ts = createArrayLike(testSubject);
    const o = {a: actual};
    some(
      ts,
      function(obj, index) {
        // eslint-disable-next-line no-invalid-this
        this.a[index] = obj;
        numberOfRuns += 1;

        return numberOfRuns === 3;
      },
      o,
    );

    expect(actual).toStrictEqual(expected);
  });

  it('should have a boxed object as list argument of callback', function() {
    let listArg;
    some('foo', function(item, index, list) {
      listArg = list;
    });

    expect(typeof listArg).toBe('object');
    expect(Object.prototype.toString.call(listArg)).toBe('[object String]');
  });

  it('should work with arguments', function() {
    const argObj = (function() {
      return arguments;
    })('1');

    const callback = jasmine.createSpy('callback');
    some(argObj, callback);
    expect(callback).toHaveBeenCalledWith('1', 0, argObj);
  });

  it('should work with strings', function() {
    const callback = jasmine.createSpy('callback');
    const string = '1';
    some(string, callback);
    expect(callback).toHaveBeenCalledWith('1', 0, string);
  });

  itHasDoc('should work wih DOM elements', function() {
    const fragment = document.createDocumentFragment();
    const div = document.createElement('div');
    fragment.appendChild(div);
    const callback = jasmine.createSpy('callback');
    some(fragment.childNodes, callback);
    expect(callback).toHaveBeenCalledWith(div, 0, fragment.childNodes);
  });
});
