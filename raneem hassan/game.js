import kaboom from "./kaboom.js";
kaboom({
  background: [47, 215, 245],
});

loadRoot("./sprites/");

loadSprite("mario", "mario.png");
loadSprite("block", "block.png");
loadSprite("block_new", "block_new.png");
loadSprite("surpise", "surprise.png");
loadSprite("mushroom", "mushroom.png");
loadSprite("cloud", "cloud.png");
loadSprite("coin", "coin.png");
loadSprite("pipe_up", "pipe_up.png");
loadSprite("unboxed", "unboxed.png");
loadSprite("castle", "castle.png");
loadSprite("block_blue", "block_blue.png");
loadSprite("evil_mushroom", "evil_mushroom.png");
loadSound("jumpSound", "jumpSound.mp3");
loadSound("gameSound", "gameSound.mp3");

scene("win", () => {
  add([
    pos(width() / 2, height() / 2), origin("center"), text("good job you win")
  ])
});

scene("lose", () => {
  add([pos(width() / 2, height() / 2), origin("center"), text("GAME OVER!!!")]);
});

scene("game", () => {
  layers(["bg", "obj", "ui"], "obj");
  play("gameSound");

  const map = [
    "======                       ",
    "                            ==    ",
    "             =====                   ",
    "                               ",
    "         ======             ==                     ==    ",
    "                                ",
    "                               ",
    "                      $ &         ",
    "    =======  ?              =========        ",
    "            ====  ===       x                                     c",                       
    "                                                                    ",
    "                                      ",
    "====================nnnn===========================================",
  ];

  const mapkeys = {
    width: 20,
    height: 20,    
    "=": () => [sprite("block"), solid(), area()],
    $: () => [sprite("coin"), area(), "coin"],
    "x": () => [sprite("mushroom"), area(), "mushroom"],
    "?": () => [sprite("surpise"), area(), solid(), "surprise-coin"],
    "@": () => [sprite("unboxed"), area(), solid()],
    "n": () => [sprite("block_new"), area(), solid()],
    "&": () => [
      sprite("evil_mushroom"),
      area(),
      solid(),
      body(),
      "evil_mushroom",
    ],
    "c": () => [sprite("castle"), area(), solid(),"castle"],
  };

  const gameLevel = addLevel(map, mapkeys);
  
  


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
  let isJumping = false
  onKeyDown("space", () => {
    if (player.isGrounded()) {
      play("jumpSound");
      player.jump(500);
    isJumping=true
    }
  });

  player.onHeadbutt((obj) => {
    if (obj.is("surprise-coin")) {
      gameLevel.spawn("$", obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn("@", obj.gridPos.sub(0, 0));
    }
    if (obj.is("surprise-mushroom")) {
      gameLevel.spawn("$", obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn("@", obj.gridPos.sub(0, 0));
    }
  });

  player.onUpdate(() => {
    camPos(player.pos);
  });
  player.onCollide("coin", (coin) => {
    destroy(coin);
  });
  player.onCollide("mushroom", (mushroom) => {
    destroy(mushroom);
    shake(20);
    player.biggify(4)
  });

  onUpdate("mushroom", (mushroom) => {
    mushroom.move(5, 0);
  });
  onUpdate("evil_mushroom", (evil_mushroom) => {
    evil_mushroom.move(-20, 0);
  });
  player.onCollide("evil_mushroom", (evil_mushroom) => {
    if(isJumping){
      destroy(evil_mushroom)
    }
    else{

      go("lose");
      shake(20);
    }
  });

  player.onCollide("castle",()=>{
    onKeyDown("down", () => {
      go("win")
    });
  });
  
  player.onUpdate(()=>{
    if(player.isGrounded())
    {
      isJumping=false;
    }
    else{
      isJumping=true;
    }
  })
});

go("game");
