"use strict";

module.exports = {
  foo() {
    return "i am the original foo";
  },

  bar() {
    return this.barNoExport();
  },

  barNoExport() {
    return "i am the original barNoExport";
  },
};
