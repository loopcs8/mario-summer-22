import kaboom from "./kaboom.js";
kaboom({
  background: [8, 149, 121],
});

loadRoot("./sprites/");
loadSprite("kimd", "KIMDOTCOMFR.png");
loadSprite("heli", "HELICOPTERHELICOPTER.png");
loadSprite("block", "STREETS.png");
loadSprite("Cop", "police.png");
loadSprite("money", "coin.png");
loadSprite("surprise", "surprise.png");
loadSprite("unboxed", "unboxed.png");
loadSprite("apple", "apple.png");
loadSprite("bullet", "bullet.png");
loadSprite("cloud", "cloud.png");
loadSprite("W", "crown.png");
loadSound("HELICOBTER", "FAZLIJA-HELIKOPTER-.mp3");

scene("lose", () => {
  add([
    pos(width() / 2, height() / 2),
    origin("center"),
    text("game over bozo"),
  ]);
});
scene("win", () => {
  layers(["bg", "obj", "ui"], "obj");

  scene("win"),
    () => {
      add([
        pos(width() / 2, height() / 2),
        origin("center"),
        text("mabrook mabrook"),
      ]);
    };

  const map = [
    "   c         c         c        c     ",
    "            c                      ",
    "                              c c             c              c    ",
    "     c               c                                     *  ",
    "               *                   ",
    "        *                *         ",
    "                                 ",
    "                                  ",
    "                                  ",
    "             $                    ",
    "            @##@                               #    @",
    "    a  !            !      $    !     $       ##               W ",
    "#############  ##############################   #######  ##  ####### ",
  ];

  play("HELICOBTER");

  const mapKeys = {
    width: 20,
    height: 20,
    "*": () => [sprite("heli"), solid(), area()],
    "#": () => [sprite("block"), solid(), area()],
    "!": () => [sprite("Cop"), solid(), area(), "poliice", "poliicee"],
    $: () => [sprite("money"), area(), solid(), "coin"],
    "@": () => [sprite("surprise"), area(), solid(), "surprise-coin"],
    x: () => [sprite("unboxed"), area(), solid()],
    a: () => [sprite("apple"), area(), solid(), "abel"],
    b: () => [sprite("bullet", solid(), area(), "bullet")],
    c: () => [sprite("cloud", solid(), area())],
    W: () => [sprite("W", solid(), "crown")],
  };

  const winLevel = addLevel(map, mapKeys);

  const player = add([
    sprite("kimd"),
    solid(),
    pos(30, 0),
    body(),
    origin("bot"),
    area(),
    big(),
  ]);
  // player movement

  onKeyDown("d", () => {
    player.move(240, 0);
  });

  onKeyDown("a", () => {
    player.move(-240, 0);
  });

  onKeyPress("space", () => {
    if (player.isGrounded()) {
    }
    player.jump(450);
  });
  player;
  onKeyPress("k", (obj) => {
    winLevel.spawn("b", obj.gridPos.sub(0, 0));
    onUpdate("bullet", (b) => {
      bullet.move(-20, 0);
    });
  });

  player.onHeadbutt((obj) => {
    if (obj.is("surprise-coin")) {
      winLevel.spawn("$", obj.gridPos.sub(0, 1));
      destroy(obj);
      winLevel.spawn("x", obj.gridPos.sub(0, 0));
    }
  });

  player.onUpdate(() => {
    camPos(player.pos);
  });
  player.onCollide("crown", () => {
    onKeyPress("space", () => {
      go("win");
    });
  });

  player.onCollide("coin", (coin) => {
    destroy(coin);
  });

  player.onCollide("poliice", (poliice) => {
    shake(40);
  });

  player.onCollide("abel", (abel) => {
    destroy(abel);
    player.biggify(2);
  });

  player.onCollide("poliice", (poliice) => {
    go("lose");
  });
});

go("win");
