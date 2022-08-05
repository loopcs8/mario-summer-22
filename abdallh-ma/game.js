import kaboom from "./kaboom.js";

kaboom({
  background: [105, 200, 223],
  scale: 2,
});
loadRoot("./sprites/");

loadSprite("block", "block.png");
loadSprite("mario", "mario.png");
loadSprite("spongebob", "spongebob.png");
loadSprite("star", "star.png");
loadSprite("unboxed", "unboxed.png");
loadSprite("surprise", "surprise.png");
loadSprite("princes", "princes.png");
loadSprite("coin", "coin.png");
loadSprite("mushroom", "mushroom.png");
loadSound("jumpsound", "jumpSound.mp3");
loadSound("gamesound", "gameSound.mp3");
loadSprite("prences", "princes.png");
loadSprite("gompa", "evil_mushroom.png");
loadSprite("blue", "block_blue.png");

scene("win", () => {
  add([
    text("you won the game"),
    scale(1),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);
});

scene("lose", () => {
  add([
    text("Loser\nGame Over"),
    scale(1),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);

  onKeyDown("r", () => {
    go("game");
  });
});

scene("game", () => {
  layers(["bg", "obj", "ui"], "obj");
  play("gamesound");
  const map = [
    "                                                                                                               ",
    "                                                                                                               ",
    "                                                                                                               ",
    "                                                                                                               ",
    "                                                                                                               ",
    "                                                                                                               ",
    "                                                                                                               ",
    "                                                                                                               ",
    "                                                                                                               ",
    "                                                                                                               ",
    "                                                                                                               ",
    "                                                                                                               ",
    "                                                                                                               ",
    "                           ===                                                                                 ",
    "         u!=!u     =?=?=                                =!?!=                        ?=?                       ",
    "                                     =    =====                                                                ",
    "               ^      s       ^      =             =       ^              u=u=u=u=   =     ^                 p  ",
    "==================================       ========  ==================           ================    ===========",
  ];

  const mapsymbols = {
    width: 20,
    height: 20,
    "=": () => [sprite("block"), solid(), area(), "block"],
    "?": () => [sprite("surprise"), solid(), area(), "surprise-coin"],
    "!": () => [sprite("surprise"), solid(), area(), "surprise-mushroom"],
    $: () => [sprite("coin"), solid(), area(), "coin"],
    u: () => [sprite("unboxed"), solid(), area(), "unboxed"],
    "#": () => [sprite("mushroom"), solid(), body(), area(), "mushroom"],
    p: () => [sprite("prences"), solid(), area(), "prences"],
    "^": () => [sprite("gompa"), solid(), body(), area(), "gompa"],
    a: () => [sprite("gompa"), solid(), body(), area(), "blue"],
    s: () => [sprite("star"), solid(), body(), area(), "star"],
  };

  const gameLevel = addLevel(map, mapsymbols);
  const player = add([
    sprite("mario"),
    solid(),
    area(),
    origin("bot"),
    body(),
    pos(30, 0),
    big(),
  ]);

  let score = 0;
  const scorelabel = add([text("score: " + score), scale(0.3)]);

  const speed = 135;
  const jumpforce = 550;
  //character movement//
  onKeyDown("right", () => {
    player.move(speed, 0);
  });
  onKeyDown("left", () => {
    player.move(-speed, 0);
  });
  onKeyDown("space", () => {
    if (player.isGrounded()) player.jump(jumpforce);
  });

  onKeyDown("up", () => {
    if (player.isGrounded()) {
      player.jump(jumpforce);
      play("jumpsound");
    }
  });
  player.onUpdate(() => {
    camPos(player.pos);
    if (player.pos.y > 2000) {
      go("lose");
    }
    scorelabel.pos = player.pos.sub(500, 250);
    scorelabel.text = "score: " + score;
  });
  player.onHeadbutt((obj) => {
    if (obj.is("surprise-coin")) {
      destroy(obj);
      gameLevel.spawn("u", obj.gridPos);
      gameLevel.spawn("$", obj.gridPos.sub(0, 1));
    }
    if (obj.is("surprise-mushroom")) {
      destroy(obj);
      gameLevel.spawn("u", obj.gridPos);
      gameLevel.spawn("#", obj.gridPos.sub(0, 1));
    }
  });
  player.onCollide("prences", () => {
    go("win");
  });

  player.onCollide("coin", (obj) => {
    destroy(obj);
    score += 10;
  });
  player.onCollide("mushroom", (obj) => {
    destroy(obj);
    player.biggify(4);
    score += 5;
  });
  onUpdate("mushroom", (obj) => {
    obj.move(23, 0);
  });
  onUpdate("star", (obj) => {
    obj.move(-23, 0);
  });

  onUpdate("gompa", (obj) => {
    obj.move(-23, 0);
  });

  let isGrounded = false;
  player.onCollide("gompa", (obj) => {
    if (isGrounded == true) {
      go("lose");
    } else {
      destroy(obj);

      score += 15;
    }
  });
  player.onCollide("star", (obj) => {
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

  //this is the end of the scene
});

go("game");
