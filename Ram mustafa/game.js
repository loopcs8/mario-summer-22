import kaboom from "./kaboom.js";
kaboom({
  background: [0, 181, 226],
});

loadRoot("./sprites/");
loadSprite("pum", "pum.png");
loadSprite("Rmario", "ram's mario.png");
loadSprite("block_blue", "block_blue.png");
loadSprite("block", "block.png");
loadSprite("coin", "coin.png");
loadSprite("castle", "castle.png");
loadSprite("surprise", "surprise.png");
loadSprite("pipe_up", "pipe_up.png");
loadSprite("evil_mushroom", "evil_mushroom.png");
loadSprite("unboxed", "unboxed.png");
loadSprite("pipe", "pipe_up.png");
loadSound("gamesound", "gameSound.mp3");
loadSound("jumpsound", "jumpSound.mp3");

scene("lose", () => {
  add([pos(width() / 2, height() / 2), text("game over")]);
});

scene("game", () => {
  layers(["bg", "obj", "ui"], "obj");

  const map = [
    "                                                                                    ",
    "                                                                                    ",
    "                                                                                    ",
    "                                                                                    ",
    "                                                                                    ",
    "                                                                                    ",
    "                                                                                    ",
    "                                                                                    ",
    "                                                                                    ",
    "                                                                                    ",
    "                                                                                    ",
    "                                                                                    ",
    "                                                                                    ",
    "                                                                                    ",
    "                                                                                    ",
    "                                                                                    ",
    "                                                                                    ",
    "                                                &                                   ",
    "                    $$$$                                                            ",
    "                  =======                    $$                                     ",
    "                               ======/            $$$$$$$$$               *         ",
    "                                             %===========    ===========            ",
    "                      * ========                ======                         *    ",
    "==============================================  ====================================",
  ];
  const mapkeys = {
    width: 20,
    height: 20,
    "=": () => [sprite("block"), solid(), area()],
    $: () => [sprite("coin"), area()],
    "/": () => [sprite("surprise"), solid(), area(), "surprise-coin"],
    "%": () => [sprite("surprise"), solid(), area(), "surprise-pum"],
    U: () => [sprite("unboxed"), solid(), area()],
    "@": () => [sprite("pum"), area(), "pum"],
    "*": () => [sprite("evil_mushroom"), solid(), area(), "goomba"],
  };

  const gameLevel = addLevel(map, mapkeys);
  const player = add([
    sprite("Rmario"),
    solid(),
    pos(50, 0),
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
      play("jumpsound");
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

    if (obj.is("surprise-pum")) {
      gameLevel.spawn("@", obj.gridPos.sub(0, 1));
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

  player.onCollide("pum", (pum) => {
    destroy(pum);
    shake(20);
    go("lose");
  });
  player.onCollide("goomba", (x) => {
    if (isJumping) {
      destroy(x);
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

  onUpdate("goomba", (x) => {
    x.move(-20, 0);
  });
});

scene("win", () => {
  add([
    pos(width() / 2, height() / 2),
    origin("center"),
    text("mabrook habeby"),
  ]);
});

go("game");
