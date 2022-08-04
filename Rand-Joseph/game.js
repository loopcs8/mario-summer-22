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

loadSound("jumpSound", "jumpSound.mp3");
loadSound("gameSound", "gameSound.mp3");

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
    "                  ^        ^                ",
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
    "^": () => [sprite("gomba"), solid(), area(), body(), "gomba"],
  };
  const gameLevel = addLevel(map, mapSymbols);
  const player = add([
    sprite("mario"),
    solid(),
    area(),
    origin("bot"),
    body(),
    big(),
    pos(30, 0),
  ]);

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
  });

  player.onCollide("mushroom", (obj) => {
    destroy(obj);
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
      alert("lose");
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
