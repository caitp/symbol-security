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
