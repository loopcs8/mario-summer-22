import kaboom from "./kaboom.js";

kaboom({
  background: [95, 198, 245],
});
loadRoot("./sprites/");
loadSprite("coin", "coin.png");
loadSprite("mario", "mario.png");
loadSprite("mush", "mushroom.png");
loadSprite("block", "block.png");
loadSprite("castle", "castle.png");
loadSprite("unboxed", "unboxed.png");
loadSprite("surprise", "surprise.png");
loadSprite("evilmushroom", "evil_mushroom.png");

loadSound("jumpSound", "jumpSound.mp3");
loadSound("gameSound", "gameSound.mp3");

scene("win", () => {
  add([
    pos(width() / 2, height() / 2),
    origin("center"),
    text("Good Job You win!"),
  ]);
});

scene("game", () => {
  layers(["bg", "obj", "ui"], "obj");
  play("gameSound");

  const map = [
    "                                                  m                                                          ",
    "                      xx??xx                     xxxx                   xxxxxxx                     $$$",
    "           x%%x                     xx????xx                                                                  ",
    "    ???                                                      xx???xxx                xxxx????xxxx              ",
    "                                                                                                     ????????? ",
    "                                     *     *    *                                                                                c",
    "==============      $$$$$$        =========================        m    m   m                                                  ",
    "==========================================================================================                    $$$$$$$$$$$$$$             ",
    "================================================================================================================================   ",
  ];

  let score = 0;
  const scoreLabel = add([
    text("score:\n" + score, {
      size: 48,
    }),
    origin("center"),
    pos(30, -120),
    layer("ui"),
    {
      value: score,
    },
  ]);

  scene("lose", () => {
    add([
      pos(width() / 2, height() / 2),
      origin("center"),
      text("GAME OVER!!\nYour score is: " + scoreLabel.value),
    ]);
  });
  const mapkeys = {
    width: 20,
    height: 20,
    "=": () => [sprite("block"), solid(), area()],
    $: () => [sprite("coin"), area(), "coin"],
    m: () => [sprite("mush"), area(), body(), "mush"],
    "*": () => [sprite("evilmushroom"), area(), body(), "evilmushroom"],
    "?": () => [sprite("surprise"), solid(), area(), "surprise-coin"],
    "%": () => [sprite("surprise"), solid(), area(), "surprise-mushroom"],
    x: () => [sprite("unboxed"), solid(), area()],
    c: () => [sprite("castle"), solid(), area(), "castle"],
  };

  const gamelevel = addLevel(map, mapkeys);

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
      play("jumpSound");
      player.jump(500);
      isJumping = true;
    }
  });
  player.action(() => {
    camPos(player.pos);
    if (player.pos.y >= 200) {
      go("lose");
    }
  });
  player.onHeadbutt((obj) => {
    if (obj.is("surprise-coin")) {
      gamelevel.spawn("$", obj.gridPos.sub(0, 1));
      destroy(obj);
      gamelevel.spawn("x", obj.gridPos.sub(0, 0));
    }
    if (obj.is("surprise-mushroom")) {
      gamelevel.spawn("m", obj.gridPos.sub(0, 1));
      destroy(obj);
      gamelevel.spawn("x", obj.gridPos.sub(0, 0));
    }
  });

  player.onUpdate(() => {
    scoreLabel.pos.x = player.pos.x - 300;
    scoreLabel.pos.y = player.pos.y - 280;
    camPos(player.pos);
  });
  player.onCollide("coin", (coin) => {
    destroy(coin);
    scoreLabel.value += 1;
    scoreLabel.text = "Score:" + scoreLabel.value;
  });
  player.onCollide("mush", (mush) => {
    destroy(mush);
    player.biggify(4);
  });
  player.onCollide("evilmushroom", (evilmushroom) => {
    if (isJumping) {
      destroy(evilmushroom);
    } else {
      shake(20);
      wait(1, () => {
        go("lose");
      });
    }
  });
  player.onCollide("castle", (castle) => {
    wait(0, () => {
      go("win");
    });
  });
  onUpdate("mush", (mush) => {
    mush.move(20, 0);
  });
  onUpdate("evilmushroom", (evilmushroom) => {
    evilmushroom.move(-20, 0);
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
