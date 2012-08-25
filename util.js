function each(array, action) {
  for (var i = 0; i < array.length; i++) {
    action(array[i]);
  }
}

function map(array, action) {
  var result = []
  each(array, function(n) {
    result.push(action(n));
  });
  return result
}

function indexOf(array, test) {
  for (var i = 0; i < array.length; i++) {
    var t = test(array[i]);
    if (t) {
      return i;
    }
  }
  return -1;
}

function find(array, test) {
  for (var i = 0; i < array.length; i++) {
    var t = test(array[i]);
    if (t) {
      return array[i];
    }
  }
}

function arrayHas(array, test) {
  return(find(array, test) != undefined);
}

function randomNumber(options) {
  return(Math.floor(Math.random() * options));
}

function registerEventHandler(node, event, handler) {
  if (typeof node.addEventListener == "function") {
    node.addEventListener(event, handler, false);
  } else {
    node.attachEvent("on" + event, handler);
  }
}
