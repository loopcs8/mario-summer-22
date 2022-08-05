import kaboom from "./kaboom.js";
kaboom({
  background: [3, 252, 148],
  scale: 2,
});

loadRoot("./sprites/");

loadSprite("surprise", "surprise.png");
loadSprite("mario", "mario.png");
loadSprite("mush", "mushroom.png");
loadSprite("block", "block.png");
loadSprite("coin", "coin.png");
loadSprite("star", "star.png");
loadSprite("pipe", "pipe_up.png");
loadSprite("unboxed", "unboxed.png");
loadSprite("evilmush", "evil_mushroom.png");
loadSound("jumpsound", "jumpSound.mp3");
loadSound("gamesound", "gameSound.mp3");

loadSprite("pipe", "pipe_up.png");

scene("lose", () => {
  add([
    text("bye bye"),
    scale(0.5),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);
});

scene("win", () => {
  add([
    text("you won woooo hoooo"),
    scale(0.5),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);
});

scene("game", () => {
  layers(["bg", "obj", "ui"], "obj");
  play("gamesound");
  const map = [
    "                                                                                                                                                   ",
    "                                                                                                                                                   ",
    "                                                                                                                                                   ",
    "                                                                                                                                                   ",
    "                                                                                                                                                   ",
    "                                                                                                                                                   ",
    "                                                                                                                                                   ",
    "                                                                                                                                                   ",
    "                                                                                                                                                   ",
    "                                                                                                                                                   ",
    "                                                                                                                                                   ",
    "                                                                                                                                                   ",
    "                                                                                                                                  p                ",
    "                                                                                                                                                   ",
    "                                                                                                       ====================   ======               ",
    "                ?=?=!                                                                                 =                                            ",
    "                                                                                                 =   =                                             ",
    "                                                                                                                                                   ",
    "                                                                                             =                                                    ",
    "                                                                                                   =                                                 ",
    "                e                          ?                                               =                                                    ",
    "               ==   ==                                       !                                                                                     ",
    "              =       =                                                                              =                                                 ",
    "             =         =                 ==                                                   =                                                    ",
    "            =           =                              ?   =?=?=          =    =       =                                                       ",
    "           =             =           ==                                  ==    ==                  =                                                     ",
    "          =               =        ==                      e e e e e e  ===    ===          =                                                      ",
    "===========               =====  ==          ==============================    =============                                                       ",
  ];

  const mapSymbols = {
    width: 20,
    height: 20,
    "?": () => [sprite("surprise"), solid(), area(), "surprise-coin"],
    "!": () => [sprite("surprise"), solid(), area(), "surprise-mush"],
    $: () => [sprite("coin"), area(), "coin"],
    m: () => [sprite("mush"), area(), body(), "mush"],
    "=": () => [sprite("block"), solid(), area(), "block"],
    u: () => [sprite("unboxed"), solid(), area(), "unboxed"],
    e: () => [sprite("evilmush"), area(), body(), "evilmush"],
    p: () => [sprite("pipe"), area(), solid(), "pipe"],
  };
  const gameLevel = addLevel(map, mapSymbols);
  const player = add([
    sprite("mario"),
    solid(),
    area(),
    origin("bot"),
    body(),
    pos(20, 0),
    big(),
  ]);

  let score = 0;
  const scoreLabel = add([text("Score :" + score), scale(0.4)]);

  const speed = 180;

  onKeyDown("d", () => {
    player.move(speed, 0);
  });

  onKeyDown("a", () => {
    player.move(-speed, 0);
  });

  onKeyPress("space", () => {
    if (player.isGrounded()) {
      player.jump();
      play("jumpsound");
    }
  });

  player.onUpdate(() => {
    camPos(player.pos);
    if (player.pos.y > 1000) {
      go("lose");
    }
    scoreLabel.pos = player.pos.sub(400, 200);
    scoreLabel.text = "score: " + score;
  });

  player.onHeadbutt((obj) => {
    if (obj.is("surprise-coin")) {
      destroy(obj);
      gameLevel.spawn("u", obj.gridPos);
      gameLevel.spawn("$", obj.gridPos.sub(0, 1));
    }

    if (obj.is("surprise-mush")) {
      destroy(obj);
      gameLevel.spawn("u", obj.gridPos);
      gameLevel.spawn("m", obj.gridPos.sub(0, 1));
    }
  });

  player.onCollide("coin", (obj) => {
    destroy(obj);
    score += 10;
  });

  player.onCollide("mush", (obj) => {
    destroy(obj);

    player.biggify(4);
  });

  player.onCollide("pipe", (obj) => {
    onKeyDown("s", () => {
      go("win");
    });
  });

  onUpdate("mush", (obj) => {
    obj.move(20, 0);
  });

  onUpdate("evilmush", (obj) => {
    obj.move(-20, 0);
  });

  let isGrounded = false;
  player.onCollide("evilmush", (obj) => {
    if (isGrounded == true) {
      go("lose");
    } else {
      destroy(obj);
      score += 10;
    }
  });

  player.onUpdate(() => {
    isGrounded = player.isGrounded();
  });
}); //this is the end of the scene

go("game");
