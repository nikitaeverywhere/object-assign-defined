import test from "ava";
import equal from "deep-is";
import objectAssignDefined from ".";

const toString = (object) => JSON.stringify(object);

test(`Can handle a single argument`, (it) => {

    const object = { test: 1 };
    const result = objectAssignDefined(object);

    it.is(toString(result), toString(object));

});

test(`Can handle two objects`, (it) => {

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

test(`Can handle 3 objects`, (it) => {

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

test(`Does not skip undefined values in source`, (it) => {

    const object1 = { test: undefined };
    const object2 = { best: 1 };
    const result = objectAssignDefined(object1, object2);

    it.is(equal(result, { test: undefined, best: 1 }), true);

});

const runTestForNObjects = (it, objects = 250) => {

    const randomProps = ["duck", "best", "text", "fest"];

    const args = [
        { test: null, best: 2 },
        { test: 2, rest: 3 }
    ];
    for (let i = 0; i < objects - 5; ++i) args.push({
        [ randomProps[Math.floor(Math.random() * randomProps.length)] ]: Math.random()
    });
    args.push(
        { rest: 5, fest: 4, duck: undefined },
        { rest: [1, 2, 3], fest: null, test: 10 },
        { text: "undefined", best: -Infinity, duck: NaN, test: undefined }
    );

    const result = objectAssignDefined.apply(this, args);

    it.is(equal(result, {
        test: 10,
        best: -Infinity,
        rest: [1, 2, 3],
        fest: null,
        text: "undefined",
        duck: NaN
    }), true);

};

test(`Can handle 250 objects`, (it) => runTestForNObjects(it, 250));

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

test(`Can handle 100000 objects`, (it) => runTestForNObjects(it, 100000));
