const { server } = require("./app");
var assert = require("assert");

const port = process.env.PORT || 4000;

server.listen(port, () =>
  console.log(`server is running http://localhost:${port}`)
);

function format(
  number = 0,
  decimals = 2,
  decimalChar = ",",
  thousandsChar = ".",
  roundNumber = true
) {
  if (!number) return "0,00";
  let parsed;
  if (typeof number === "string") parsed = parseFloat(number);
  else parsed = number;

  let rounded = parsed.toFixed(decimals);
  console.log("rounded", rounded);

  let formatted = parseFloat(rounded).toLocaleString("de");
  console.log("formatted", formatted);

  // const thousandRex = new RegExp(`(\\.\\b)`, "g");
  const thousandRex = /[.]/g;
  const thousandPlaceHolderRex = /[t]/g;
  const decimalRex = /[,]/g;
  const decimalPlaceHolderRex = /[d]/g;

  let placeholder = formatted
    .replace(thousandRex, "t")
    .replace(decimalRex, "d");
  console.log("placeholder", placeholder);

  let replaced = placeholder
    .replace(thousandPlaceHolderRex, thousandsChar)
    .replace(decimalPlaceHolderRex, decimalChar);
  console.log("replaced", replaced);

  return replaced;
}

assert.equal("2,56", format(2.555));
assert.equal("0,00", format(undefined));
assert.equal("10.000,556", format(10000.5555, 3));
assert.equal("100.000,28", format(100000.28374, 2, ",", "."));
assert.equal("100,000.6", format(100000.55555, 1, ".", ","));
assert.equal("1,5550000000", format(1.555, 10, ",", "."));
assert.equal("-1,5555", format(-1.55555, 4));
assert.equal("-1,5555", format("-1.55555", 4));
assert.equal("1,555", format(1.55555, 3, ",", ".", false));
assert.equal("1,56", format("1.5555", 2));
