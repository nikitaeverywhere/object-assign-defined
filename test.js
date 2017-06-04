import test from "ava";
import equal from "deep-is";
import objectAssignDefined from "./index.js";

const toString = (object) => JSON.stringify(object);

test(`Works with single argument`, (it) => {

    const object = { test: 1 };
    const result = objectAssignDefined(object);

    it.is(toString(result), toString(object));

});

test(`Works with two arguments`, (it) => {

    const object1 = { test: 1 };
    const object2 = { test: 2 };
    const result = objectAssignDefined(object1, object2);

    it.is(toString(result), toString(object2));

});

test(`Results with the same object reference`, (it) => {

    const object1 = { test: 1 };
    const object2 = { test: 2 };
    const result = objectAssignDefined(object1, object2);

    it.is(result, object1);

});

test(`Correctly assigns properties and keeps the same object reference`, (it) => {

    const object1 = { test: 1, best: 2 };
    const object2 = { test: 2, rest: 3 };
    const result = objectAssignDefined(object1, object2);

    it.is(result, object1);
    it.is(equal(result, {
        test: 2,
        best: 2,
        rest: 3
    }), true);

});

test(`Works with 3 objects`, (it) => {

    const object1 = { test: 1, best: 2 };
    const object2 = { test: 2, rest: 3 };
    const object3 = { rest: 5, fest: 4 };
    const result = objectAssignDefined(object1, object2, object3);

    it.is(equal(result, {
        test: 2,
        best: 2,
        rest: 5,
        fest: 4
    }), true);

});

test(`Keeps deep references unchanged`, (it) => {

    const ref1 = {};
    const ref2 = { ref1: ref1 };
    const object1 = { test: 1, best: 2 };
    const object2 = { rest: 3, test: ref2 };
    const object3 = { rest: 5, fest: 4 };
    const result = objectAssignDefined(object1, object2, object3);

    it.is(equal(result, {
        test: ref2,
        best: 2,
        rest: 5,
        fest: 4
    }), true);
    it.is(result[`test`][`ref1`], ref1);

});

test(`Works with arrays`, (it) => {

    const arr1 = [1];
    const arr2 = [2, 3, 4];
    const arr3 = [5];
    const result = objectAssignDefined(arr1, arr2, arr3);

    it.is(equal(result, [5, 3, 4]), true);

});

test(`Keeps nested arrays unchanged`, (it) => {

    const arr = [2, 3];
    const arr1 = [1];
    const arr2 = [2, 3, 4];
    const arr3 = [arr];
    const result = objectAssignDefined(arr1, arr2, arr3);

    it.is(equal(result, [arr, 3, 4]), true);
    it.is(result[0], arr);
    it.is(result[0].length, 2);

});

test(`Really skips undefined values`, (it) => {

    const object1 = { test: 1 };
    const object2 = { test: undefined };
    const result = objectAssignDefined(object1, object2);

    it.is(equal(result, { test: 1 }), true);

});

test(`Must not skip undefined values in source`, (it) => {

    const object1 = { test: undefined };
    const object2 = { best: 1 };
    const result = objectAssignDefined(object1, object2);

    it.is(equal(result, { test: undefined, best: 1 }), true);

});

test(`Works with 250 objects`, (it) => {

    const objects = 250;
    const randomProps = ["duck", "best", "text", "fest"];
    const object1 = { test: null, best: 2 };
    const object2 = { test: 2, rest: 3 };
    const object3 = { rest: 5, fest: 4, duck: undefined };
    const object4 = { rest: [1, 2, 3], fest: null, test: 10 };
    const object5 = { text: "undefined", best: -Infinity, duck: NaN, test: undefined };
    const rest = Array.from({ length: objects }, (e, i) =>
        ({ [ randomProps[Math.floor(Math.random() * randomProps.length)] ]: Math.random() })
    );
    const result = objectAssignDefined(object1, object2, ...rest, object3, object4, object5);

    it.is(equal(result, {
        test: 10,
        best: -Infinity,
        rest: [1, 2, 3],
        fest: null,
        text: "undefined",
        duck: NaN
    }), true);

});

test(`Does not fail on or copy null objects`, (it) => {

    const object1 = { test: 1 };
    const object2 = null;
    const result = objectAssignDefined(object1, object2);

    it.is(equal(result, { test: 1 }), true);

});

test(`Does not copy non-enumerable properties`, (it) => {

    const object1 = { test: 1 };
    const object2 = new Date();
    const result = objectAssignDefined(object1, object2);

    it.is(equal(result, { test: 1 }), true);

});

test(`Does not call or change functions`, (it) => {

    const f = () => 5;
    const object1 = { test: 1 };
    const object2 = { test: f };
    const result = objectAssignDefined(object1, object2);

    it.is(equal(result, { test: f }), true);
    it.is(result[`test`](), 5);

});
