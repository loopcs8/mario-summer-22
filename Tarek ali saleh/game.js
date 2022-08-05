import kaboom from "./kaboom.js";

kaboom({
  background: [209, 200, 71],
  scale: 2,
});
loadRoot("./sprites/");
loadSprite("mario", "mario.png");
loadSprite("block", "block.png");
loadSprite("coin", "coin.png");
loadSprite("castle", "castle.png");
loadSprite("evil", "evil_mushroom.png");
loadSprite("mushroom", "mushroom.png");
loadSprite("unboxed", "unboxed.png");
loadSprite("lucky_block", "surprise.png");
loadSprite("new_block", "block_new.png");
loadSound("jump_Sound", "jumpSound.mp3");
loadSound("game_Sound", "gameSound.mp3");
loadSprite("cloud", "cloud.png");
loadSprite("iron", "unboxed.png");
loadSprite("green", "pipe_up.png");

scene("win", () => {});

scene("lose", () => {});

scene("game", () => {
  layers(["bg", "obj", "ui"], "obj");
  play("game_Sound");

  const map = [
    "                                                                                                                   ",
    "=++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++",
    "=                                                                                                                  ",
    "=                                                                                                                  ",
    "=                                                                                                                  ",
    "=                                                                                                                  ",
    "=                                                                                                                  ",
    "=                                                                                                                  ",
    "=                                                                                                                  ",
    "=                                                                                                                  ",
    "=                                                                                                                  ",
    "=                                                                                                                  ",
    "=                           ==?==                                                                                  ",
    "=                                                                                                                  ",
    "=                                                                                                                  ",
    "=       =!=?=               -----                                                                                  ",
    "=                          -     -                                                                                 ",
    "=                 ~   ~   -       -         =            &            ~            ~              ~              ",
    "=                        -         -                                                                               ",
    "===========================       =================================================================================",
  ];

  const mapSymbols = {
    width: 20,
    height: 20,
    "=": () => [sprite("block"), solid(), area()],
    "?": () => [sprite("lucky_block"), solid(), area(), "surprise-coin"],
    "-": () => [sprite("new_block"), solid(), area()],
    "&": () => [sprite("green"), solid(), area()],
    "+": () => [sprite("cloud")],
    "!": () => [sprite("lucky_block"), solid(), area(), "surprise-mushroom"],
    $: () => [sprite("coin"), solid(), area(), "coin"],
    u: () => [sprite("iron"), solid(), area(), "unboxed"],
    m: () => [sprite("mushroom"), solid(), body(), area(), "mushroom"],
    "~": () => [sprite("evil"), solid(), area(), body(), "evil"],
  };
  const speed = 150;
  const jumpFource = 550;
  const gameLevel = addLevel(map, mapSymbols);
  const player = add([
    sprite("mario"),
    solid(),
    area(),
    origin("bot"),
    body(),
    pos(30, 0),
  ]);
  onKeyDown("right", () => {
    player.move(speed, 0);
  });
  onKeyDown("left", () => {
    player.move(-speed, 0);
  });
  onKeyPress("space", () => {
    if (player.isGrounded()) {
      player.jump(jumpFource);
      play("jump_Sound");
    }
  });
  player.onUpdate(() => {
    camPos(player.pos);
  });
  // coin surprise
  player.onHeadbutt((obj) => {
    if (obj.is("surprise-coin")) {
      destroy(obj);
      gameLevel.spawn("u", obj.gridPos);
      gameLevel.spawn("$", obj.gridPos.sub(0, 1));
    }
  });
  // coin surprise
  // mushroom surprise
  player.onHeadbutt((obj) => {
    if (obj.is("surprise-mushroom")) {
      destroy(obj);
      gameLevel.spawn("u", obj.gridPos);
      gameLevel.spawn("m", obj.gridPos.sub(0, 1));
    }
  });
  player.onCollide("coin", (obj) => {
    destroy(obj);
  });
  player.onCollide("mushroom", (obj) => {
    destroy(obj);
  });
  onUpdate("mushroom", (obj) => {
    obj.move(60, 0);
  });
  onUpdate("evil", (obj) => {
    obj.move(-40, 0);
  });
  let isGrounded = false;
  player.onCollide("evil", (obj) => {
    if (isGrounded == true) {
      alert("lose");
    } else {
      destroy(obj);
    }
  });
  player.onUpdate(() => {
    isGrounded = player.isGrounded();
  });
  // mushroom surprise
}); //this is the end of the game scene

go("game");
