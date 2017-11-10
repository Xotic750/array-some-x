<a href="https://travis-ci.org/Xotic750/array-some-x"
   title="Travis status">
<img
   src="https://travis-ci.org/Xotic750/array-some-x.svg?branch=master"
   alt="Travis status" height="18"/>
</a>
<a href="https://david-dm.org/Xotic750/array-some-x"
   title="Dependency status">
<img src="https://david-dm.org/Xotic750/array-some-x.svg"
   alt="Dependency status" height="18"/>
</a>
<a href="https://david-dm.org/Xotic750/array-some-x#info=devDependencies"
   title="devDependency status">
<img src="https://david-dm.org/Xotic750/array-some-x/dev-status.svg"
   alt="devDependency status" height="18"/>
</a>
<a href="https://badge.fury.io/js/array-some-x" title="npm version">
<img src="https://badge.fury.io/js/array-some-x.svg"
   alt="npm version" height="18"/>
</a>
<a name="module_array-some-x"></a>

## array-some-x
Tests whether some element passes the provided function.

**Version**: 2.5.0  
**Author**: Xotic750 <Xotic750@gmail.com>  
**License**: [MIT](&lt;https://opensource.org/licenses/MIT&gt;)  
**Copyright**: Xotic750  
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


| Param | Type | Description |
| --- | --- | --- |
| array | <code>array</code> | The array to iterate over. |
| callBack | <code>function</code> | Function to test for each element. |
| [thisArg] | <code>\*</code> | Value to use as this when executing callback. |

**Example**  
```js
var some = require('array-some-x');

function isBiggerThan10(element, index, array) {
  return element > 10;
}

some([2, 5, 8, 1, 4], isBiggerThan10);  // false
some([12, 5, 8, 1, 4], isBiggerThan10); // true
```
