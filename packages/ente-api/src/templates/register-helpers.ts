import * as Handlebars from "handlebars";

Handlebars.registerHelper("ifEqual", function(this: any, arg1, arg2, options) {
  return arg1 === arg2 ? options.fn(this) : options.inverse(this);
});
