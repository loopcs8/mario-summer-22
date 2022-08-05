import kaboom from "./kaboom.js";

kaboom({
  background: [25, 166, 236],
  scale: 2,
});

loadRoot("./sprites/");

loadSprite("mario", "mario.png");
loadSprite("mushroom", "mushroom.png");
loadSprite("coin", "coin.png");
loadSprite("block", "block.png");
loadSprite("surprise", "surprise.png");
loadSound("jumpSound", "jumpSound.mp3");
loadSound("gameSound", "gameSound.mp3");
loadSprite("unboxed", "unboxed.png");
loadSprite("gomba", "evil_mushroom.png");
loadSprite("pipe", "pipe_up.png");

scene("win", () => {
  add([
    text("you won :)"),
    scale(0.5),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);
});

scene("lose", () => {
  add([
    text("try again"),
    scale(0.5),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);
});

scene("game", () => {
  play("gameSound");
  layers(["bg", "obj", "ui"], "obj");

  const map = [
    "                                                                                                                                                                                                                                                                    ",
    "                                                                                                                                                                                                                                                                    ",
    "                                                                                                                                                                                                                                                                    ",
    "                                                                                                                                                                                                                                                                    ",
    "                                                                                                                                                                                                                                                                    ",
    "                                                                                                                                                                                                                                                                    ",
    "                                                                                                                                                                                                                                                                    ",
    "                                                                                                                                                                                                                                                                    ",
    "                                                                                                                                                                                                                                                                    ",
    "                                                                                                                                                                                 ?                                                                                   ",
    "                                                                                                                                                                                                                                                                    ",
    "                                                                                                                                                                                                                                                                    ",
    "                                                                                                                                                                                                                                                                    ",
    "                                                                                                 !                                                                   =                                                    ?                                           ",
    "                                                                                                                                                                   =                                                                                                ",
    "                                                                                                                                                                 =                                                                                                  ",
    "                                                                                   =                                                                           =        =         =                                                                                   ",
    "                                                                                 =    =                                                                       =                                                      =                                               ",
    "                          !???!                   !                           =     =   =                                                                   =                                                      =          = =                                       ",
    "             =      !                =       ?                    =            =              =                        ?!                 ?                =                                  !        ?           =        =     =                                     ",
    "      ?       =       ?               =                  =                  =        =         =                                                           =                     =    =                          =            =     =         ?                             ",
    "           =               ^             =      ^   =         ^^         =                       =                  =   =   =          ^      ^         =                                        ^           =              =     =                   ^^^       &       ",
    "======================================================    ===============                         ==============     =   =    =  ===========================================             ===========================================================================",
  ];
  const mapSymbols = {
    width: 20,
    height: 20,
    "=": () => [sprite("block"), solid(), area()],
    "?": () => [sprite("surprise"), solid(), area(), "surprise-coin"],
    "!": () => [sprite("surprise"), solid(), area(), "surprise-mushroom"],
    $: () => [sprite("coin"), area(), "coin"],
    m: () => [sprite("mushroom"), body(), area(), "mushroom"],
    u: () => [sprite("unboxed"), solid(), area(), "unboxed"],
    "^": () => [sprite("gomba"), solid(), area(), body(), "gomba"],
    "&": () => [sprite("pipe"), solid(), area(), body(), "pipe"],
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

  let score = 0;
  const scoreLabel = add([text("score: " + score), scale(0.5)]);

  const speed = 150;
  const jumpForce = 600;

  onKeyDown("right", () => {
    player.move(speed, 0);
  });
  onKeyDown("left", () => {
    player.move(-speed, 0);
  });
  onKeyDown("up", () => {
    if (player.isGrounded()) {
      player.jump(jumpForce);
      play("jumpSound");
    }
  });

  player.onUpdate(() => {
    camPos(player.pos);
    if (player.pos.y > 2000) {
      go("lose");
    }
    scoreLabel.pos = player.pos.sub(450, 200);
    scoreLabel.text = "score: " + score;
  });

  player.onHeadbutt((obj) => {
    //coin
    if (obj.is("surprise-coin")) {
      destroy(obj);
      gameLevel.spawn("u", obj.gridPos);
      gameLevel.spawn("$", obj.gridPos.sub(0, 1));
    }
    if (obj.is("surprise-mushroom")) {
      destroy(obj);
      gameLevel.spawn("u", obj.gridPos);
      gameLevel.spawn("m", obj.gridPos.sub(0, 1));
    }
  });
  player.onCollide("coin", (obj) => {
    destroy(obj);
    score += 10;
  });

  player.onCollide("mushroom", (obj) => {
    destroy(obj);
    player.biggify(3);
    score += 5;
  });

  player.onCollide("pipe", (obj) => {
    onKeyDown("down", () => {
      go("win");
    });
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

  //bl2a5eeeer
  player.onUpdate(() => {
    isGrounded = player.isGrounded();
  });
});

go("game");
