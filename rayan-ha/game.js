import kaboom from "./kaboom.js";
kaboom({
  background: [66,135, 245],
  scale: 2,
});

loadRoot("./sprites/");
loadSprite("mushroom", "mushroom.png");
loadSprite("mario", "mario.png");
loadSprite("coin", "coin.png");
loadSprite("unboxed", "unboxed.png");
loadSprite("surprise", "surprise.png");
loadSprite("loop", "loop.png");
loadSprite("gomba", "evil_mushroom.png");
loadSprite("spongebob", "spongebob.png");
loadSprite("mario", "mario.png");
loadSprite("pipe", "pipe_up.png");

loadSound("jumpSound", "jumpSound.mp3");
loadSound("gameSound", "gameSound.mp3");
loadSound("walking", "walk.mp3");

scene("win", () => {
  add([
    text("Winerrr\n end levelone"),
    scale(0.5),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);
});

   

scene("lose", () => {
  add([
    text("you lose"),
    scale(0.5),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);
});

scene("game", () => {
  layers([" bg, obj,ui"], "obj");
  // play("gameSound");

  const map = [
    "                                                                                           ",
    "                                                                                              ",
    "                                                                                                ",
    "                                                                                                 ",
    "                                                                                     ",
    "                                                                                             ",
    "                                                                                             ",
    "                                                                                            ",
    "                                                                                             ",
    "                                                                                              ",
    "                                                                                            ",
    "                                                                                              ",
    "                                                                                          ",
    "                                                                                            ",
    "                                                                                       ",
    "                                                                                    ",
    "                          $$$             ?!?     ?!?       ?                                       ",
    "                             $$                                                  p                                                                                                        ",
    "                                                                        gg                   ",
    "=========================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================",
  ];
  const mapsymbols = {
    width: 20,
    height: 20,
    "=": () => [sprite("mario"), solid(), area(), "ground"],

    "!": () => [sprite("surprise"), solid(), area(), "surprise-mushroom"],
    "?": () => [sprite("surprise"), solid(), area(), "surprise-coin"],
    "*": () => [sprite("loop"), solid(), area()],
    m: () => [sprite("mushroom"), area(), body(), "mushroom"],
    $: () => [sprite("coin"), area(), "coin"],
    u: () => [sprite("unboxed"), solid(), area(), "unboxed"],
    g: () => [sprite("gomba"), solid(), area(), body, "gomba"],
    p: () => [sprite("pipe"), solid(), area(), body, "pipe"],
  };

  const speed = 200;
  const jumpForce = 450;
  const gameLevel = addLevel(map, mapsymbols);
  const walkSound = play("walking", {
    volume: 1,
    loop: true,
  });
  const player = add([
    sprite("spongebob"),
    solid(),
    area(),
    origin("bot"),
    body(),
    pos(30, 0),
    big(),
  ]);
  let score = 0;
  const scoreLabel = add([text("score" + score)]);
  scale;
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
      score += 10;
    }
  });

  player.onUpdate(() => {
    camPos(player.pos);
    if (player.pos.y > 1000) {
      go("lose");
    }
    scoreLabel.pos = player.pos.sub(400, 200);
    scoreLabel.text = "score" + score;
  });
  player.onHeadbutt((obj) => {
    //coin
    if (obj.is("surprise-coin")) {
      destroy(obj);
      gameLevel.spawn("u", obj.gridPos); //umboxed
      gameLevel.spawn("$", obj.gridPos.sub(0, 1));
    }

    if (obj.is("surprise-mushroom")) {
      destroy(obj);
      gameLevel.spawn("u", obj.gridPos); //umboxed
      gameLevel.spawn("m", obj.gridPos.sub(0, 1));
    }
  });

  player.onCollide("coin", (obj) => {
    destroy(obj);
    score += 100;
  });
  player.onCollide("mushroom", (obj) => {
    destroy(obj);
    player.biggify(6);
    score += 70;
  });

  player.onCollide("pipe", (obj) => {
    onKeyDown("down", () => {
      go("win");
    });
  });

  onUpdate("mushroom", (obj) => {
    obj.move(100, 0);
  });
  onUpdate("gomba", (obj) => {
    obj.move(-20, 0);
  });
  let isGrounded = false;
  player.onCollide("gomba", (obj) => {
    if (isGrounded == true) {
      go("lose");
    } else {
      score += 50;
      destroy(obj);
    }
  });
  player.onUpdate(() => {
    isGrounded = player.isGrounded();
    if (isGrounded) {
      walkSound.play();
    } else {
      walkSound.pause();
    }
  });
});
go("game");
