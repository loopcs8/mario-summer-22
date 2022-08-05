import kaboom from "./kaboom.js";

kaboom({
  background: [0, 128, 255],
});

loadRoot("./sprites/");
loadSprite("block", "block.png");
loadSprite("Mario", "mario.png");
loadSprite("coin", "coin.png");
loadSprite("surp", "surprise.png");
loadSprite("unboxed", "unboxed.png");
loadSprite("mushroom", "mushroom.png");
loadSprite("em", "evil_mushroom.png");
loadSprite("pipe", "pipe_up.png");
loadSprite("cloud", "cloud.png");

scene("win", () => {
  add([
    pos(width() / 2, height() / 2),
    origin("center"),
    text("Good\n~winer~"),
  ]);
});

scene("lose", () => {
  add([
    pos(width() / 2, height() / 2),
    origin("center"),
    text("GAME OVER\n~loser~"),
  ]);
});

scene("game", () => {
  layers(["bg", "obj", "ui"], "obj");
  let isJumping = false;
  const map = [
    "                 c                                                                                                                                      ==??===  =====================                         ",
    "                                                                                                                                                                                ",
    "                                                                                                =========                         ================?============================",
    "                                                                            $??!              =                                =                                               =",
    "              c               cc                                          $      $$$$        =                                   =                                                  =                                                   ============     ============",
    "   c                 c                                                = = = = = ===== ==========================              =                                                      ===========   ======     ======================              ",
    "                                                               = =!                                                      =                                                                    = ",
    "        ? = !                                                =                                                          =     $$                                                                =",
    "                               ===       =       =            =                                                            ==== = == ======                                                               === ====                          ============     =====        ========p=",
    "   = =            e                                  ======                                                            =                   =",
    "=================================e ====  =  =====           ===========                                             =                        =",
    "======================================== $=========p  ======          ===  p                                     =                             =",
    "======================================== ===========         ================ ==  =  =  =  === ====            =                                 ============================================================                                        ============     ",
    "                                                                                                    ==========      ",
  ];

  const mapKey = {
    width: 20,
    height: 20,
    "=": () => [sprite("block"), solid(), area()],
    $: () => [sprite("coin"), area(), "coin"],
    "?": () => [sprite("surp"), solid(), area(), "surprise-coin"],
    x: () => [sprite("unboxed"), solid(), area()],
    "!": () => [sprite("surp"), solid(), area(), "surprise-mushroom"],
    m: () => [sprite("mushroom"), area(), body(), "mushroom"],
    e: () => [sprite("em"), area(), solid(), body(), "evilm"],
    p: () => [sprite("pipe"), solid(), area(), "pipe"],
    c: () => [sprite("cloud"), solid(), area()],
  };
  const gameL = addLevel(map, mapKey);

  const player = add([
    sprite("Mario"),
    origin("bot"),
    pos(30, 0),
    body(),
    area(),
    solid(),
    big(),
  ]);

  const moveSpeed = 120;
  const jumpSpeed = 400;

  onKeyDown("right", () => {
    player.move(moveSpeed, 0);
  });

  onKeyDown("left", () => {
    player.move(-moveSpeed, 0);
  });

  onKeyDown("space", () => {
    if (player.isGrounded()) player.jump(jumpSpeed);
  });

  //........................................................//

  onKeyDown("d", () => {
    player.move(moveSpeed, 0);
  });

  onKeyDown("a", () => {
    player.move(-moveSpeed, 0);
  });

  onKeyDown("up", () => {
    if (player.isGrounded()) player.jump(jumpSpeed);
  });

  onKeyDown("w", () => {
    if (player.isGrounded()) player.jump(jumpSpeed);
  });
  //........................................................//

  player.onHeadbutt((obj) => {
    if (obj.is("surprise-coin")) {
      gameL.spawn("$", obj.gridPos.sub(0, 1));
      destroy(obj);
      gameL.spawn("x", obj.gridPos.sub(0, 0));
    }

    if (obj.is("surprise-mushroom")) {
      gameL.spawn("m", obj.gridPos.sub(0, 1));
      destroy(obj);
      gameL.spawn("x", obj.gridPos.sub(0, 0));
    }
  });

  player.onUpdate(() => {
    camPos(player.pos);
  });

  player.onCollide("coin", (x) => {
    destroy(x);
  });

  player.onCollide("mushroom", (x) => {
    destroy(x), shake(20), player.biggify(10);
  });

  //..goomba...................................//

  onUpdate("evilm", (evilm) => {
    evilm.move(20, 0);
  });
  //....
  player.onCollide("evilm", (x) => {
    if (isJumping) {
      destroy(x);
    } else {
      go("lose");
    }
  });
  //.....................................//

  const score = add([text("Score: 0"), pos(24, -50), { value: 0 }]);

  player.onCollide("coin", () => {
    score.value += 1;
    score.text = "Score:" + score.value;
  });

  player.onUpdate(() => {
    if (player.pos.y > 400) {
      go("lose");
    }
    if (player.isGrounded()) {
      isJumping = false;
    } else {
      isJumping = true;
    }
  });

  onUpdate("mushroom", (mushroom) => {
    mushroom.move(20, 0);
  });

  player.onCollide("pipe", () => {
    onKeyPress("down", () => {
      go("win");
    });
  });
});

go("game");
