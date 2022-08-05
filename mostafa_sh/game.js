let spd = 300;
let jmp = 500;
let score = 0;

import kaboom from "./kaboom.js";

kaboom({
  background: [135, 206, 235],
  scale: 2,
});

loadRoot("./sprites/");
loadSprite("mario", "mario.png");
loadSprite("dino", "dino.png");
loadSprite("block", "block.png");
loadSprite("evilMushroom", "evil_mushroom.png");
loadSprite("pipeUp", "pipe_up.png");
loadSprite("surprise", "surprise.png");
loadSprite("unboxed", "unboxed.png");
loadSprite("blueBlock", "block_new.png");
loadSprite("coin", "coin.png");
loadSprite("mushroom", "mushroom.png");
loadSprite("cloud", "cloud.png");
loadSprite("castle", "castle.png");
loadSprite("newBlock", "block_new.png");
loadSprite("loop", "loop.png");

loadSound("gameSound", "gameSound.mp3");
loadSound("jumpSound", "jumpSound.mp3");

scene("win", () => {
  add([
    text("You Have A Good Gaming Chair !!"),
    origin("center"),
    pos(width() / 2, height() / 2),
    scale(0.5),
  ]);
}); //end of the scene

scene("lose", () => {
  add([
    text("You Need A Better Gaming Chair Now ! \n ctrl + r to respawn"),
    origin("center"),
    pos(width() / 2, height() / 2),
    scale(0.5),
  ]);
}); //end of the scene

scene("game", () => {
  play("gameSound");

  layers(["bg", "obj", "ui"], "obj");
  const map = [
    "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",
    "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",
    "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",
    "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",
    "                             #                                  #                                                                                      ",
    "                                                                                                                                                     ",
    "                                                                                                                                                     ",
    "                                                                                                                                                     ",
    "                                                                                                                                                     ",
    "                                                                                                                                                     ",
    "                                                                                                                                                    %",
    "                                                                                                                                                    %",
    "        ?==?!                 =    =                                                                                                                %",
    "                             ==    ==                                                                                                           $   %",
    " +                          ===    ===                                                                                                              %",
    "===============================    ==============================nnnn================================================================================",
    "===============================    ==============================nnnn================================================================================",
    "                                                                                                                                                     ",
    "                                                                                                                                                     ",
    "                                                                                                                                                     ",
    "                                                                                                                                                     ",
    "                                                                                                                                                     ",
    "                                                                                                                                                     ",
    "                                                                                                                                                     ",
    "                                                                                                                                                     ",
    "                                                                                                                                                     ",
    "                                                                                                                                                     ",
    "                                                                                                                                                     ",
    "                                                                                                                                                     ",
    "                                                                                                                                                     ",
  ];
  const gameS = {
    width: 20,
    height: 20,
    d: () => [sprite("dino"), body(), area(), solid(), "dino"],
    x: () => [sprite("newBlock"), area(), solid()],
    "/": () => [sprite("block"), area()],
    "=": () => [sprite("block"), solid(), area(), "block"],
    "@": () => [sprite("cloud"), "cloud"],
    "#": () => [
      sprite("evilMushroom"),
      body(),
      solid(),
      area(),
      "evilMushroom",
    ],
    $: () => [sprite("pipeUp"), solid(), area(), "pipeUp"],
    "%": () => [sprite("loop"), solid(), area(), "looP"],
    "?": () => [sprite("surprise"), solid(), area(), "surprise-coin"],
    "!": () => [sprite("surprise"), solid(), area(), "surprise-mushroom"],
    c: () => [sprite("coin"), area(), "coin"],
    M: () => [sprite("mushroom"), body(), area(), "mushroom"],
    U: () => [sprite("unboxed"), solid(), area(), "unBoxed"],
    n: () => [sprite("blueBlock")],
  };
  const gameL = addLevel(map, gameS);

  const player = add([
    sprite("mario"),
    solid(),
    area(),
    origin("bot"),
    body(),
    pos(30.0),
    big(),
  ]);

  const scoreLabel = add([text("score :" + score), scale(0.2)]);

  onKeyDown("right", () => {
    player.move(spd, 0);
  });
  onKeyDown("left", () => {
    player.move(-spd, 0);
  });
  onKeyDown("up", () => {
    if (player.isGrounded()) {
      player.jump(jmp);
      play("jumpSound");
    }
  });

  player.onUpdate(() => {
    camPos(player.pos);
    if (player.pos.y > 500) {
      go("lose");
    }
    scoreLabel.pos = player.pos.sub(450, 200);
    scoreLabel.text = "score: " + score;
  });

  player.onHeadbutt((obj) => {
    if (obj.is("surprise-coin")) {
      destroy(obj);
      gameL.spawn("U", obj.gridPos);
      gameL.spawn("c", obj.gridPos.sub(0, 1));
    }
    if (obj.is("surprise-mushroom")) {
      destroy(obj);
      gameL.spawn("U", obj.gridPos);
      gameL.spawn("M", obj.gridPos.sub(0, 1));
    }

    player.onCollide("pipeUp", (obj) => {
      console.log("Here");
      onKeyDown("down", () => {
        go("win");
      });
    });

    player.onCollide("coin", (obj) => {
      destroy(obj);
      score += 10;
    });

    player.onCollide("mushroom", (obj) => {
      destroy(obj);
      player.biggify(10);
      score += 50;
    });

    onUpdate("mushroom", (obj) => {
      obj.move(20, 0);
    });

    onUpdate("dino", (obj) => {
      obj.move(30, 0);
    });
  });
  onUpdate("evilMushroom", (obj) => {
    obj.move(-30, 0);
  });

  let isGrounded = false;
  player.onCollide("evilMushroom", (obj) => {
    if (isGrounded == true) {
      go("lose");
    } else {
      destroy(obj);
      score += 100;
    }
  });

  player.onUpdate(() => {
    isGrounded = player.isGrounded();
  });
}); //end of the scene
go("game");
