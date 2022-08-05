import kaboom from "./kaboom.js";

kaboom({
  background: [68, 43, 229],
  scale: 2,
});

loadRoot("./sprites/");
loadSprite("unboxed", "unboxed.png");
loadSprite("pipe", "pipe_up.png");

loadSprite("gomba", "evil_mushroom.png");
loadSprite("block", "block.png");
loadSprite("mario", "mario.png");
loadSprite("star", "star.png");
loadSprite("coin", "coin.png");
loadSprite("loop", "loop.png");
loadSprite("sponge", "spongebob.png");
loadSprite("mushroom", "mushroom.png");
loadSprite("surprise", "surprise.png");
loadSound("jumpSound", "jumpSound.mp3");
loadSound("gameSound", "gameSound.mp3");

scene("win", () => {
  add([
    text("wow"),
    scale(0.5),
    origin("center"),
    pos(width() / 2 , height() / 2)
  ]);
  });
  

scene("lose", () => {
  add([
    text("loser"),
    scale(0.5),
    origin("center"),
    pos(width() / 2 , height() / 2)
    
  ]);
});

scene("game", () => {
  play("gameSound");
  layers(["bg", "obj", "ui"], "obj");

  const map = [
    "  lllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll",
    "                                                                           ",
    "                                                                           ",
    "                                                                           ",
    "                                                                           ",
    "                                                                           ",
    "                                         ^^                                  ",
    "                                         ======                                  ",
    "                                               =          =                 ",
    "                               =                           =                 ",
    "                   =                     =                                   ",
    "                                                     ==                      ",
    "             ^                                                              ",
    "                              =      ^        = =                             ",
    "      ?=!  !       =     =   =  ?  ===      ==                               ",
    "                =  ===    ?            ==                                   ",
    "    ?                  ^                 ===          ===            p             ",
    "                  ^       ^^^^                  ===                             ",
    "===========================================================================",
  ];

  const mapSymbols = {
    width: 20,
    height: 20,

    "=": () => [sprite("block"), solid(), area(), "block"],
    "?": () => [sprite("surprise"), solid(), area(), "suprise-coin"],
    l: () => [sprite("loop"), solid(), area()],
    $: () => [sprite("coin"), area(), "coin"],
    m: () => [sprite("mushroom"), body(), area(), "mushroom"],
    u: () => [sprite("unboxed"), solid(), area(), "unboxed"],
    "!": () => [sprite("surprise"), solid(), area(), "suprise-mushroom"],
    "^": () => [sprite("gomba"), body(), solid(), area(), "gomba"],
    "p": () => [sprite("pipe"), body(), solid(), area(), "pipe"],

  };

  const gameLevel = addLevel(map, mapSymbols);

  const player = add([
    sprite("mario"),
    solid(),
    area(),
    origin("bot"),
    body(),
    pos(30, 0),
    big()
  ]);

  let score=0
const scoreLabel= add([
  text("score" + score) , scale(0.5)
])
  const speed = 200;
  const jump =450;

  onKeyDown("right", () => {
    player.move(speed, 0);
  });

  onKeyDown("left", () => {
    player.move(-speed, 0);
  });

  onKeyDown("up", () => {
    if (player.isGrounded()) {
      player.jump(jump);
      play("jumpSound");
    }
  });

  player.onUpdate(() => {
    camPos(player.pos);
    if (player.pos.y > 1000){
      go("lose")
    }
    scoreLabel.pos = player.pos.sub(400,200)
    scoreLabel.text="score:"+ score
  });
  player.onHeadbutt((obj) => {
    if (obj.is("suprise-coin")) {
      destroy(obj);
      gameLevel.spawn("u", obj.gridPos);
      gameLevel.spawn("$", obj.gridPos.sub(0, 1));
    }
    if (obj.is("suprise-mushroom")) {
      destroy(obj);
      gameLevel.spawn("u", obj.gridPos);
      gameLevel.spawn("m", obj.gridPos.sub(0, 1));
    }
  });
  player.onCollide("coin", (obj) => {
    destroy(obj);
    score+=10
  });
  player.onCollide("mushroom", (obj) => {
    destroy(obj);
    player.biggify(10)
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
  player.onCollide("pipe", (obj)=>{
    onKeyDown("down",() =>{
      go("win")
    })
  })
  player.onUpdate(() => {
    isGrounded = player.isGrounded();
  });
});

go("game");
