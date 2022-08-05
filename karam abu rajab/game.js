import kaboom from "./kaboom.js";
kaboom({
    background: [52, 113, 235],
});

loadRoot("./sprites/");
loadSprite("amungs", "amungs.png");
loadSprite("block_blue", "block_blue.png");
loadSprite("block", "block.png");
loadSprite("coin", "coin.png");
loadSprite("castle", "castle.png");
loadSprite("surprise", "surprise.png");
loadSprite("pipe_up", "pipe_up.png");
loadSprite("karams_mashrom", "karams_mashrom.png");
loadSprite("star", "star.png");
loadSprite("unboxed", "unboxed.png");
loadSprite("cloud", "pixil-frame-0 (8).png");
loadSprite("evil_mushroom", "evil_mushroom.png");
loadSound("gameSound", "gameSound.mp3")
loadSound("jumpSound", "jumpSound.mp3")
loadSprite("castle", "castle.png");
scene("game", () => {
    layers(["bg", "obj", "ui"], "obj");
    play("gameSound")


    const map = [
        '                                 l                                                                                          ',
        '                                                                                                                    ',
        '                     !              $         !                   !                                    !           =',
        '                                 3333       3333                                            !                      =',
        '                             !                       333                           !                                   =',
        '              !                         !                      333                     !                           =',
        '                                                           $             33             !                          =',
        '           !                                              33333                       !                            =',
        '                                                                              3                                    =',
        '                                           $      3333                                                             =',
        '                                        33333                                     3                                =',
        '                                                                                                                   =',
        '                               3333                          l           9333           $                           =',
        '          9    $        333                                                                                        =',
        '           w                                                       $                                               =',
        'cccccccccccccccc======                               cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
        'cccccccccccccccc======                               cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
        '                                                                                                                     ',
        '                                                                                                                     ',
        '                                                                                                                     ',
        '                                                                                                                     ',
        '                       3                                                                                              ',
        '                                                                                                                     ',
        '                                                                                                                     ',
        '                                                                                                                     ',
        '                                                                                                                     ',
        '                                                                                                                     ',
        '                                                                                                                     ',
    ]


    const mapKeys = {

        width: 20,
        height: 20,

        "=": () => [sprite("block"), solid(), area()],
        "c": () => [sprite("block"), solid(), area()],
        "$": () => [sprite("coin"), area(), "coin"],
        "1": () => [sprite("karams_mashrom"), area(), body(), "mashrom"],
        "2": () => [sprite("surprise"), solid(), area(), "surprise-coin"],
        "3": () => [sprite("block"), solid(), area()],
        "0": () => [sprite("unboxed"), solid(), area()],
        "!": () => [sprite("cloud"), area()],
        "m": () => [sprite("surprise"), solid(), area(), "surprise-star"],
        "s": () => [sprite("star")],
        "9": () => [sprite("surprise"), solid(), area(), "surprise-mashroom"],
        "w": () => [sprite("evil_mushroom"), area(), body(), "goomba"],
        "l": () => [sprite("castle"), area(), "castle"],
    }




    const gameLevel = addLevel(map, mapKeys)

    const player = add([
        sprite("amungs"),
        solid(),
        pos(30, 0),
        body(),
        origin('bot'),
        area()
    ])

    onKeyDown("right", () => {
        player.move(200, 0)
    })

    onKeyDown("left", () => {
        player.move(-200, 0)
    })
    let isjumping = false
    onKeyDown("space", () => {
        if (player.isGrounded()) {
            play("jumpSound")
            player.jump(550)
            isjumping = true
        }
    })


    player.onHeadbutt((obj) => {
        if (obj.is("surprise-coin")) {
            gameLevel.spawn("$", obj.gridPos.sub(0, 1))
            destroy(obj)
            gameLevel.spawn("0", obj.gridPos.sub(0, 0))
        }
        if (obj.is("surprise-mashroom")) {
            gameLevel.spawn("1", obj.gridPos.sub(0, 1))
            destroy(obj)
            gameLevel.spawn("0", obj.gridPos.sub(0, 0))
        }
    });

    player.onUpdate(() => {
        camPos(player.pos);
    });

    player.onCollide("coin", (coin) => {
        destroy(coin);
    })

    player.onCollide("surprise-mashrom", (surprisemashrom) => {
        destroy(surprisemashrom);
    })

    player.onCollide("mashrom", (mashrom) => {
        destroy(mashrom)
        shake(20)
    })

    onUpdate("mashrom", (mashrom) => {
        mashrom.move(20, 0);
    })

    onUpdate("goomba", (goomba) => {
        goomba.move(-20, 0);
    })
    player.onCollide("goomba", (goomba) => {
        go("lose");
        shake(20)
    })
    player.onCollide("goomba", (goomba) => {
        if (isjumping) {
            destroy(goomba)
        }
        else {
            go("lose");
        }
    })

    const score = add([
        text("Score: 0"),
        pos(24, 24),
        { value: 0 },
    ])

    player.onCollide("castle", () => {
        onKeyPress("down", () => {
            go("win");
        });
    })

    player.onCollide("coin", () => {
        score.value += 10
        score.text = "Score:" + score.value
    })
    player.onCollide("mashrom", () => {
        score.value += 100
        score.text = "Score:" + score.value
    })
    player.onUpdate(() => {
        if (player.isGrounded()) {
            isjumping = false
        }
        else {
            isjumping = true
        }
    })
})




go("game");

scene("win", () => {
    add([
        pos(width() / 2, height() / 2),
        origin("center"),
        text("you win\nwelll player!")

    ])
})

scene("lose", () => {
    add([
        pos(width() / 2, height() / 2),
        origin("center"),
        text("GAME OVER!\nyou lose hahaha")

    ])
});
//  4/8/2022

