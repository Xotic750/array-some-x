<a
  href="https://travis-ci.org/Xotic750/array-some-x"
  title="Travis status">
<img
  src="https://travis-ci.org/Xotic750/array-some-x.svg?branch=master"
  alt="Travis status" height="18">
</a>
<a
  href="https://david-dm.org/Xotic750/array-some-x"
  title="Dependency status">
<img src="https://david-dm.org/Xotic750/array-some-x/status.svg"
  alt="Dependency status" height="18"/>
</a>
<a
  href="https://david-dm.org/Xotic750/array-some-x?type=dev"
  title="devDependency status">
<img src="https://david-dm.org/Xotic750/array-some-x/dev-status.svg"
  alt="devDependency status" height="18"/>
</a>
<a
  href="https://badge.fury.io/js/array-some-x"
  title="npm version">
<img src="https://badge.fury.io/js/array-some-x.svg"
  alt="npm version" height="18">
</a>
<a
  href="https://www.jsdelivr.com/package/npm/array-some-x"
  title="jsDelivr hits">
<img src="https://data.jsdelivr.com/v1/package/npm/array-some-x/badge?style=rounded"
  alt="jsDelivr hits" height="18">
</a>
<a
  href="https://bettercodehub.com/results/Xotic750/array-some-x"
  title="bettercodehub score">
<img src="https://bettercodehub.com/edge/badge/Xotic750/array-some-x?branch=master"
  alt="bettercodehub score" height="18">
</a>

<a name="module_array-some-x"></a>

## array-some-x

Tests whether some element passes the provided function.

<a name="exp_module_array-some-x--module.exports"></a>

### `module.exports` ⇒ <code>boolean</code> ⏏

This method tests whether some element in the array passes the test
implemented by the provided function.

**Kind**: Exported member  
**Returns**: <code>boolean</code> - `true` if the callback function returns a truthy value for
any array element; otherwise, `false`.  
**Throws**:

- <code>TypeError</code> If array is null or undefined.
- <code>TypeError</code> If callBack is not a function.

| Param     | Type                  | Description                                   |
| --------- | --------------------- | --------------------------------------------- |
| array     | <code>array</code>    | The array to iterate over.                    |
| callBack  | <code>function</code> | Function to test for each element.            |
| [thisArg] | <code>\*</code>       | Value to use as this when executing callback. |

**Example**

```js
import some from 'array-some-x';

function isBiggerThan10(element, index, array) {
  return element > 10;
}

console.log(some([2, 5, 8, 1, 4], isBiggerThan10)); // false
console.log(some([12, 5, 8, 1, 4], isBiggerThan10)); // true
```
