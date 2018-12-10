"use strict";

const test = require("ava");
const sinon = require("sinon");
let sandbox;

test.before(t => {
  sandbox = sinon.createSandbox();
});

test.beforeEach(async t => {
  t.context.handler = requireUncached("./handler");
});

test.afterEach(t => {
  sandbox.restore();
});

function requireUncached(module) {
  delete require.cache[require.resolve(module)];
  return require(module);
}

test("mock foo returns original result", t => {
  t.is(t.context.handler.foo(), "i am the original foo");
});

test("mock foo returns mock result", t => {
  t.context.handler.foo = sinon.stub().returns("imma mock");
  t.is(t.context.handler.foo(), "imma mock");
});

test("mock foo returns original result AGAIN", t => {
  // Notice, w/o the requireUncached method, this will return the previous
  // mocked value
  t.is(t.context.handler.foo(), "i am the original foo");
});

// Mocking internally called methods
test("mock bar returns original result", t => {
  t.is(t.context.handler.bar(), "i am the original barNoExport");
});

test("mock bar returns mock result", t => {
  t.context.handler.bar = sinon.stub().returns("imma mock");
  t.is(t.context.handler.bar(), "imma mock");
});

test("mock barNoExport returns mock", t => {
  t.context.handler.barNoExport = sandbox.stub().returns("imma another mock");
  t.is(t.context.handler.barNoExport(), "imma another mock");
});

test("mock bar returns mock barNoExport Stub", t => {
  t.context.handler.barNoExport = sandbox.stub().returns("imma stub");
  t.is(t.context.handler.bar(), "imma stub");
});
