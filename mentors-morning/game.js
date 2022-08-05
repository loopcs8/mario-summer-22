import kaboom from "./kaboom.js";
kaboom({
  background: [0, 0, 255],
});

loadRoot("./sprites/");

loadSprite("mario", "mario.png");
loadSprite("loop", "loop.png");
loadSprite("coin", "coin.png");
loadSprite("block", "block.png");
loadSprite("surprise", "surprise.png");
loadSprite("unboxed", "unboxed.png");
loadSprite("mushroom", "mushroom.png");
loadSound("jumpSound", "jumpSound.mp3");
loadSound("gameSound", "gameSound.mp3");
loadSprite("goomba", "evil_mushroom.png");

scene("win", () => {});

scene("lose", () => {
  add([
    pos(width() / 2, height() / 2),
    origin("center"),
    text("GAME OVER!!\nBATATAA"),
  ]);
});

scene("game", () => {
  layers(["bg", "obj", "ui"], "obj");
  play("gameSound");

  const map = [
    "                               ",
    "                               ",
    "                               ",
    "                               ",
    "                               ",
    "                               ",
    "                              ",
    "     ?   %                     ",
    "                               ",
    "             $           g     ",
    "==================== ==========",
  ];

  const mapKeys = {
    width: 20,
    height: 20,
    "=": () => [sprite("block"), solid(), area()],
    $: () => [sprite("coin"), area(), "coin"],
    m: () => [sprite("mushroom"), area(), body(), "mushroom"],
    "?": () => [sprite("surprise"), area(), solid(), "surprise-coin"],
    x: () => [sprite("unboxed"), area(), solid()],
    "%": () => [sprite("surprise"), area(), solid(), "surprise-mushroom"],
    g: () => [sprite("goomba"), area(), solid(), "goomba"],
  };

  const gameLevel = addLevel(map, mapKeys);

  const player = add([
    sprite("mario"),
    solid(),
    pos(30, 0),
    body(),
    origin("bot"),
    area(),
  ]);

  onKeyDown("right", () => {
    player.move(200, 0);
  });

  onKeyDown("left", () => {
    player.move(-200, 0);
  });

  onKeyDown("space", () => {
    if (player.isGrounded()) {
      play("jumpSound");
      player.jump(500);
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

  player.onCollide("coin", (coin) => {
    destroy(coin);
  });

  player.onCollide("mushroom", (mushroom) => {
    destroy(mushroom);
    shake(20);
  });
  onUpdate("mushroom", (mushroom) => {
    mushroom.move(20, 0);
  });
  onUpdate("goomba", (goomba) => {
    goomba.move(-20, 0);
  });
  player.onCollide("goomba", (goomba) => {
    go("lose");
  });
});

go("game");
