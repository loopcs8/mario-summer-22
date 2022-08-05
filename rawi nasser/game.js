/** @format */

import kaboom from "./kaboom.js";
kaboom({
  background: [120, 240, 255],
});
loadRoot("./sprites/");
loadSprite("coin", "coin.png");
loadSprite("mushroom", "mushroom.png");
loadSprite("block", "block.png");
loadSprite("pipe", "pipe_up.png");
loadSprite("surprise", "surprise.png");
loadSprite("unboxed", "unboxed.png");
loadSprite("evil_mushroom", "evil_mushroom.png");
loadSprite("player", "player.png");
loadSprite("castle", "castle.png");
loadSound("jumpSound", "jumpSound.mp3");
loadSound("gameSound", "gameSound.mp3");

scene("game", () => {
  layers(["bg", "obj", "ui"], "obj");
  play("gameSound");
  const map = [
    "                                                                                                                                                         ",
    "                                                                                                                                                         ",
    "                                                                                                                              =               @          ",
    "                                                                                                                         =    =================      =================      ",
    "                                                                                                                                                =                         ",
    "                                                                                                                                                  =                         ",
    "                                                                                                                                                    =                      ",
    "                                                                                                                                                      =                          ",
    "                                                                                                                           =                            =                          ",
    "                                                                                                                                                          =                         ",
    "       $                                                                                                                                                    =                            ",
    "       ===!=====                           ===x===========                                                              =                                     =                                         ",
    "                                                                                                                                                                =             ",
    "                                                                                                                            =                                     =                                                  ",
    "            &       &                                                                                                                                               =                                              ",
    "=       @             $        #                           $                                                              =                                           =                                     ",
    "==============     ==============================      ============                                ==========================                                           =                ",
    "                                                                                                  =                                                                       =                                ",
    "                                                                                                =                                                                           =                      ",
    "                                                                                              =                                                                               =                                   ",
    "                                                                                            =                                                                                   =                 ",
    "                                                                           =           @  =                                                                                       =                   ",
    "                                                                     =     ===============                                                                                          =                                                    ",
    "                                                                                                                                                                                       =====================                             ",
    "              =                                 @ $$$$$         =                                                                                                                                                                        ",
    "              ===================================      ==========                                                                                                                                                                         ",
    "                                                                                                                                                                                                                                                                       ",
    "                                                                                                                                                                                                                                                                            ",
    "                                                                                                                                                                                                                                                                         ",
    "                                                                                                                                                                                                                                                                             ",
    "                                                                                                                                                                                                                                                                           ",
    "                                                                                                                                                                                                                                                                                    ",
    "                                                                                                                                                                                                                                                                            c                        ",
    "                                                                                                                                                                                                                                                                                         ",
    "                                                                                                                                                                                                                                                                                        ",
    "                                                                                                                                                                                                                $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$                                                      ",
    "                                                                                                                                                                                                              ==================================================================                                                        ",
  ];

  const mapkeys = {
    width: 20,
    height: 20,
    "=": () => [sprite("block"), solid(), area()],
    $: () => [sprite("coin"), area(), "coin"],
    "!": () => [sprite("surprise"), solid(), area(), "surprise-coin"],
    "@": () => [sprite("evil_mushroom"), solid(), area(), "evil_mushroom"],
    "#": () => [sprite("mushroom"), body(), area(), "mushroom"],
    "&": () => [sprite("pipe"), area(), solid(), "pipe"],
    "*": () => [sprite("unboxed"), area(), solid()],
    x: () => [sprite("surprise"), solid(), area(), "surprise-mushroom"],
    w: () => [sprite("cloud"), area()],
    c: () => [sprite("castle"), area(), solid(), "castle"],
  };

  const gameLevel = addLevel(map, mapkeys);
  let isJumpinng = false;
  const player = add([
    sprite("player"),
    solid(),
    pos(30, 0),
    body(),
    origin("bot"),
    area(),
    big(),
  ]);

  onKeyDown("right", () => {
    player.move(200, 0);
  });
  onKeyDown("left", () => {
    player.move(-200, 0);
  });
  let isJumping = false;
  onKeyDown("space", () => {
    if (player.isGrounded()) {
      play("jumpSound");
      player.jump(600);
      isJumping = true;
    }
  });
  //onKeyDown("down", () => {
  // if (player.pos(260,280)){

  //}
  // });
  player.onHeadbutt((obj) => {
    if (obj.is("surprise-coin")) {
      gameLevel.spawn("$", obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn("*", obj.gridPos.sub(0, 0));
    }
    if (obj.is("surprise-mushroom")) {
      gameLevel.spawn("#", obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn("*", obj.gridPos.sub(0, 0));
    }
  });
  player.onCollide("coin", (z) => {
    destroy(z);
  });
  player.onCollide("evil_mushroom", (evil_mushroom) => {
    if (isJumping) {
      destroy(evil_mushroom);
    } else {
      go("lose");
    }
  });
  player.onUpdate(() => {
    if (player.isGrounded()) {
      isJumping = false;
    } else {
      isJumping = true;
    }
  });

  player.onCollide("castle", () => {
    go("win");
  });
  player.onCollide("mushroom", (mushroom) => {
    destroy(mushroom);
    shake(20);
    player.biggify(6);
  });
  onUpdate("mushroom", (mushroom) => {
    mushroom.move(20, 0);
  });
  onUpdate("evil_mushroom", (evil_mushroom) => {
    evil_mushroom.move(-20, 0);
  });
  player.onUpdate(() => {
    camPos(player.pos);
  });
});

scene("win", () => {
  add([
    pos(width() / 2, height() / 2),
    origin("center"),
    text("good job!!\nnext lvl "),
  ]);
});

scene("lose", () => {
  add([
    pos(width() / 2, height() / 2),
    origin("center"),
    text("GAME OVER!!\n"),
  ]);
});

go("game");
scene("game", () => {
  layers(["bg", "obj", "ui"], "obj");
  play("gameSound");
  const map = [
    "                                                                                                                                                         ",
    "                                                                                                                                                         ",
    "                                                                                                                              =               @          ",
    "                                                                                                                         =    =================      =================      ",
    "                                                                                                                                                =                         ",
    "                                                                                                                                                  =                         ",
    "                                                                                                                                                    =                      ",
    "                                                                                                                                                      =                          ",
    "                                                                                                                           =                            =                          ",
    "                                                                                                                                                          =                         ",
    "       $                                                                                                                                                    =                            ",
    "       ===!=====                              ===x===========                                                           =                                     =                                         ",
    "                                                                                                                                                                =             ",
    "                                                                                                                            =                                     =                                                  ",
    "            &       &                                                                                                                                               =                                              ",
    "=       @             $        #                           $                                                              =                                           =                                     ",
    "==============     ==============================      ============                                ==========================                                           =                ",
    "                                                                                                  =                                                                       =                                ",
    "                                                                                                =                                                                           =                      ",
    "                                                                                              =                                                                               =                                   ",
    "                                                                                            =                                                                                   =                 ",
    "                                                                           =           @  =                                                                                       =                   ",
    "                                                                     =     ===============                                                                                          =                                                    ",
    "                                                                                                                                                                                       =====================                             ",
    "              =                                 @ $$$$$         =                                                                                                                                                                        ",
    "              ===================================      ==========                                                                                                                                                                         ",
    "                                                                                                                                                                                                                                                                       ",
    "                                                                                                                                                                                                                                                                            ",
    "                                                                                                                                                                                                                                                                         ",
    "                                                                                                                                                                                                                                                                             ",
    "                                                                                                                                                                                                                                                                           ",
    "                                                                                                                                                                                                                                                                                    ",
    "                                                                                                                                                                                                                                                                            c                        ",
    "                                                                                                                                                                                                                                                                                         ",
    "                                                                                                                                                                                                                                                                                        ",
    "                                                                                                                                                                                                                $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$                                                      ",
    "                                                                                                                                                                                                              ==================================================================                                                        ",
  ];

  const mapkeys = {
    width: 20,
    height: 20,
    "=": () => [sprite("block"), solid(), area()],
    $: () => [sprite("coin"), area(), "coin"],
    "!": () => [sprite("surprise"), solid(), area(), "surprise-coin"],
    "@": () => [sprite("evil_mushroom"), solid(), area(), "evil_mushroom"],
    "#": () => [sprite("mushroom"), body(), area(), "mushroom"],
    "&": () => [sprite("pipe"), area(), solid(), "pipe"],
    "*": () => [sprite("unboxed"), area(), solid()],
    x: () => [sprite("surprise"), solid(), area(), "surprise-mushroom"],
    w: () => [sprite("cloud"), area()],
    c: () => [sprite("castle"), area(), solid(), "castle"],
  };

  const gameLevel = addLevel(map, mapkeys);
  let isJumpinng = false;
  const player = add([
    sprite("player"),
    solid(),
    pos(30, 0),
    body(),
    origin("bot"),
    area(),
    big(),
  ]);

  onKeyDown("right", () => {
    player.move(200, 0);
  });
  onKeyDown("left", () => {
    player.move(-200, 0);
  });
  let isJumping = false;
  onKeyDown("space", () => {
    if (player.isGrounded()) {
      play("jumpSound");
      player.jump(600);
      isJumping = true;
    }
  });
  //onKeyDown("down", () => {
  // if (player.pos(260,280)){

  //}
  // });
  player.onHeadbutt((obj) => {
    if (obj.is("surprise-coin")) {
      gameLevel.spawn("$", obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn("*", obj.gridPos.sub(0, 0));
    }
    if (obj.is("surprise-mushroom")) {
      gameLevel.spawn("#", obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn("*", obj.gridPos.sub(0, 0));
    }
  });
  player.onCollide("coin", (z) => {
    destroy(z);
  });
  player.onCollide("evil_mushroom", (evil_mushroom) => {
    if (isJumping) {
      destroy(evil_mushroom);
    } else {
      go("lose");
    }
  });
  player.onUpdate(() => {
    if (player.isGrounded()) {
      isJumping = false;
    } else {
      isJumping = true;
    }
  });

  player.onCollide("castle", () => {
    go("win");
  });
  player.onCollide("mushroom", (mushroom) => {
    destroy(mushroom);
    shake(20);
    player.biggify(6);
  });
  onUpdate("mushroom", (mushroom) => {
    mushroom.move(20, 0);
  });
  onUpdate("evil_mushroom", (evil_mushroom) => {
    evil_mushroom.move(-20, 0);
  });
  player.onUpdate(() => {
    camPos(player.pos);
  });
});
