slate.config("menuBarIconHidden", true);

var pushRight = slate.operation("push", {
  "direction": "right",
  "style": "bar-resize:screenSizeX/2"
});

var pushLeft = slate.operation("push", {
  "direction": "left",
  "style": "bar-resize:screenSizeX/2"
});

var pushTop = slate.operation("push", {
  "direction": "top",
  "style": "bar-resize:screenSizeY/2"
});

var pushBottom = slate.operation("push", {
  "direction": "bottom",
  "style": "bar-resize:screenSizeY/2"
});

var throwNextLeft = slate.operation("throw", {
  "width": "screenSizeX/2",
  "height": "screenSizeY",
  "screen": "next"
});

var throwNextRight = slate.operation("throw", {
  "x": "screenOriginX+(screenSizeX)/2",
  "y": "screenOriginY",
  "width": "screenSizeX/2",
  "height": "screenSizeY",
  "screen": "next"
});

var fullscreen = slate.operation("move", {
  "x" : "screenOriginX",
  "y" : "screenOriginY",
  "width" : "screenSizeX",
  "height" : "screenSizeY"
});

var throwNextFullscreen = slate.operation("throw", {
  "x": "screenOriginX",
  "y": "screenOriginY",
  "width": "screenSizeX",
  "height": "screenSizeY",
  "screen": "next"
});

var throwNext = function(win) {
  if (!win) {
    return;
  }
  var winRect = win.rect();
  var screen = win.screen().visibleRect();

  var newX = (winRect.x - screen.x)/screen.width+"*screenSizeX+screenOriginX";
  var newY = (winRect.y - screen.y)/screen.height+"*screenSizeY+screenOriginY";
  var newWidth = winRect.width/screen.width+"*screenSizeX";
  var newHeight = winRect.height/screen.height+"*screenSizeY";
  var throwNext = slate.operation("throw", {
    "x": newX,
    "y": newY,
    "width": newWidth,
    "height": newHeight,
    "screen": "next"
  });
  win.doOperation(throwNext);
};

var pushedLeft = function(win) {
  if (!win) {
    return false;
  }
  var winRect = win.rect();
  var screen = win.screen().visibleRect();

  if (winRect.x === screen.x &&
      winRect.y === screen.y &&
      winRect.width === screen.width/2 &&
      winRect.height === screen.height
    ) {
    return true;
  }
  return false;
};

var pushedRight = function(win) {
  if (!win) {
    return false;
  }
  var winRect = win.rect();
  var screen = win.screen().visibleRect();

  if (winRect.x === screen.x + screen.width/2 &&
      winRect.y === screen.y &&
      winRect.width === screen.width/2 &&
      winRect.height === screen.height
    ) {
    return true;
  }
  return false;
};

var isFullscreen = function(win) {
  if (!win) {
    return false;
  }
  var winRect = win.rect();
  var screen = win.screen().visibleRect();
  if (winRect.width === screen.width &&
      winRect.height === screen.height
    ) {
    return true;
  }
  return false;
};


slate.bind("home:ctrl", function(win) {
  if (!win) {
    return;
  }
  if (pushedLeft(win)) {
    win.doOperation(throwNextLeft);
  } else {
    win.doOperation(pushLeft);
  }
});

slate.bind("end:ctrl", function(win) {
  if (!win) {
    return;
  }

  if (pushedRight(win)) {
    win.doOperation(throwNextRight);
  } else {
    win.doOperation(pushRight);
  }
});

slate.bind("pageUp:ctrl", function(win) {
  if (!win) {
    return;
  }

  if (isFullscreen(win)) {
    win.doOperation(throwNextFullscreen);
  } else {
    win.doOperation(fullscreen);
  }
});

slate.bind("pageDown:ctrl", function(win) {
  if (!win) {
    return;
  }

  if (pushedLeft(win)) {
    win.doOperation(throwNextLeft);
  } else if (pushedRight(win)) {
    win.doOperation(throwNextRight);
  } else if (isFullscreen(win)) {
    win.doOperation(throwNextFullscreen);
  } else {
    throwNext(win);
  }
});

slate.bind("right:ctrl,alt", function(win) {
  if (!win) {
    return;
  }

  win.doOperation(slate.operation("resize", {
    "width" : "+10%",
    "height" : "+0"
  }));
});

slate.bind("left:ctrl,alt", function(win) {
  if (!win) {
    return;
  }

  win.doOperation(slate.operation("resize", {
    "width" : "-10%",
    "height" : "+0"
  }));
});

slate.bind("up:ctrl,alt", function(win) {
  if (!win) {
    return;
  }
  win.doOperation(pushTop);
});

slate.bind("down:ctrl,alt", function(win) {
  if (!win) {
    return;
  }
  win.doOperation(pushBottom);
});

slate.bind("1:ctrl", slate.operation("hint", {
  "characters" : "QWERTYUIOP"
}));
