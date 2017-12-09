"use strict";

const test = require("ava");
const sinon = require("sinon");
const mockery = require("mockery");
let sandbox;

test.before(t => {
  sandbox = sinon.sandbox.create();
});

test.beforeEach(async t => {
  mockery.enable({
    warnOnReplace: false,
    warnOnUnregistered: false,
    useCleanCache: true,
  });

  t.context.mockFoo = sandbox.stub().returns({
    bar: function() {
      return "I am MOCKBAR";
    },
  });
  mockery.registerMock("./foo", t.context.mockFoo);
  t.context.handler = require("./handler");
});

test.afterEach(t => {
  sandbox.restore();
  mockery.disable();
});

test("handler should process error correctly", async t => {
  t.context.cb = sandbox.stub();

  await t.context.handler(null, null, t.context.cb);

  t.deepEqual(t.context.cb.args, [["I am MOCKBAR"]]);
});
