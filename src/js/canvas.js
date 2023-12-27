// import game assets for platform and background
import platform from '../img/platform.png';
import platformSmallTall from '../img/platformSmallTall.png';
import hills from '../img/hills.png';
import background from '../img/background.png';

// Import sprite animation for Player
import spriteRunLeft from '../img/spriteRunLeft.png';
import spriteRunRight from '../img/spriteRunRight.png';
import spriteStandLeft from '../img/spriteStandLeft.png';
import spriteStandRight from '../img/spriteStandRight.png';

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

// set 16:9 aspect ratio for game screen
canvas.width = 1024;
canvas.height = 576;

const gravity = 0.5;


class Player {
  constructor() {
    this.speed = 10
    this.position = {
      x: 100,
      y: 100
    }

    this.velocity = {
      x: 0,
      y: 0
    }
    this.width = 66;
    this.height = 150;
    this.image = createImage(spriteStandRight);
    this.frames = 0;
    this.sprites = {
      stand: {
        right: createImage(spriteStandRight),
        left: createImage(spriteStandLeft),
        cropWidth: 177,
        width: 66
      },
      run: {
        right: createImage(spriteRunRight),
        left: createImage(spriteRunLeft),
        cropWidth: 341,
        width: 127.875
      }
    }

    this.currentSprite = this.sprites.stand.right;
    this.currentCropWidth = 177
  }

  draw() {
    // c.fillStyle = 'red';
    // c.fillRect(
    //   this.position.x,
    //   this.position.y,
    //   this.width,
    //   this.height
    // );
    c.drawImage(
      this.currentSprite,
      this.currentCropWidth * this.frames, // x position, start from width of character * the frames
      0,                                   // y position
      this.currentCropWidth,               // width per frame
      400,                                 // height of sprite/ frame
      this.position.x,
      this.position.y,
      this.width,
      this.height
    )
  }

  update() {
    this.frames++;
    if (this.frames > 59 && 
      (this.currentSprite === this.sprites.stand.right ||
        this.currentSprite === this.sprites.stand.left)) {
      this.frames = 0;
    } else if (this.frames > 29 && 
      (this.currentSprite === this.sprites.run.right || 
        this.currentSprite === this.sprites.run.left )) {
      this.frames = 0;
    }
    this.draw();
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity;
    }
  }
}

class Platform {
  constructor({ x, y, image }) {
    this.position = {
      x, // same as x : x
      y  // same as y : y
    };
    this.image = image;
    this.width = image.width;
    this.height = image.height;
  }

  draw() {
    c.drawImage(
      this.image,
      this.position.x,
      this.position.y)
  }
}

class GenericObject {
  constructor({ x, y, image }) {
    this.position = {
      x, // same as x : x
      y  // same as y : y
    };
    this.image = image;
    this.width = image.width;
    this.height = image.height;
  }

  draw() {
    c.drawImage(
      this.image,
      this.position.x,
      this.position.y)
  }
}

function createImage(imageSrc) {
  const image = new Image()
  image.src = imageSrc;
  return image;
}

let platformImage = createImage(platform);
let platformSmallTallImage = createImage(platformSmallTall);
let player = new Player()
let platforms = []
let genericObjects = []

let lastKey

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

function init() {
  platformImage = createImage(platform);

  player = new Player()
  platforms = [
    new Platform({
      x: platformImage.width * 4 + 300 - 2 + platformImage.width - platformSmallTallImage.width,
      y: 270,
      image: createImage(platformSmallTall)
    }),
    new Platform({
      x: -1,
      y: 470,
      image: platformImage
    }),
    new Platform({
      x: platformImage.width - 2,
      y: 470,
      image: platformImage
    }),
    new Platform({
      x: platformImage.width * 2 + 100,
      y: 470,
      image: platformImage
    }),
    new Platform({
      x: platformImage.width * 3 + 300,
      y: 470,
      image: platformImage
    }),
    new Platform({
      x: platformImage.width * 4 + 300 - 2,
      y: 470,
      image: platformImage
    }),
    new Platform({
      x: platformImage.width * 5 + 700 - 2,
      y: 470,
      image: platformImage
    })
  ]

  genericObjects = [
    new GenericObject({
      x: -1,
      y: -1,
      image: createImage(background)
    }),
    new GenericObject({
      x: -1,
      y: -1,
      image: createImage(hills)
    })
  ]

  //  tracks screen scrolling from left to right
  scrollOffset = 0;
}


