import kaboom from "./kaboom.js";
kaboom({
  background: [0, 255, 255],
  scale: 2,
});

loadRoot("./sprites/");
loadSprite("surprise", "surprise.png");
loadSprite("block", "block.png");
loadSprite("bad_player", "bad_player.png");
loadSound("sound", "jumpSound.mp3");
loadSound("sound2", "gameSound.mp3");
loadSprite("mushroom", "mushroom.png");
loadSprite("coin", "coin.png");
loadSprite("unboxed", "unboxed.png");
loadSprite("evil", "evil_mushroom.png");
loadSprite("pipe", "pipe_up.png");

scene("lose", () => {
  add([text("Looooose"), pos(width() / 2, height() / 2), origin("center")]);
});

scene("win", () => {
  add([text("wineer"), pos(width() / 2, height() / 2), origin("center")]);
});

scene("game", () => {
  layers(["bg", "obj", "ui"], "obj");
  const map = [
    "                                                    =                                     ",
    "                                                                                         ",
    "                                                                                         ",
    "                                                    =                                      ",
    "                                                                                         ",
    "                                                                          !               ",
    "                                               =                                          ",
    "                                                                                         ",
    "                                                                                         ",
    "                                                   =       =                               ",
    "                                           !                            ==                  ",
    "                                                                                                                     ",
    "                                  ?         !                                              ",
    "                                                                ====                   p     ",
    "                                                                                    g     ",
    " ========================================================================================",
  ];
  const mapsymbols = {
    width: 20,
    height: 20,
    "=": () => [sprite("block"), solid(), area(), "block"],
    "?": () => [sprite("surprise"), solid(), area(), "surprise-coin"],
    "!": () => [sprite("surprise"), solid(), area(), "surprise-mushroom"],
    $: () => [sprite("coin"), body(), area(), "coin"],
    u: () => [sprite("unboxed"), solid(), area()],
    m: () => [sprite("mushroom"), body(), solid(), area(), "mushroom"],
    g: () => [sprite("evil"), body(), area(), "evil"],
    p: () => [sprite("pipe"), body(), area(), "pipe"],
  };
  const gameLevel = addLevel(map, mapsymbols);
  const player = add([
    sprite("bad_player"),
    solid(),
    area(),
    origin("bot"),
    body(),
    pos(30, 0),
    big(),
  ]);
  let score = 0;
  const scoreLabel = add([text("Score: " + score), scale(0.2)]);
  onKeyDown("d", () => {
    player.move(200, 0);
  });
  onKeyDown("a", () => {
    player.move(-200, 0);
  });
  onKeyDown("space", () => {
    if (player.isGrounded()) {
      player.jump();
    }
  });
  onKeyDown("space,()=>");

  player.onUpdate(() => {
    camPos(player.pos);
    if (player.pos.y > 1500) {
      go("lose");
    }
    scoreLabel.pos = player.pos.sub(450, 220);
    scoreLabel.text = "Score: " + score;
  });
  player.onCollide("pipe", (obj) => {
    onKeyDown("s", () => {
      go("win");
    });
  });
  on;
  player.onHeadbutt((obj) => {
    //coin
    if (obj.is("surprise-coin")) {
      destroy(obj);
      gameLevel.spawn("u", obj.gridPos); //unboxed
      gameLevel.spawn("$", obj.gridPos.sub(0, 1));
    }
    if (obj.is("surprise-mushroom")) {
      destroy(obj);
      gameLevel.spawn("u", obj.gridPos); //unboxed
      gameLevel.spawn("m", obj.gridPos.sub(0, 1));
    }
  });
  player.onCollide("coin", (obj) => {
    score += 20;
    destroy(obj);
  });
  player.onCollide("mushroom", (obj) => {
    player.biggify();
    score += 50;
    destroy(obj);
  });
  onUpdate("mushroom", (obj) => {
    obj.move(100, 0);
  });
  onUpdate("coin", (obj) => {
    obj.move(100, 0);
  }); //end scene
  onUpdate("evil", (obj) => {
    obj.move(-50, 0);
  });
  let isGrounded = false;
  player.onCollide("evil", (obj, collision) => {
    if (isGrounded == true) {
      go("lose");
    } else {
      destroy(obj);
    }
  });

  player.onUpdate(() => {
    isGrounded = player.isGrounded();
  });
});
go("game");
