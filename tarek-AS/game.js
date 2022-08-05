import kaboom from "./kaboom.js";

kaboom({
  background: [209, 200, 71],
  scale: 2,
});
loadRoot("./sprites/");
loadSprite("mario", "mario.png");
loadSprite("block", "block.png");
loadSprite("coin", "coin.png");
loadSprite("castle", "castle.png");
loadSprite("evil", "evil_mushroom.png");
loadSprite("mushroom", "mushroom.png");
loadSprite("unboxed", "unboxed.png");
loadSprite("lucky_block", "surprise.png");
loadSprite("new_block", "block_new.png");
loadSound("jump_Sound", "jumpSound.mp3");
loadSound("game_Sound", "gameSound.mp3");
loadSprite("cloud", "cloud.png");
loadSprite("iron", "unboxed.png");
loadSprite("green", "pipe_up.png");
loadSprite("dino", "dino.png");
loadSprite("star", "star.png");

scene("win", () => {
  add([
    text("you win"),
    scale(1),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);
});

scene("lose", () => {
  add([
    text("game over"),
    scale(1),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);
});

scene("game", () => {
  layers(["bg", "obj", "ui"], "obj");
  play("game_Sound");

  const map = [
    "                                                                                                                   ",
    "=++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++",
    "=                                                                                                                  ",
    "=                                                                                                                  ",
    "=                                                                                                                  ",
    "=                                                                                                                  ",
    "=                                                                                                                  ",
    "=                                                                              ==                                  ",
    "=                                                                                 =                                ",
    "=                                                                              =  =                                ",
    "=                                                                                 =                                ",
    "=                            =*=                                           =      =                                ",
    "=                                                                                 =                                ",
    "=                                                                              =  =                                ",
    "=                                                                                 =                                ",
    "=                           -----                                         =       =                                ",
    "=       =!=?=               -   -                 ???                             =     ??????????????????     c   ",
    "=                          -     -                                             =  =                                ",
    "=                 ~   ~   -       -         =            &                        =                                ",
    "=                        -         -                                       =      =                             ~  ",
    "===========================       ==========================     ==================================================",
  ];

  const mapSymbols = {
    width: 20,
    height: 20,
    "=": () => [sprite("block"), solid(), area()],
    "?": () => [sprite("lucky_block"), solid(), area(), "surprise-coin"],
    "-": () => [sprite("new_block"), solid(), area()],
    "&": () => [sprite("green"), solid(), area()],
    "+": () => [sprite("cloud")],
    "!": () => [sprite("lucky_block"), solid(), area(), "surprise-mushroom"],
    "*": () => [sprite("lucky_block"), solid(), area(), "surprise-star"],
    $: () => [sprite("coin"), solid(), area(), "coin"],
    u: () => [sprite("iron"), solid(), area(), "unboxed"],
    m: () => [sprite("mushroom"), solid(), body(), area(), "mushroom"],
    "~": () => [sprite("evil"), solid(), area(), body(), "evil"],
    d: () => [sprite("dino"), solid(), area(), body(), "dino"],
    c: () => [sprite("castle"), solid(), area(), "castle"],
    w: () => [sprite("star"), solid(), area(), body(), "star"],
  };
  const speed = 150;
  const jumpFource = 550;
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

  let score = 0;
  const scoreLabel = add([text("score: " + score), scale(0.4)]);
  onKeyDown("right", () => {
    player.move(speed, 0);
  });
  onKeyDown("left", () => {
    player.move(-speed, 0);
  });
  onKeyPress("space", () => {
    if (player.isGrounded()) {
      player.jump(jumpFource);
      play("jump_Sound");
    }
  });
  player.onUpdate(() => {
    camPos(player.pos);
    if (player.pos.y > 500) {
      go("lose");
    }
    scoreLabel.pos = player.pos.sub(400, 200);
    scoreLabel.text = "score: " + score;
  });
  // coin surprise
  player.onHeadbutt((obj) => {
    if (obj.is("surprise-coin")) {
      destroy(obj);
      gameLevel.spawn("u", obj.gridPos);
      gameLevel.spawn("$", obj.gridPos.sub(0, 1));
    }
  });
  // coin surprise
  // mushroom surprise
  player.onHeadbutt((obj) => {
    if (obj.is("surprise-mushroom")) {
      destroy(obj);
      gameLevel.spawn("u", obj.gridPos);
      gameLevel.spawn("m", obj.gridPos.sub(0, 1));
    }
    if (obj.is("surprise-star")) {
      destroy(obj);
      gameLevel.spawn("u", obj.gridPos);
      gameLevel.spawn("w", obj.gridPos.sub(0, 1));
    }
  });
  player.onCollide("coin", (obj) => {
    destroy(obj);
    score += 10;
  });
  player.onCollide("castle", (odj) => {
    onKeyDown("right", () => {
      go("win");
    });
  });
  player.onCollide("mushroom", (obj) => {
    destroy(obj);
    player.biggify(60);
    score += 50;
  });
  player.onCollide("star", (obj) => {
    destroy(obj);
    player.biggify(60);
    score += 100;
  });
  onUpdate("mushroom", (obj) => {
    obj.move(60, 0);
  });
  onUpdate("star", (obj) => {
    obj.move(60, 0);
  });
  onUpdate("evil", (obj) => {
    obj.move(-40, 0);
  });
  let isGrounded = false;
  player.onCollide("evil", (obj) => {
    if (isGrounded == true) {
      go("lose");
    } else {
      destroy(obj);
    }
    score += 75;
  });

  player.onUpdate(() => {
    isGrounded = player.isGrounded();
    isGrounded = player.isGrounded();
  });
  // mushroom surprise
}); //this is the end of the game scene

go("game");