function animate() {
  // recall function
  requestAnimationFrame(animate)
  // removes draw from prev postion
  c.fillStyle = 'white'
  c.fillRect(0, 0, canvas.width, canvas.height);

  genericObjects.forEach(genericObject => {
    genericObject.draw()
  })

  // draw platform
  platforms.forEach(platform => {
    platform.draw();
  });
  // update player position
  player.update();

  // If right or left keys are pressed move right or left in 5px
  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = player.speed;
  } else if ((keys.left.pressed && player.position.x > 100) ||
    (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)) {
    player.velocity.x = -player.speed;
  } else {
    player.velocity.x = 0;

    if (keys.right.pressed) {
      scrollOffset += player.speed;
      platforms.forEach(platform => {
        platform.position.x -= player.speed;
      });
      // Parallax effect moving to the right
      genericObjects.forEach(genericObject => {
        genericObject.position.x -= player.speed * 0.66;
      });

    } else if (keys.left.pressed && scrollOffset > 0) {
      scrollOffset -= player.speed;
      platforms.forEach(platform => {
        platform.position.x += player.speed;
      });
      // Parallax effect moving to the left
      genericObjects.forEach(genericObject => {
        genericObject.position.x += player.speed * 0.66;
      })
    }
    // console.log(scrollOffset);
  }

  // Player collision with platforms
  platforms.forEach(platform => {
    if (boxCollision(player, platform)) {
      player.velocity.y = 0;
      // player.velocity.x = 0;
    }
  });

  // Sprite switching condition
  if (keys.right.pressed && lastKey === 'right' && 
  player.currentSprite !== player.sprites.run.right) {
    player.frames = 1;
    player.currentSprite = player.sprites.run.right;
    player.currentCropWidth = player.sprites.run.cropWidth;
    player.width = player.sprites.run.width
  } else if (keys.left.pressed && lastKey === 'left' &&
  player.currentSprite !== player.sprites.run.left) {
    player.currentSprite = player.sprites.run.left;
      player.currentCropWidth = player.sprites.run.cropWidth;
      player.width = player.sprites.run.width
  } else if (!keys.left.pressed && lastKey === 'left' &&
  player.currentSprite !== player.sprites.stand.left) {
    player.currentSprite = player.sprites.stand.left;
      player.currentCropWidth = player.sprites.stand.cropWidth;
      player.width = player.sprites.stand.width
  } else if (!keys.right.pressed && lastKey === 'right' &&
  player.currentSprite !== player.sprites.stand.right) {
    player.currentSprite = player.sprites.stand.right;
      player.currentCropWidth = player.sprites.stand.cropWidth;
      player.width = player.sprites.stand.width
  }
  // Win condition
  if (scrollOffset > platformImage.width * 5 + 300 - 2) {
    console.log(' you win!');
  }

  if (player.position.y > canvas.height) {
    console.log('you lose');
    init();
  }
}

// collision detection
function boxCollision(obj1, obj2) {
  if (obj1.position.y + obj1.height <= obj2.position.y &&
    obj1.position.y + obj1.height + obj1.velocity.y >= obj2.position.y &&
    obj1.position.x + obj1.width >= obj2.position.x &&
    obj1.position.x <= obj2.position.x + obj2.width) {
    return true;
  }
}

init();
// function call animate
animate();


// Event listener for pressing down on a key 
addEventListener('keydown', ({ keyCode }) => {
  switch (keyCode) {
    // left key: A
    case 65:
      keys.left.pressed = true;
      lastKey = 'left'
      break;
    // down key: S
    case 83:
      break;
    // right key: D
    case 68:
      keys.right.pressed = true;
      lastKey = 'right'

      break;
    // up key: W
    case 87:
      player.velocity.y -= 15
      break;
  }
});

// Event listener for releasing off of a key 
addEventListener('keyup', ({ keyCode }) => {
  switch (keyCode) {
    // left key: A
    case 65:
      keys.left.pressed = false;
      // player.currentSprite = player.sprites.stand.left;
      // player.currentCropWidth = player.sprites.stand.cropWidth;
      // player.width = player.sprites.stand.width
      // break;
    // down key: S
    case 83:
      break;
    // right key: D
    case 68:
      keys.right.pressed = false;
      // player.currentSprite = player.sprites.stand.right;
      // player.currentCropWidth = player.sprites.stand.cropWidth;
      // player.width = player.sprites.stand.width
      break;
    // up key: W
    case 87:
      break;
  }
});