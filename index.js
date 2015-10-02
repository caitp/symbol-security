(function() { "use strict";

// --- SETUP ---
var console = document.querySelector("pre.console");

function log(...values) {
  console.textContent += values.join(" ") + "\n\n";
}

var remote = document.createElement("iframe");
remote.onload = run_test;
remote.src = "http://ecma-international.org/ecma-262/6.0/";
remote.style.display = "none";
document.body.appendChild(remote);

// --- TEST ---
function run_test() {
  Object.getOwnPropertyNames(Symbol).
      filter(name => typeof Symbol[name] === "symbol").
      forEach((symbolName, i) => {
    var symbol = Symbol[symbolName];
    var value;
    var win = remote.contentWindow;

    symbolName = "@@" + symbolName;

    log(++i + ": Symbol " + symbolName);

    // [[Get]]
    try {
      value = win[symbol];
      log("  [[Get]]: Did not throw, returned " + value);
    } catch (e) {
      log("  [[Get]]: Threw " + e);
    }

    // [[Set]]
    try {
      win[symbol] = "fake-value";
      log("  [[Set]]: Did not throw");
    } catch (e) {
      log("  [[Set]]: Threw " + e);
    }

    // [[HasProperty]]
    try {
      if (symbol in win) {
        log("  [[HasProperty]]: Did not throw, returned true");
      } else {
        log("  [[HasProperty]]: Did not throw, returned false");
      }
    } catch (e) {
      log("  [[HasProperty]]: Threw " + e);
    }

    // [[GetPrototypeOf]]
    try {
      value = Object.getPrototypeOf(win[symbol]);
      log("  [[GetPrototypeOf]]: Did not throw, returned " + value);
    } catch (e) {
      log("  [[GetPrototypeOf]]: Threw " + e);
    }

    // [[SetPrototypeOf]]
    try {
      value = Object.setPrototypeOf(win[symbol], null);
      log("  [[SetPrototypeOf]]: Did not throw, returned " + value);
    } catch (e) {
      log("  [[SetPrototypeOf]]: Threw " + e);
    }

    // [[IsExtensible]]
    try {
      value = Object.isExtensible(win[symbol]);
      log("  [[IsExtensible]]: Did not throw, returned " + value);
    } catch (e) {
      log("  [[IsExtensible]]: Threw " + e);
    }

    // [[PreventExtensions]]
    try {
      value = Object.preventExtensions(win[symbol]);
      log("  [[PreventExtensions]]: Did not throw, returned " + value);
    } catch (e) {
      log("  [[PreventExtensions]]: Threw " + e);
    }

    // [[GetOwnProperty]]
    try {
      value = Object.getOwnProperty(win, symbol);
      log("  [[GetOwnProperty]]: Did not throw, returned " + value);
    } catch (e) {
      log("  [[GetOwnProperty]]: Threw " + e);
    }

    // [[Delete]]
    try {
      value = delete win[symbol];
      log("  [[Delete]]: Did not throw, returned " + value);
    } catch (e) {
      log("  [[Delete]]: Threw " + e);
    }

    // [[DefineOwnProperty]]
    try {
      value = Object.defineProperty(win, symbol, { value: "fake-value" });
      log("  [[DefineOwnProperty]]: Did not throw, returned " + value);
    } catch (e) {
      log("  [[DefineOwnProperty]]: Threw " + e);
    }

    // [[Enumerate]]
    // Testing [[Enumerate]] is probably meaningless for WKS

    // [[OwnPropertyKeys]]
    try {
      value = Object.getOwnPropertySymbols(win);
      if (value.indexOf(symbol) >= 0) {
        log("  [[OwnPropertyKeys]]: Included " + symbolName);
      } else {
        log("  [[OwnPropertyKeys]]: Did not include " + symbolName);
      }
    } catch (e) {
      log("  [[OwnPropertyKeys]]: Threw " + e);
    }

    // Internal use:
    switch (symbolName) {
      case "@@toStringTag":
        tryInternal("Object.prototype.toString.call(win)");
        break;
      case "@@iterator":
        tryInternal("[...win]");
        break;
      default:
        log("  TODO: Add internal use for " + symbolName);
        break;
    }

    function tryInternal(expr) {
      var result;
      try {
        result = eval(expr);
        log("  `" + expr + "`: Did not throw, returned " + result);
      } catch (e) {
        log("  `" + expr + "`: Threw " + e);
      }
    }
  });
}

})();
