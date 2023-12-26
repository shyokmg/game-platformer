import platform from '../img/platform.png';
import hills from '../img/hills.png';
import background from '../img/background.png';

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

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

let player = new Player()
let platforms = [
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
  })
]

let genericObjects = [
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
    player.velocity.x = 5;
  } else if (keys.left.pressed && player.position.x > 100) {
    player.velocity.x = -5;
  } else {
    player.velocity.x = 0;

    if (keys.right.pressed) {
      scrollOffset += 5;
      platforms.forEach(platform => {
        platform.position.x -= 5;
      });
      // Paralax effect moving to the right
      genericObjects.forEach(genericObject => {
        genericObject.position.x -= 3;
      });

    } else if (keys.left.pressed) {
      scrollOffset -= 5;
      platforms.forEach(platform => {
        platform.position.x += 5;
      });
      // Paralax effect moving to the left
      genericObjects.forEach(genericObject => {
        genericObject.position.x += 3;
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
  // Win condition
  if (scrollOffset > 2000) {
    console.log(' you win!');
  }

  if (player.position.y > canvas.height) {
    console.log('you lose');
    init();
  }
}

// collision detection
function boxCollision(obj1, obj2) {
  if (obj1.position.x + obj1.width >= obj2.position.x &&
    obj1.position.x <= obj2.position.x + obj2.width &&
    obj1.position.y + obj1.height + obj1.velocity.y >= obj2.position.y) {
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