import kaboom from "./kaboom.js";

kaboom({
  background: [25, 166, 236],
  scale: 2,
});

loadRoot("./sprites/");

loadSprite("mario", "mario.png");
loadSprite("mushroom", "mushroom.png");
loadSprite("block", "block.png");
loadSprite("surprise", "surprise.png");
loadSprite("pipe", "pipe_up.png");
loadSprite("unboxed", "unboxed.png");
loadSprite("coin", "coin.png");
loadSprite("gomba", "evil_mushroom.png");

loadSound("jumpsound", "jumpSound.mp3");
loadSound("gamesound", "gameSound.mp3");

scene("win", () => {
  add([
    text("you won"),
    scale(1),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);
});

scene("lost", () => {
  add([
    text("lost"),
    scale(1.5),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);
});

scene("game", () => {
  layers(["bg", "obj", "ui"], "obj");
  play("gamesound");
  const map = [
    "                                                                                                                                                                                                                                                                     ",
    "                                                                                                                                                                                                                                                                     ",
    "                                                                                                                                                                                                                                                                     ",
    "                                                                                                                                                                                                                                                                     ",
    "                                                                                                                                                                                                                                                                     ",
    "                                                                                                                                                                                                                                                                     ",
    "                                                                                                                                        !!                                                                                                                             ",
    "                                                                                                                                                                                                                                                                   ",
    "                                                                                                       ?                                                                                                                                                             ",
    "                                              ?                                                                               ?       ====                                                               !!                                                            ",
    "                                                                                                      ====                                                                                              = =  =                                                          ",
    "                                             ========      =!== ==                  !                                          ====                 !!                           ====                          ====                                                                   ,                                                                                                                               ",
    "                                            =       ====      ===                               ====                              ====                                  ===                                  ====                                                         ",
    "                 =  =                      =       =           ====            ====                          !?!                                  ====      =         ===                 !!                ====                        = =                                         ",
    "       !  7     ==  ==   0    ?!?         =       =              =====                       ====                             ====            ====         ==                     ===            !?!      ====            0         =   =                                       ",
    "               ===  ===  0               =       =                 ======                 7      7                                                        ===  00                                                          0          =     =        0                       ",
    "======================================================================================================================================================================================    =====================   ============================== ========                    ",
  ];

  const mapsymbols = {
    width: 20,
    height: 20,
    "=": () => [sprite("block"), solid(), area()],
    "?": () => [sprite("surprise"), solid(), area(), "surprise-mushroom"],
    0: () => [sprite("pipe"), solid(), area()],
    $: () => [sprite("coin"), area(), "coin"],
    u: () => [sprite("unboxed"), solid(), area()],
    "!": () => [sprite("surprise"), solid(), area(), "surprise-coin"],
    m: () => [sprite("mushroom"), solid(), area(), body(), "mushroom"],
    7: () => [sprite("gomba"), solid(), area(), body(), "gomba"],
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
  const scoreLabel = add([text("score: " + score), scale(0.4)]);

  onKeyDown("right", () => {
    player.move(155, 0);
  });

  onKeyDown("left", () => {
    player.move(-155, 0);
  });
  onKeyDown("space", () => {
    if (player.isGrounded()) {
      player.jump(480);
      play("jumpsound");
    }
  });

  player.onUpdate(() => {
    camPos(player.pos);
    if (player.pos.y > 500) {
      go("lost");
    }
    scoreLabel.pos = player.pos.sub(500, 250);
    scoreLabel.text = "score: " + score;
  });

  player.onHeadbutt((obj) => {
    //coin
    if (obj.is("surprise-coin")) {
      destroy(obj);
      gameLevel.spawn("u", obj.gridPos);
      gameLevel.spawn("$", obj.gridPos.sub(0, 1));
    }
    //mushroom
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
    player.biggify(4);
  });
  player.onCollide("pipe", (obj) => {
    onKeyDown("down", () => {
      go("win");
    });
  });

  onUpdate("mushroom", (obj) => {
    obj.move(20, 0);
  });
  onUpdate("gomba", (obj) => {
    obj.move(-20, 0);
  });
  let isGrounded = false;
  player.onCollide("gomba", (obj) => {
    if (isGrounded == true) {
      go("lost");
    } else {
      destroy(obj);
    }
  });
  player.onUpdate(() => {
    isGrounded = player.isGrounded();
  });
});
go("game");
