import kaboom from "./kaboom.js";
kaboom({
  background: [51, 153, 255],
});
loadRoot("./sprites/");

loadSprite("mario", "mario.png");
loadSprite("block", "block.png");
loadSprite("coin", "coin.png");
loadSprite("surprise", "surprise.png");
loadSprite("unboxed", "unboxed.png");
loadSprite("pipe", "pipe_up.png");
loadSprite("star", "star.png");
loadSprite("evil_mushroom", "evil_mushroom.png");
loadSprite("cloud", "cloud.png");
loadSprite("mushroom", "mushroom.png");
loadSprite("princes", "princes.png");
loadSprite("dino", "dino.png");
loadSprite("castle", "castle.png");
loadSprite("blue_block", "block_blue.png");

loadSound("jump sound", "jumpSound.mp3");
loadSound("game sound", "gameSound.mp3");

scene("game", () => {
  layers(["bg", "obj", "ui"], "obj");
  play("game sound");
  const map = [
    "                                         ",
    "                                         ",
    "                                         ",
    "                                         ",
    "                                         ",
    "                                         ",
    "                                         ",
    "                                         ",
    "                                         ",
    "                                         ",
    "                                         ",
    "                                         ",
    "                                         ",
    "                                         ",
    "                                         ",
    "                                    **       *      *              ",
    "                                         ",
    "                                         ",
    "                                          !                                                                                                                                           ",
    "                                     =====                                                                                                                                            ",
    "                                                                                                                                                                                      ",
    "                                                                                                                                                                                      ",
    "                     =?==                       ==%=                                                                             =================================               ",
    "                                                                                                                                                                                                                                                           ^   ",
    "=                $    !                 !   $                                                                                                                                                                                                     0       ;   ",
    "===============================================================                                                                                                                                                                                  ============ ",
    "===============================================================       ===============                                                                                                                                                         -            ",
    "                                                                                                             ========                                                                                                                      -          ",
    "                                                                                                                           @                                                                                                            -                 ",
    "                                                                                             ================      =========                                                                                                         -            ",
    "                                                                                                             ======                                                                                                               -                  ",
    "                                                                                                                                                                                                                               -              ",
    "                                                                                                                                                                                                                            -            ",
    "                                                                                                                                                                                                                         -                    ",
    "                                                                                                                                                                                                                      -        ",
    "                                                                                                                                                                                             ======================= ",
    "                                                                                                                                                                                          =  ",
    "                                                                                                                                                                                       =   ",
    "                                                                                                                                                                                    =  ",
    "                                                                                                                                                                                 =      ",
    "                                                                                                                                                                              =        ",
    "                                                                                                                                                                           =           ",
    "                                                                                                                                                                        =              ",
    "                                                                                                                                           $$$$$$$$$$$$$$$$$$$$$$$$  =                 ",
    "                                                                                                                                           ========================                   ",
  ];
  const mapKeys = {
    width: 20,
    height: 20,
    "=": () => [sprite("block"), solid(), area()],
    $: () => [sprite("coin"), area(), "coin"],
    "!": () => [
      sprite("evil_mushroom"),
      solid(),
      area(),
      body(),
      "evil_mushroom",
    ],
    "@": () => [sprite("pipe"), solid(), area(), "pipe"],
    "?": () => [sprite("surprise"), solid(), area(), "surprise-coin"],
    x: () => [sprite("unboxed"), solid(), area()],
    m: () => [sprite("mushroom"), area(), body(), "mushroom"],
    "*": () => [sprite("cloud"), area()],
    "%": () => [sprite("surprise"), solid(), area(), "surprise-mushroom"],
    ";": () => [sprite("princes"), solid(), area(), "princes"],
    0: () => [sprite("dino"), solid(), area()],
    "^": () => [sprite("castle"), solid(), area()],
    "-": () => [sprite("blue_block"), solid(), area(), "death_block"],
  };
  const gameLevel = addLevel(map, mapKeys);
  let isjumping = false;
  const player = add([
    sprite("mario"),
    solid(),
    pos(30, 0),
    body(),
    origin("bot"),
    area(),
    big(),
  ]);
  onKeyDown("d", () => {
    player.move(200, 0);
  });
  onKeyDown("a", () => {
    player.move(-200, 0);
  });
  onKeyDown("right", () => {
    player.move(200, 0);
  });
  onKeyDown("left", () => {
    player.move(-200, 0);
  });
  onKeyDown("space", () => {
    if (player.isGrounded()) {
      play("jump sound");
      player.jump(500);
      isjumping = true;
    }
  });
  player.onHeadbutt((obj) => {
    if (obj.is("surprise-coin")) {
      gameLevel.spawn("$", obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn("x", obj.gridPos.sub(0, 0));
    }
    if (obj.is("surprise-mushroom")) {
      gameLevel.spawn("m", obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn("x", obj.gridPos.sub(0, 0));
    }
  });
  player.onUpdate(() => {
    camPos(player.pos);
  });
  player.onCollide("coin", (x) => {
    destroy(x);
    score += 100;
  });
  player.onCollide("evil_mushroom", (y) => {
    if (isjumping) {
      destroy(y);
      score += 100;
    } else {
      go("lose");
    }
  });
  player.onCollide("mushroom", (mushroom) => {
    destroy(mushroom);
    shake(40);
    player.biggify(5);
    score += 150;
  });
  onUpdate("evil_mushroom", (mushroom) => {
    mushroom.move(-20, 0);
  });
  onUpdate("mushroom", (evil) => {
    evil.move(20, 0);
  });
  player.onUpdate(() => {
    if (player.isGrounded()) {
      isjumping = false;
    } else {
      isjumping = true;
    }
  });
  player.onCollide("pipe", (pipe) => {
    onKeyDown("s", () => {
      player.pos.x += 100;
      player.pos.y -= 130;
    });
  });
  player.onCollide("princes", () => {
    go("win");
  });
  player.onCollide("death_block", (z) => {
    wait(0.6, () => {
      destroy(z);
    });
  });

  let score = add([text("Score: 0", 1), pos(player.pos.x, player.pos.y)]);
});

scene("win", () => {
  add([
    text("you win!!\nmabrook habibi"),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);
});

scene("lose", () => {
  add([
    text("GAME OVER!!\nloser"),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);
});

go("game");
