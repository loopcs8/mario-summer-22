import kaboom from "./kaboom.js";

kaboom({
  background: [204, 255, 255],
  scale: 2,
});

loadRoot("./sprites/");

loadSprite("block", "block_blue.png");
loadSprite("block2", "block.png");
loadSprite("surprise", "surprise.png");
loadSprite("pipe_up", "pipe_up.png");
loadSprite("mushroom", "mushroom.png");
loadSprite("mario", "mario.png");
loadSprite("coin", "coin.png");
loadSprite("unboxed", "unboxed.png");
loadSprite("gomba", "evil_mushroom.png");
loadSound("jumpSound", "jumpSound.mp3");
loadSound("gameSound", "gameSound.mp3");

scene("win", () => {
  add([
    text("you win!"),
    scale(0.5),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);
});

scene("lose", () => {
  add([text("game over!"), pos(width() / 2, height() / 2), origin("center")]);
});

scene("game", () => {
  layers(["bg", "obj", "ui"], "obj");
  play("gameSound");
  const map = [
    "                                                                                                 ",
    "                                                                                                 ",
    "                                                                                                 ",
    "                                                                                                 ",
    "                                                                                                 ",
    "                                                                                                 ",
    "                                                                                                 ",
    "                                                                                                 ",
    "                                                                                                 ",
    "                                                                                                 ",
    "                                                                                                 ",
    "                                                                             ??                  ",
    "                                                                                                 ",
    "                                                                           =======               ",
    "                                                                                                 ",
    "                                                                       ==                        ",
    "                                                  %%                                             ",
    "                                             ==                         =                        ",
    "                                       ===                  ==     ==       ==                   ",
    "        ?!?                       ===                           ==     ==                        ",
    "                            ===                         ==             ==                        ",
    "=                   *                                                                            ",
    "=============================                  ============                                      ",
    "                                                                                                 ",
    "                                                              ======                             ",
    "                                                                                                 ",
    "                                                                   ===                           ",
    "                                                               ==                                ",
    "                                                                                                 ",
    "                                                                    ===                          ",
    "                                                                                                 ",
    "                                                            ===          ==      +               ",
    "                                                                                                 ",
    "                                                                ==             =======           ",
  ];

  const mapSymbols = {
    width: 20,
    height: 20,
    "=": () => [sprite("block2"), solid(), area()],
    "?": () => [sprite("surprise"), solid(), area(), "surprise-coin"],
    "!": () => [sprite("surprise"), solid(), area(), "surprise-mushroom"],
    "%": () => [sprite("surprise"), solid(), area(), "surprise-bottom"],
    u: () => [sprite("unboxed"), solid(), area(), "unboxed"],
    "+": () => [sprite("pipe_up"), solid(), area(), "pipe"],
    "-": () => [sprite("mushroom"), body(), area(), "mushroom"],
    $: () => [sprite("coin"), area(), "coin"],
    "*": () => [sprite("gomba"), body(), area(), "gomba"],
  };
  const gameLevel = addLevel(map, mapSymbols);
  const player = add([
    sprite("mario"),
    solid(),
    area(),
    origin("bot"),
    body(),
    pos(38, 0),
    "mario",
    big(),
  ]);

  let score = 0;
  const scoreLabel = add([text("score" + score), scale(0.5)]);

  const speed = 110;
  const jumpForce = 450;
  onKeyDown("right", () => {
    player.move(speed, 0);
  });

  onKeyDown("left", () => {
    player.move(-speed, 0);
  });
  onKeyDown("space", () => {
    if (player.isGrounded()) {
      player.jump(jumpForce);
      play("jumpSound");
    }
  });

  player.onUpdate(() => {
    camPos(player.pos);
    if (player.pos.y > 1500) {
      go("lose");
    }
    scoreLabel.pos = player.pos.sub(600, 300);
    scoreLabel.text = "score:" + score;
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
      gameLevel.spawn("-", obj.gridPos.sub(0, 1));
    }
  });
  player.onCollide("coin", (obj) => {
    destroy(obj);
    score += 10;
  });
  player.onCollide("mushroom", (obj) => {
    destroy(obj);
    player.biggify(6.5);
  });

  player.onCollide("surprise-bottom", (obj, side) => {
    if (side.isBottom()) {
      destroy(obj);
      gameLevel.spawn("u", obj.gridPos);
      gameLevel.spawn("-", obj.gridPos.sub(0, -1));
    }
  });

  onUpdate("mushroom", (obj) => {
    obj.move(35, 0);
  });

  onUpdate("gomba", (obj) => {
    obj.move(-20, 0);
  });

  let isGrounded = false;
  player.onCollide("gomba", (obj) => {
    if (isGrounded == true) {
      go("lose");
    } else {
      destroy(obj);
    }
  });

  player.onCollide("pipe", (obj) => {
    onKeyDown("down", () => {
      go("win");
    });
  });

  player.onUpdate(() => {
    isGrounded = player.isGrounded();
  });
});

go("game");
