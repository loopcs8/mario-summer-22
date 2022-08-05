import kaboom from "./kaboom.js";

kaboom({
  background: [153, 255, 255],
  scale: 2,
});

loadRoot("./sprites/");

loadSprite("block", "block.png");
loadSprite("evil", "evil_mushroom.png");
loadSprite("mario", "mario.png");
loadSprite("surprise", "surprise.png");
loadSprite("loop", "loop.png");
loadSprite("coin", "coin.png");
loadSprite("unboxed", "unboxed.png");
loadSprite("mushroom", "mushroom.png");
loadSprite("pipe", "pipe_up.png"),

  loadSound("jumpSound", "jumpSound.mp3");
loadSound("gameSound", "gameSound.mp3");


scene("win", () => {
  add([
    text("you won the game"),
    scale(0.6),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);
});

scene("lose", () => {
  add([
    text("game over ):"),
    scale(0.6),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);

  onKeyDown("space", () => {
    go("game")
  });

});


scene("game", () => {
  play("gameSound");
  layers(["bg", "obj", "ui"], "obj");

  const map = [
    "  lllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll",
    "                                                                                                       ",
    "                                                                                                   ",
    "                                                                                                ",
    "                                                                                                   ",
    "                                                                                                ",
    "                                                                                                                        ",
    "                                                                                                            ",
    "                                                                                                                ",
    "                                             =                                                           ",
    "                                 ?  =     =     =                                                              ",
    "                          ==          =           =   ?==   ==                     =                                  ",
    "                             =                            =                                  !                      ",
    "      ?=!                  =  =   ?           =      ==           =             ?                                        ",
    "                  ==    !        =    =           =?=                  =             ?                                  ",
    "    =                                                                  =                =   =             =            ",
    "                   &                                                  &       =                                &  p         ",
    "==============================================================================  =  ===============================                ",
  ]

  const mapSymbols = {
    width: 20,
    height: 20,

    "=": () => [sprite("block"), solid(), area(), "block"],
    "?": () => [sprite("surprise"), solid(), area(), "surprise-coin"],
    "!": () => [sprite("surprise"), solid(), area(), "surprise-mushroom"],
    "$": () => [sprite("coin"), solid(), area(), "coin"],
    "&": () => [sprite("evil"), body(), solid(), area(), "evil"],
    "m": () => [sprite("mushroom"), body(), area(), "mushroom"],
    "u": () => [sprite("unboxed"), solid(), area(), "unboxed"],
    "l": () => [sprite("loop"), solid(), area(), "loop"],
    "p": () => [sprite("pipe"), solid(), area(), "pipe"],

  };

  const gameLevel = addLevel(map, mapSymbols);

  const player = add([
    sprite("mario"),
    solid(),
    area(),
    origin("bot"),
    body(),
    pos(30, 0),
    big(),
  ]);

  let score = 0
  const scoreLabel = add([
    text("Score : " + score), scale(0.4)
  ])

  const speed = 135;
  const jump = 450;

  onKeyDown("right", () => {
    player.move(speed, 0);
  });

  onKeyDown("left", () => {
    player.move(-speed, 0);
  });

  onKeyDown("up", () => {
    if (player.isGrounded()) {
      player.jump(jump);
      play("jumpSound");
    }
  });

  player.onUpdate(() => {
    camPos(player.pos);
    if (player.pos.y > 700) {
      go("lose")
    }
    scoreLabel.pos = player.pos.sub(400, 200);
    scoreLabel.text = "Score: " + score;

  });

  //coin
  player.onHeadbutt((obj) => {
    if (obj.is("surprise-coin")) {
      destroy(obj);
      gameLevel.spawn("u", obj.gridPos);
      gameLevel.spawn("$", obj.gridPos.sub(0, 1));
    }
  })
  //mushroom
  player.onHeadbutt((obj) => {
    if (obj.is("surprise-mushroom")) {
      destroy(obj);
      gameLevel.spawn("u", obj.gridPos);
      gameLevel.spawn("m", obj.gridPos.sub(0, 1));
    }
  })

  player.onCollide("coin", (obj) => {
    destroy(obj)
    score += 40;
  });

  player.onCollide("mushroom", (obj) => {
    destroy(obj)
    player.biggify(2);
  });

  player.onCollide("pipe", (obj) => {
    onKeyDown("down", () => {
      go("win")
    })
  })

  onUpdate("mushroom", (obj) => {
    obj.move(35, 0);
  });

  onUpdate("evil", (obj) => {
    obj.move(-40, 0);
  });

  let isGrounded = false;
  player.onCollide("evil", (obj) => {
    if (isGrounded == true) {
      go("lose")
    } else {
      destroy(obj);
    }
  })

  player.onUpdate(() => {
    isGrounded = player.isGrounded();

  });

});

go("game");
