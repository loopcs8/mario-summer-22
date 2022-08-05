import kaboom from "./kaboom.js";
kaboom({
  background: [91, 190, 120],
});

loadRoot("./sprites/");

loadSprite("princes", "princes.png");
loadSprite("pipe_up", "pipe_up.png");
loadSprite("block", "block.png");
loadSprite("surprise", "surprise.png");
loadSprite("coin", "coin.png");
loadSprite("dino", "dino.png");
loadSprite("unboxed", "unboxed.png");
loadSprite("mushroom", "mushroom.png");
loadSprite("mario", "mario.png");

loadSound("jumpSound", "jumpSound.mp3");
loadSound("gameSound", "gameSound.mp3");

scene("win", () => {
  add([pos(width() / 2, height() / 2), origin("center"), text("MBROOk!!")]);
});

scene("lose", () => {
  add([pos(width() / 2, height() / 2), origin("center"), text("GAME OVER!!")]);
});

scene("game", () => {
  layers(["bg", "obj", "ui"], "obj");
  play("gameSound");
  const map = [
    "                                                                             p ",
    "                                                                               ",
    "                                      =      ==================================",
    "                                                                               ",
    "                                                                               ",
    "                                                                               ",
    "                                                                               ",
    "                                                                               ",
    "                                                                             ",
    "                                      =                                         ",
    "                                                                               ",
    "                                                                               ",
    "                                                                               ",
    "                                                                               ",
    "                                                                             ",
    "                                                                               ",
    "                                      =                                         ",
    "                                                                               ",
    "                                                                               ",
    "                                                                               ",
    "                                                                             ",
    "                                                                               ",
    "                                                                               ",
    "                                      =                                          ",
    "                                                                               ",
    "                                                                               ",
    "                                                                               ",
    "                                                                               ",
    "                                                                               ",
    "                                                                               ",
    "                                      =                                         ",
    "                                                                               ",
    "                                                                               ",
    "                                                                             ",
    "                                                                               ",
    "                                                                               ",
    "                                      =                                         ",
    "                                                                              ",
    "                                                                               ",
    "                                                                              ",
    "                                                                               ",
    "                                                                               ",
    "                                      =                                         ",
    "                                                                               ",
    "                                                                               ",
    "                                                                               ",
    "                                                                               ",
    "                                      $                                         ",
    "                                      =                                         ",
    "                                                                               ",
    "                                                                               ",
    "                                                                               ",
    "                                           $                                  ",
    "                                           =                                  ",
    "                                                                               ",
    "                                 $                                             ",
    "                                 =                                             ",
    "                                                                               ",
    "                                                                               ",
    "                             $             $                                   ",
    "                             =             =                                   ",
    "                                                                               ",
    "                                    $                                          ",
    "                                    =                                          ",
    "                                        $                                      ",
    "                                        =     =====                            ",
    "                                                                               ",
    "                         ?=======                                              ",
    "                                                                               ",
    "                                                                               ",
    "                                        =============                          ",
    "                                                                               ",
    "                                                                               ",
    "                         =========                                             ",
    "                                                                               ",
    "=                                                                               ",
    "=                                        ============                           ",
    "=           ?=======?                                                           ",
    "=                                                                               ",
    "=                                                                               ",
    "=           $        g                                                        ",
    "========================                                                       ",
    "========================                                                       ",
  ];

  const mapkeys = {
    width: 20,
    height: 20,
    "=": () => [sprite("block"), solid(), area()],
    $: () => [sprite("coin"), area(), "coin"],
    "?": () => [sprite("surprise"), solid(), area(), "surprise-mushroom"],
    d: () => [sprite("princes"), solid(), area()],
    x: () => [sprite("unboxed"), solid(), area()],
    m: () => [sprite("mushroom"), body(), area(), "mushroom"],
    g: () => [sprite("mario"), body(), area(), "mario"],
    p: () => [sprite("pipe_up"), solid(), area(), "pipe"],
  };

  const gameLevel = addLevel(map, mapkeys);

  const player = add([
    sprite("princes"),
    solid(),
    pos(30, 0),
    body(),
    origin("bot"),
    area(),
    big(),
  ]);
  onKeyDown("right", () => {
    player.move(150, 0);
  });
  onKeyDown("left", () => {
    player.move(-150, 0);
  });

  let isJumping = false;
  onKeyDown("space", () => {
    if (player.isGrounded()) {
      play("jumpSound");
      player.jump(700);
      isJumping = true;
    }
  });
  player.onHeadbutt((obj) => {
    if (obj.is("surprise-mushroom")) {
      gameLevel.spawn("m", obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn("x", obj.gridPos.sub(0, 0));
    }
  });

  player.onUpdate(() => {
    camPos(player.pos);
  });

  player.onCollide("coin", (coin) => {
    destroy(coin);
  });

  player.onCollide("mushroom", (mushroom) => {
    destroy(mushroom);
    player.biggify(60);
  });

  onUpdate("mushroom", (mushroon) => {
    mushroon.move(100, 0);
  });

  onUpdate("mario", (mushroon) => {
    mushroon.move(-100, 0);
  });

  player.onCollide("mario", (goomba) => {
    if (isJumping) {
      destroy(goomba);
    } else {
      go("lose");
    }
  });

  player.action(() => {
    if (player.isGrounded()) {
      isJumping = false;
    } else {
      isJumping = true;
    }
  });
  player.onCollide("pipe", () => {
    onKeyPress("down", () => {
      go("win");
    });
  });
});

go("game");
