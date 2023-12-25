const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const gravity = 0.5;


class Player {
    constructor() {
        this.position = {
            x: 100,
            y: 100
        }

        this.velocity = {
            x: 0,
            y: 0
        }
        this.width = 30;
        this.height = 30;
    }

    draw() {
        c.fillStyle = 'red';
        c.fillRect(
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
    }

    update() {
        this.draw();
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;

        if (this.position.y + this.height + this.velocity.y <= canvas.height) {
            this.velocity.y += gravity;
        } else {
            this.velocity.y = 0;
        }
    }
}

class Platform {
    constructor({ x, y }) {
        this.position = {
            x, // same as x : x
            y  // same as y : y
        };
        this.width = 200;
        this.height = 20;
    }

    draw() {
        c.fillStyle = 'blue';
        c.fillRect(
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
    }
}

const player = new Player()
const platforms = [
    new Platform({
        x: 200,
        y: 100
    }), 
    new Platform({
        x: 500,
        y: 200
    }),
    // new Platform({
    //     x: 800,
    //     y: 380
    // })
]

const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}

//  tracks screen scrolling from left to right
let scrollOffset = 0;

function animate() {
    // recall function
    requestAnimationFrame(animate)
    // removes draw from prev postion
    c.clearRect(0, 0, canvas.width, canvas.height);
    // update player position
    player.update();

    // draw platform
    platforms.forEach(platform => {
        platform.draw();
    })

    // If right or left keys are pressed move right or left in 5px
    if (keys.right.pressed && player.position.x < 400) {
        player.velocity.x = 5;
    } else if (keys.left.pressed && player.position.x > 100) {
        player.velocity.x = -5;
    } else {
        player.velocity.x = 0;

        if (keys.right.pressed) {
            scrollOffset += 5;
            platforms.forEach(platform => {
                platform.position.x -= 5;
            })
        } else if (keys.left.pressed) {
            scrollOffset -= 5;
            platforms.forEach(platform => {
                platform.position.x += 5;
            })
        }
        // console.log(scrollOffset);
    }

    // Player collision with platforms
    platforms.forEach(platform => {
        if (boxCollision(player, platform)){
            player.velocity.y = 0;
            // player.velocity.x = 0;
        }
    });
    if (scrollOffset > 2000) {
        console.log(' you win!');
        player.velocity.y = 0;
        player.velocity.x = 0;
    }
}

// collision detection
function boxCollision(obj1, obj2) {
    if (obj1.position.x + obj1.width + obj1.velocity.x >= obj2.position.x &&
        obj1.position.x <= obj2.position.x + obj2.width &&
        obj1.position.y + obj1.height + obj1.velocity.y >= obj2.position.y &&
        obj1.position.y <= obj2.position.y + obj2.height) {
        return true
    }
}

// function call animate
animate();


// Event listener for pressing down on a key 
addEventListener('keydown', ({ keyCode }) => {
    switch (keyCode) {
        // left key: A
        case 65:
            keys.left.pressed = true;
            break;
        // down key: S
        case 83:
            break;
        // right key: D
        case 68:
            keys.right.pressed = true;
            break;
        // up key: W
        case 87:
            player.velocity.y -= 20
            break;
    }
});

// Event listener for releasing off of a key 
addEventListener('keyup', ({ keyCode }) => {
    switch (keyCode) {
        // left key: A
        case 65:
            keys.left.pressed = false;
            break;
        // down key: S
        case 83:
            break;
        // right key: D
        case 68:
            keys.right.pressed = false;
            break;
        // up key: W
        case 87:
            player.velocity.y = 0
            break;
    }
});