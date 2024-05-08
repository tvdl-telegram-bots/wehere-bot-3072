// https://core.telegram.org/bots/api#formatting-options

import { escape } from "html-escaper";

const html = {
  b: (text: string) => "<b>" + text + "</b>",
  code: (text: string) => "<code>" + text + "</code>",
  em: (text: string) => "<em>" + text + "</em>",
  i: (text: string) => "<i>" + text + "</i>",
  ins: (text: string) => "<ins>" + text + "</ins>",
  pre: (text: string) => "<pre>" + text + "</pre>",
  s: (text: string) => "<s>" + text + "</s>",
  strong: (text: string) => "<strong>" + text + "</strong>",
  u: (text: string) => "<u>" + text + "</u>",
  literal: (value: string | number | boolean | null) => escape(`${value}`),
};

export default html;
