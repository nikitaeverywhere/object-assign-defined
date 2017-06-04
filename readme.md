# [object-assign-defined](https://www.npmjs.com/package/object-assign-defined)

[![npm](https://img.shields.io/npm/v/object-assign-defined.svg)](https://www.npmjs.com/package/object-assign-defined)
[![License](https://img.shields.io/github/license/zitros/object-assign-defined.svg)](LICENSE)

A tiny, fast and well-tested JavaScript module that works just like `Object.assign`, but skips 
assigning `undefined` values.

Usage
-----

Import the module and use it like this:

```javascript
import objectAssignDefined from "object-assign-defined";
import equals from "deep-is"; // this module deeply compares if two objects match

const result = objectAssignDefined({
    "I": 1
}, {
    "LIKE": 2
}, {
    "TRAINS": undefined
});

console.log(
    equals(result, { "I": 1, "LIKE": 2 }) === true
); // outputs "true"
```

Note that `undefined` values in source (first argument) won't be vanished:

```javascript
import objectAssignDefined from "object-assign-defined";
import equals from "deep-is";

const result = objectAssignDefined({
    "I": undefined
}, {
    "LIKE": undefined
}, {
    "TRAINS": undefined
});

console.log(
    equals(result, { "I": undefined }) === true
); // outputs "true"
```

But you can simply remove them by making assigning properties to an empty object, like this:

```javascript
import objectAssignDefined from "object-assign-defined";
import equals from "deep-is";

const result = objectAssignDefined({}, { "I": undefined });

console.log(
    equals(result, {}) === true
); // outputs "true"
```

Licence
-------

[MIT](LICENSE) (c) Nikita Savchenko