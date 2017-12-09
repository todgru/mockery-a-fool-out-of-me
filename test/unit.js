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

  t.context.mockMethodBar = "I am MOCKBAR";
  t.context.mockClassFoo = sandbox.stub().returns({
    bar: function() {
      return t.context.mockMethodBar;
    },
  });
  mockery.registerMock("foo-lib", t.context.mockClassFoo);
  t.context.handler = require("../handler");
});

test.afterEach(t => {
  sandbox.restore();
  mockery.disable();
});

test.serial("handler should process first mock correctly", async t => {
  t.context.cb = sandbox.stub();

  await t.context.handler(null, null, t.context.cb);

  t.deepEqual(t.context.cb.args, [["I am MOCKBAR"]]);
});

test.serial("handler should process second mock correctly", async t => {
  t.context.mockMethodBar = "I am another mock";
  const handler = require("../handler");
  t.context.cb = sandbox.stub();

  await handler(null, null, t.context.cb);

  t.deepEqual(t.context.cb.args, [["I am another mock"]]);
});

test.serial("handler should throwing shit at the wall to see what sticks", async t => {
  t.context.mockMethodBar = "I am third mock";
  t.context.handler = require("../handler");

  t.context.handler = require("../handler");
  t.context.cb = sandbox.stub();

  await t.context.handler(null, null, t.context.cb);

  t.deepEqual(t.context.cb.args, [["I am third mock"]]);
});
