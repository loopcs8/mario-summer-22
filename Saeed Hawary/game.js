import kaboom from "./kaboom.js";

kaboom({
  background: [75, 150, 114],
});
loadRoot("./sprites/");
loadSprite("z", "z.png");
loadSprite("block", "block.png");
loadSprite("coin", "coin.png");
loadSprite("castle", "castle.png");
loadSprite("surprise", "surprise.png");
loadSprite("unboxed", "unboxed.png");
loadSprite("mario", "mario.png");
loadSound("gameSound", "gameSound.mp3");
loadSprite("mushroom", "mushroom.png");
loadSprite("evil_mushroom", "evil_mushroom.png");
loadSprite("pipe", "pipe_up.png");
scene("win", () => {
  add([
    pos(width() / 2, height() / 2),
    origin("center"),
    text("mbrook!! / saeed"),
  ]);
});

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
    "                             ",
    "                             ",
    "                       ",
    "                            ",
    "     !     ?                ",
    "                $     e    p ==   ",
    "======================================== ==================================================================",
  ];
  const mapKeys = {
    width: 20,
    height: 20,
    "=": () => [sprite("block"), solid(), area()],
    "?": () => [sprite("surprise"), solid(), area(), "surprise-coin"],
    "!": () => [sprite("surprise"), solid(), area(), "surprise-mushroom"],
    M: () => [sprite("mushroom"), area(), body(), "mushroom"],
    $: () => [sprite("coin"), area(), "coin"],
    x: () => [sprite("unboxed"), solid(), area()],
    p: () => [sprite("pipe"), solid(), area(), "pipe"],
    e: () => [
      sprite("evil_mushroom"),
      solid(),
      area(),
      body(),
      "evil_mushroom",
    ],
  };

  const gameLevel = addLevel(map, mapKeys);

  const player = add([
    sprite("mario"),
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
      player.jump(500);
      isJumping = true;
    }
  });

  player.onHeadbutt((obj) => {
    if (obj.is("surprise-coin")) {
      gameLevel.spawn("$", obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn("x", obj.gridPos.sub(0, 0));
    }
    if (obj.is("surprise-mushroom")) {
      gameLevel.spawn("M", obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn("x", obj.gridPos.sub(0, 0));
    }
  });
  player.onUpdate(() => {
    camPos(player.pos);

    player.onCollide("coin", (coin) => {
      destroy(coin);
    });

    player.onCollide("coin", (coin) => {
      destroy(coin);
    });

    player.onCollide("mushroom", (mushroom) => {
      destroy(mushroom);
      shake(20);
      player.biggify(4);
    });
    onUpdate("mushroom", (mushroom) => {
      mushroom.move(1, 0);
    });

    onUpdate("evil_mushroom", (evil_mushroom) => {
      evil_mushroom.move(-1, 0);
    });

    let isJumping = false;
  });
  player.onCollide("evil_mushroom", (goomba) => {
    if (isJumping) {
      destroy(goomba);
    } else {
      go("lose");
    }
  });
  player.onCollide("pipe", () => {
    onKeyPress("down", () => {
      go("win");
    });
  });
  player.onUpdate(() => {
    if (player.isGrounded()) {
      isJumping = false;
    } else {
      isJumping = true;
    }
  });
});

go("game");
