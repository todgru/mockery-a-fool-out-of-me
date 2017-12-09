"use strict";
const Foo = require("./Foo");

function handler(e, c, cb) {
  const foo = new Foo();
  const res = foo.bar();
  cb(res);
}
module.exports = handler;
