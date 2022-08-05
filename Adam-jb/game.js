import kaboom from "./kaboom.js";

kaboom({
  background: [91, 209, 181],
  scale: 2,
});

loadRoot("./sprites/");
loadSound("jumpSound", "jumpSound.mp3");
loadSound("gameSound", "gameSound.mp3");
loadSprite("block1", "gras.png");
loadSprite("block2", "gras.png");
loadSprite("evel", "vcat.png");
loadSprite("?", "cas1.png");
loadSprite("u", "unboxed.png");
loadSprite("fishd", "fishd.png");
loadSprite("$", "cat coin.png");
loadSprite("cat", "cat.png");
loadSprite("p", "pipe_up.png");
scene("win", () => {
  add([
    text("you won the game"),
    scale(1),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);
});

scene("lose", () => {
  add([
    text("you losed the game"),
    scale(1),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);
});

scene("game", () => {
  layers(["bg", "obj", "ui"], "obj");
  play("gameSound");
  const map = [
    "                                                                                                       ",
    "                                                                                =                       ",
    "                                                                                                       ",
    "                                                                                              ",
    "                                                                          =                           ",
    "                                                                                                      ",
    "                                       =?=?=                                                           ",
    "                     ^                              ========                                                  ",
    "                                                  ==              =                                    ",
    "======================================================           ============    ================",
    "=                                                                                              ",
    "=                                                                                                 ",
    "=                                                                                               ",
    "=           ==      ^       ^       ?         ^        $                                           ",
    "=     $$$$$$$=$$$$                                                                                           ",
    "=========   ====================================================================================",
    "                                                                                                       ",
    "                                                                                                       ",
    "        =                                                                                               ",
    "         =                 =    =                                             %                            ",
    "         =====            ==    ==         ^               ^                                              ",
    "             ===============     =============================================================",
  ];

  const mapSymbols = {
    width: 20,
    height: 20,
    "=": () => [sprite("block1"), solid(), area()],
    "-": () => [sprite("block2"), area()],
    "?": () => [sprite("?"), solid(), area(), "surprise-fish"],
    "%": () => [sprite("p"), solid(), area(), "p"],
    $: () => [sprite("$"), area(), "coin"],
    f: () => [sprite("fishd"), area(), body(), "fishd"],
    u: () => [sprite("u"), solid(), area(), "unboxed"],
    "^": () => [sprite("evel"), solid(), area(), body(), "robot", patrol()],
  };
  const gameLevel = addLevel(map, mapSymbols);

  const player = add([
    sprite("cat"),
    solid(),
    body(),
    area(),
    origin("bot"),
    pos(30, 0),
    big(),
  ]);

  let score = 0;
  const scoreLabel = add([text("score: " + score)]);

  onKeyDown("d", () => {
    player.move(250, 0);
    player.flipX(false);
  });
  onKeyDown("a", () => {
    player.move(-250, 0);

    player.flipX(true);
  });
  onKeyDown("w", () => {
    if (player.isGrounded()) {
      player.jump(400);
      play("jumpSound");
    }
  });

  player.onUpdate(() => {
    camPos(player.pos);
    if (player.pos.y > 1000) {
      go("lose");
    }
    scoreLabel.pos = player.pos.sub(400, 200);
    scoreLabel.text = "score " + score;
  });
  player.onHeadbutt((obj) => {
    if (obj.is("surprise-fish")) {
      destroy(obj);
      gameLevel.spawn("=", obj.gridPos);
      gameLevel.spawn("f", obj.gridPos.sub(0, 1));
    }
  });
  player.onCollide("fishd", (obj) => {
    destroy(obj);

    player.biggify(15);
  });
  player.onCollide("coin", (obj) => {
    destroy(obj);
    score += 10;
  });
  player.onCollide("p", (obj) => {
    onKeyDown("s", () => {
      go("win");
    });
  });
  onUpdate("fishd", (obj) => {
    obj.move(20, 0);
  });

  onUpdate("robot", (obj) => {
    obj.move(-20, 0);
  });

  let isGrounded = false;
  player.onCollide("robot", (obj) => {
    if (isGrounded == true) {
      go("lose");
    } else {
      destroy(obj);
    }
  });

  function patrol(distance = 100, speed = 50, dir = 1) {
    let flip = false;
    return {
      id: "patrol",
      require: ["pos", "area"],
      startingPos: vec2(0, 0),
      add() {
        this.startingPos = this.pos;
        this.on("collide", (obj, side) => {
          if (side === "left" || side === "right") {
            dir = -dir;
          }
        });
      },
      update() {
        if (Math.abs(this.pos.x - this.startingPos.x) >= distance) {
          dir = -dir;
          if (flip) {
            flip = false;
          } else {
            flip = true;
          }
          this.flipX(flip);
        }
        this.move(speed * dir, 0);
      },
    };
  }

  player.onUpdate(() => {
    isGrounded = player.isGrounded();
  });
  ///////DoNoTtOuCh//////////
});

go("game");
