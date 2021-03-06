import $some, {implementation} from '../src/array-some-x';

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

[implementation, $some].forEach((some, testNum) => {
  describe(`some ${testNum}`, function() {
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
      expect.assertions(1);
      expect(typeof some).toBe('function');
    });

    it('should throw when array is null or undefined', function() {
      expect.assertions(3);
      expect(function() {
        some();
      }).toThrowErrorMatchingSnapshot();

      expect(function() {
        some(void 0);
      }).toThrowErrorMatchingSnapshot();

      expect(function() {
        some(null);
      }).toThrowErrorMatchingSnapshot();
    });

    it('should pass the correct values along to the callback', function() {
      expect.assertions(1);
      const callback = jest.fn();
      const array = ['1'];
      some(array, callback);
      expect(callback).toHaveBeenCalledWith('1', 0, array);
    });

    it('should not affect elements added to the array after it has begun', function() {
      expect.assertions(2);
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
      expect.assertions(1);
      let context = void 0;
      some([1], function() {
        /* eslint-disable-next-line babel/no-invalid-this */
        context = this;
      });

      expect(context).toBe(
        function() {
          /* eslint-disable-next-line babel/no-invalid-this */
          return this;
        }.call(),
      );
    });

    it('should return false if it runs to the end', function() {
      expect.assertions(1);
      actual = some(testSubject, function() {});
      expect(actual).toBe(false);
    });

    it('should return true if it is stopped somewhere', function() {
      expect.assertions(1);
      actual = some(testSubject, function() {
        return true;
      });

      expect(actual).toBe(true);
    });

    it('should return false if there are no elements', function() {
      expect.assertions(1);
      actual = some([], function() {
        return true;
      });

      expect(actual).toBe(false);
    });

    it('should stop after 3 elements', function() {
      expect.assertions(1);
      some(testSubject, function(obj, index) {
        actual[index] = obj;
        numberOfRuns += 1;

        return numberOfRuns === 3;
      });

      expect(actual).toStrictEqual(expected);
    });

    it('should stop after 3 elements using a context', function() {
      expect.assertions(1);
      const o = {a: actual};
      some(
        testSubject,
        function(obj, index) {
          /* eslint-disable-next-line babel/no-invalid-this */
          this.a[index] = obj;
          numberOfRuns += 1;

          return numberOfRuns === 3;
        },
        o,
      );

      expect(actual).toStrictEqual(expected);
    });

    it('should stop after 3 elements in an array-like object', function() {
      expect.assertions(1);
      const ts = createArrayLike(testSubject);
      some(ts, function(obj, index) {
        actual[index] = obj;
        numberOfRuns += 1;

        return numberOfRuns === 3;
      });

      expect(actual).toStrictEqual(expected);
    });

    it('should stop after 3 elements in an array-like object using a context', function() {
      expect.assertions(1);
      const ts = createArrayLike(testSubject);
      const o = {a: actual};
      some(
        ts,
        function(obj, index) {
          /* eslint-disable-next-line babel/no-invalid-this */
          this.a[index] = obj;
          numberOfRuns += 1;

          return numberOfRuns === 3;
        },
        o,
      );

      expect(actual).toStrictEqual(expected);
    });

    it('should have a boxed object as list argument of callback', function() {
      expect.assertions(2);
      let listArg = void 0;
      some('foo', function(item, index, list) {
        listArg = list;
      });

      expect(typeof listArg).toBe('object');
      expect(Object.prototype.toString.call(listArg)).toBe('[object String]');
    });

    it('should work with arguments', function() {
      expect.assertions(1);
      const argObj = (function() {
        return arguments;
      })('1');

      const callback = jest.fn();
      some(argObj, callback);
      expect(callback).toHaveBeenCalledWith('1', 0, argObj);
    });

    it('should work with strings', function() {
      expect.assertions(1);
      const callback = jest.fn();
      const string = '1';
      some(string, callback);
      expect(callback).toHaveBeenCalledWith('1', 0, Object(string));
    });

    itHasDoc('should work wih DOM elements', function() {
      const fragment = document.createDocumentFragment();
      const div = document.createElement('div');
      fragment.appendChild(div);
      const callback = jest.fn();
      some(fragment.childNodes, callback);
      expect(callback).toHaveBeenCalledWith(div, 0, fragment.childNodes);
    });
  });
});
