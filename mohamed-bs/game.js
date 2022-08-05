import kaboom from "./kaboom.js";

kaboom({
    background: [142, 247, 152],
    scale: 2,
});

loadRoot("./sprites/");

loadSprite("mario", "mario.png");
loadSprite("princes", "princes.png");
loadSprite("block", "block.png");
loadSprite("surprise", "surprise.png");
loadSprite("pipe", "pipe_up.png");
loadSound("gameSound", "gameSound.mp3");
loadSound("jumpSound", "jumpSound.mp3");
loadSprite("coin", "coin.png")
loadSprite("unboxed", "unboxed.png")
loadSprite("mushroom", "mushroom.png")
loadSprite("gomba", "evil_mushroom.png")


scene("lose", () => {
    add([
        text("GG"),
        scale(0.5),
        origin("center"),
        pos(width() / 2, height() / 2),
    ]);
});

scene("win", () => {
    add([
        text("NICEEEEEEEEE"),
        scale(0.5),
        origin("center"),
        pos(width() / 2, height() / 2),
    ]);
});


scene("game", () => {
    play("gameSound");
    layers(["bg", "obj", "ui"])

    const map = [
        "                                                                    ",
        "                                                                    ",
        "                                                                    ",
        "                                                                    ",
        "                                                                    ",
        "                                                                    ",
        "                                                                    ",
        "                                                                    ",
        "                                                                    ",
        "                                                                    ",
        "                                                                    ",
        "                                                                    ",
        "                                                                    ",
        "                                                                    ",
        "                                                                    ",
        "                                                                    ",
        "           ?           =!=           !             ?                ",
        "                    =                                            *  ",
        "      =         =         x       =        x    ==          x       ",
        "====================================================================",
    ];

    const mapSymbols = {
        width: 20,
        height: 20,
        "=": () => [sprite("block"), solid(), area()],
        "?": () => [sprite("surprise"), solid(), area(), "surprise-mushroom"],
        "*": () => [sprite("pipe"), solid(), area(), "pipe"],
        "!": () => [sprite("surprise"), solid(), area(), "surprise-coin"],
        "c": () => [sprite("coin"), solid(), area(), "coin"],
        "m": () => [sprite("mushroom"), solid(), area(), body(), "mushroom"],
        "u": () => [sprite("unboxed"), solid(), area(), "unboxed"],
        "x": () => [sprite("gomba"), solid(), area(), body(), "gomba"],

    }
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
    let score = 0
    const scoreLabel = add([
        text("Score: " + score),
        scale(0.5)
    ])

    const speed = 130
    const jumpForce = 420

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
        if (player.pos.y > 750) {
            go("lose");
        }
        scoreLabel.pos = player.pos.sub(400, 200);
        scoreLabel.text = "Score: " + score;
    })

    player.onHeadbutt((obj) => {
        //coin
        if (obj.is("surprise-coin")) {
            destroy(obj);
            gameLevel.spawn("u", obj.gridPos);//unboxed
            gameLevel.spawn("c", obj.gridPos.sub(0, 1));
        }
        if (obj.is("surprise-mushroom")) {
            destroy(obj);
            gameLevel.spawn("u", obj.gridPos);//unboxed
            gameLevel.spawn("m", obj.gridPos.sub(0, 1));
        }
    })

    player.onCollide("pipe", (obj) => {
        onKeyDown("down", () => {
            go("win");
            score += 200
        });
    });



    player.onCollide("coin", (obj) => {
        destroy(obj);
        score += 100;
    });
    player.onCollide("mushroom", (obj) => {
        destroy(obj);
        player.biggify(4);
        score += 50;
    });

    onUpdate("mushroom", (obj) => {
        obj.move(20, 0);
    });
    let isGrounded = false;
    onUpdate("gomba", (obj) => {
        obj.move(-20, 0);
    });

    player.onCollide("gomba", (obj) => {
        if (isGrounded == true) {
            go("lose")


        } else {
            destroy(obj)
            score += 70
        }








    })
    //bl2a5er
    player.onUpdate(() => {
        isGrounded = player.isGrounded();
    });

});////DO NOT PUT CODE AFTER THIS////
go("game")