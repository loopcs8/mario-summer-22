import kaboom from "./kaboom.js";

kaboom({
  background: [158, 255, 255],
  scale: 2,
});

loadRoot("./sprites/");

loadSprite("block", "block.png");
loadSprite("mario", "mario.png");

loadSprite("coin", "coin.png");
loadSprite("surprise", "surprise.png");
loadSprite("unboxed", "unboxed.png");
loadSprite("mushroom", "mushroom.png");

loadSprite("gomba", "evil_mushroom.png");
loadSprite("pipe", "pipe_up.png");

loadSound("jumpSound", "jumpSound.mp3");
loadSound("gameSound", "gameSound.mp3");

scene("win", () => {
  add([
    text("You won the game, congratulations"),
    scale(0.5),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);
});

scene("lose", () => {
  add([
    text("You went on vacation permanently"),
    scale(0.5),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);
});

scene("game", () => {
  play("gameSound");
  layers(["bg", "obj", "ui"], "obj");

  const map = [
    "                                           ",
    "                                           ",
    "                                           ",
    "                                           ",
    "                                           ",
    "                                           ",
    "                                           ",
    "                                           ",
    "                                           ",
    "                                           ",
    "                 ?!?            ?!          ",
    "                  ^        ^             P  ",
    "                                            ",
    "===========================================",
  ];

  const mapSymbols = {
    width: 20,
    height: 20,
    "=": () => [sprite("block"), solid(), area(), "block"],

    "?": () => [sprite("surprise"), solid(), area(), "surprise-coin"],
    "!": () => [sprite("surprise"), solid(), area(), "surprise-mushroom"],
    $: () => [sprite("coin"), area(), "coin"],
    m: () => [sprite("mushroom"), body(), area(), "mushroom"],
    u: () => [sprite("unboxed"), solid(), area(), "unboxed"],
    P: () => [sprite("pipe"), solid(), area(), "pipe"],
    "^": () => [sprite("gomba"), solid(), area(), body(), "gomba"],
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
  const scoreLabel = add([text("Score: " + score), scale(0.5)]);

  const speed = 170;
  const jumpForce = 450;

  onKeyDown("right", () => {
    player.move(speed, 0);
  });
  onKeyDown("left", () => {
    player.move(-speed, 0);
  });
  onKeyDown("space", () => {
    if (player.isGrounded()) {
      player.jump(jumpForce);
      play("jumpSound");
    }
  });

  player.onUpdate(() => {
    camPos(player.pos);
    if (player.pos.y > 1000) {
      go("lose");
    }
    scoreLabel.pos = player.pos.sub(400, 200);
    scoreLabel.text = "Score: " + score;
  });

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
    destroy(obj);
    score += 10;
  });

  player.onCollide("mushroom", (obj) => {
    destroy(obj);
    player.biggify(3);
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
      go("lose");
    } else {
      destroy(obj);
    }
  });

  //bl2a5eeeer
  player.onUpdate(() => {
    isGrounded = player.isGrounded();
  });
}); //end scene

go("game");
