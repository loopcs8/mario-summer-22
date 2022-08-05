import kaboom from "./kaboom.js";

kaboom({
  background: [255, 128, 0],
  scale: 2,
});
loadRoot("./sprites/");
loadSprite("Block", "block.png");
loadSprite("mario", "mario.png");
loadSprite("star", "mushroom.png");
loadSprite("surprise", "surprise.png");
loadSprite("gompa", "evil_mushroom.png");
loadSprite("box", "unboxed.png");
loadSprite("pie", "pipe_up.png");
loadSprite("mony", "coin.png");

loadSound("sound1", "jumpSound.mp3");
loadSound("sound2", "gameSound.mp3");
loadSound("sound3", "lose.mp3");
loadSound("sound4", "yoo.mp3");

scene("game", () => {
  play("sound2");
  layers(["bg", "obj", "ui"], "obj");
  const map = [
    "                                                                                                                           ",
    "                                                                                                                                  ",
    "              ??????? !!!                                                                                                                   ",
    "           =                                                                                                                              ",
    "        =                                                                                                                                                ",
    "           = ================  =                                                                                                                    ",
    "         =     =                  =                                                                                                   ",
    "          =                          =   =  =  =                                                                      ",
    "            =                                      =                                                                            ",
    "              =                          =    =         =     =    ==     =                                                  ",
    "                  =     =                                                                                                                  ",
    "                    =                                                       =                                                                    ",
    "                =                                                            =           =                                   ",
    "             =                             =                                   =                                                                                                                                                                       ",
    "          =  =     =      =  =  =       =   =   =         =     =                  =    = =                                                                                                                                                                         ",
    "=       =   = =   =     =  =  =             =        =    =                         =   =                                                                                                                                                                                         ",
    "=  !    =   =  ?   =  =   ?  =        ?      =     =   =            =       =           =                                                               ?                                                                                                 %                             ",
    "=     ==       =  =                      =    =    ***    =            =                =                                                                                                                                                                                           ",
    "=======       =     =  ======================================================================================================================================================================================================================================",
  ];

  const mapSymbols = {
    width: 20,
    height: 20,
    "=": () => [sprite("Block"), solid(), area()],
    "?": () => [sprite("surprise"), solid(), area(), "surprise-coin"],
    "!": () => [sprite("surprise"), solid(), area(), "surprise-star"],
    $: () => [sprite("mony"), area(), "mony"],
    "#": () => [sprite("box"), area(), solid(), "box"],
    "@": () => [sprite("star"), body(), area(), "star"],
    "*": () => [sprite("gompa"), body(), area(), "gompa"],
    "%": () => [sprite("pie"), area(), solid(), "pie"],
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
  const scoreLabel = add([text("score:" + score), scale(0.5)]);

  const junpforce = 370;
  const speed = 250;

  onKeyDown("d", () => {
    player.move(speed, 0);
  });

  onKeyDown("a", () => {
    player.move(-speed, 0);
  });
  onKeyDown("w", () => {
    if (player.isGrounded()) {
      player.jump(junpforce);
      play("sound1");
    }
    scoreLabel.pos = player.pos.sub(350, 150);
    scoreLabel.text = "score: " + score;
  });
  player.onUpdate(() => {
    camPos(player.pos);
    if (player.pos.y > 1200) {
      go("sui");
    }
  });
  player.onHeadbutt((obj) => {
    if (obj.is("surprise-coin")) {
      destroy(obj);
      gameLevel.spawn("#", obj.gridPos);
      gameLevel.spawn("$", obj.gridPos.sub(0, 1));
    }

    if (obj.is("surprise-star")) {
      destroy(obj);
      gameLevel.spawn("#", obj.gridPos);
      gameLevel.spawn("@", obj.gridPos.sub(0, 1));
      score += 50;
    }
  });
  player.onCollide("mony", (obj) => {
    destroy(obj);
    score += 10;
  });
  player.onCollide("star", (obj) => {
    destroy(obj);
    player.biggify(5);
  });
  player.onCollide("pie", (obj) => {
    onKeyDown("s", () => {
      go("yooo");
    });
  });

  onUpdate("star", (obj) => {
    obj.move(100, 0);
  });
  onUpdate("gompa", (obj) => {
    obj.move(100, 0);
  });
  let isGrounded = false;
  player.onCollide("gompa", (obj) => {
    if (isGrounded == true) {
      go("sui");
    } else {
      destroy(obj);
    }
    score += 80;
  });
  player.n = onUpdate(() => {
    isGrounded = player.isGrounded();
  });
});

scene("sui", () => {
  add([
    text("that brother gone"),
    scale(0.5),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);
  play("sound3");
});
scene("yooo", () => {
  add([
    text("bro you are hacking"),
    scale(0.5),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);

  play("sound4");
});

go("game");
