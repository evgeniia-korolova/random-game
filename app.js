game();

function game() {
  let isPause = false;
  let animationId = null;
  let speed = 3;
  let score = 0;

  const gameScore = document.querySelector('.game-score');
  const backdrop = document.querySelector('.backdrop');
  const restartButton = document.querySelector('#restart-button');
  const restartButton2 = document.querySelector('#restart-button2');
   const audio = document.querySelector('.audio');

  // console.log(window);

  // window.innerHeight = 834
  // window.innerWidth = 1044

  const car = document.querySelector('.car');

  const carInfo = {
    ...createElementInfo(car),
    move: {
      top: null,
      bottom: null,
      left: null,
      right: null,
    },
  };

  const road = document.querySelector('.road');
  const roadWidth = road.clientWidth / 2;
  const roadHeight = road.clientHeight;

  const coin = document.querySelector('.coin');
  const coinInfo = createElementInfo(coin);

  const arrow = document.querySelector('.arrow');

  const arrowInfo = createElementInfo(arrow);

  // console.log(arrowInfo.width);

  const danger = document.querySelector('.danger');
  const dangerInfo = createElementInfo(danger);

  function createElementInfo(element) {
    return {
      coords: getCoords(element),
      height: element.clientHeight,
      width: element.clientWidth / 2,
      visible: true,
    };
  }

  const trees = document.querySelectorAll('.tree');
  const treesCoords = [];

  for (let i = 0; i < trees.length; i++) {
    const tree = trees[i];
    const coordsTree = getCoords(tree);

    treesCoords.push(coordsTree);
  }

  // логика движения машины : keydown, keyup, keypress

  document.addEventListener('keydown', (event) => {
    if (isPause) {
      return;
    }
    const code = event.code;
    // WASD
    if (code === 'ArrowUp' && carInfo.move.top === null) {
      if (carInfo.move.bottom) {
        return;
      }
      carInfo.move.top = requestAnimationFrame(carMoveToTop);
    } else if (code === 'ArrowDown' && carInfo.move.bottom === null) {
      if (carInfo.move.top) {
        return;
      }
      carInfo.move.bottom = requestAnimationFrame(carMoveToBottom);
    } else if (code === 'ArrowLeft' && carInfo.move.left === null) {
      if (carInfo.move.right) {
        return;
      }
      carInfo.move.left = requestAnimationFrame(carMoveToLeft);
    } else if (code === 'ArrowRight' && carInfo.move.right === null) {
      if (carInfo.move.left) {
        return;
      }
      carInfo.move.right = requestAnimationFrame(carMoveToRight);
    }
  });

  document.addEventListener('keyup', (event) => {
    const code = event.code;

    if (code === 'ArrowUp') {
      cancelAnimationFrame(carInfo.move.top);
      carInfo.move.top = null;
    } else if (code === 'ArrowDown') {
      cancelAnimationFrame(carInfo.move.bottom);
      carInfo.move.bottom = null;
    } else if (code === 'ArrowLeft') {
      cancelAnimationFrame(carInfo.move.left);
      carInfo.move.left = null;
    } else if (code === 'ArrowRight') {
      cancelAnimationFrame(carInfo.move.right);
      carInfo.move.right = null;
    }
  });

  function carMoveToTop() {
    const newY = carInfo.coords.y - 5;
    if (newY < 0) {
      return;
    }
    console.log(newY);
    carInfo.coords.y = newY;
    carMove(carInfo.coords.x, newY);
    carInfo.move.top = requestAnimationFrame(carMoveToTop);
  }

  function carMoveToBottom() {
    const newY = carInfo.coords.y + 5;

    console.log(roadHeight, newY + carInfo.height);
    if (newY + carInfo.height > roadHeight) {
      return;
    }
    carInfo.coords.y = newY;
    carMove(carInfo.coords.x, newY);
    carInfo.move.bottom = requestAnimationFrame(carMoveToBottom);
  }

  function carMoveToLeft() {
    const newX = carInfo.coords.x - 5;
    if (newX < -roadWidth + carInfo.width - 5) {
      return;
    }

    carInfo.coords.x = newX;
    carMove(newX, carInfo.coords.y);
    carInfo.move.left = requestAnimationFrame(carMoveToLeft);
  }

  function carMoveToRight() {
    const newX = carInfo.coords.x + 5;
    if (newX > roadWidth - carInfo.width + 5) {
      return;
    }
    carInfo.coords.x = newX;
    carMove(newX, carInfo.coords.y);
    carInfo.move.right = requestAnimationFrame(carMoveToRight);
  }

  function carMove(x, y) {
    car.style.transform = `translate(${x}px, ${y}px)`;
  }

  // ArrowUp, ArrowDown, ArrowLeft, ArrowRight

  // --------------------------------------
  animationId = requestAnimationFrame(startGame);

  function startGame() {
    elementAnimation(danger, dangerInfo, -250);
    audio.play();

    if (dangerInfo.visible && hasCollision(carInfo, dangerInfo)) {
      return finishGame();
    }
    // console.log(animationId);
    treesAnimation();
    elementAnimation(coin, coinInfo, -100);

    if (coinInfo.visible && hasCollision(carInfo, coinInfo)) {
      score++;
      gameScore.innerText = score;
      coin.style.display = 'none';
      coinInfo.visible = false;

      if (score % 3 === 0) {
        speed++;
      }
    }

    //   elementAnimation(arrow, arrowInfo, -600);

    animationId = requestAnimationFrame(startGame);
  }

  // ----------------trees animation ----------------

  function treesAnimation() {
    for (let i = 0; i < trees.length; i++) {
      const tree = trees[i];
      const coords = treesCoords[i];

      let newYCoord = coords.y + speed;

      if (newYCoord > window.innerHeight) {
        newYCoord = -trees[2].height;
      }

      treesCoords[i].y = newYCoord;
      tree.style.transform = `translate(${coords.x}px, ${newYCoord}px)`;
    }
  }
  // -----------------elements animation ----------------

  function elementAnimation(elem, elemInfo, elemInitialYCoord) {
    let newYCoord = elemInfo.coords.y + speed;
    let newXCoord = elemInfo.coords.x;

    if (newYCoord > window.innerHeight) {
      newYCoord = elemInitialYCoord;

      const direction = parseInt(Math.random() * 2);
      const maxXCoord = roadWidth + 1 - elemInfo.width;
      const randomXCoord = parseInt(Math.random() * maxXCoord);

      // if (direction === 0) { // Двигаем влево
      //     newXCoord = -randomXCoord;
      // }
      // else if (direction === 1) { // Двигаем вправо
      //     newXCoord = randomXCoord;
      // }

      elem.style.display = 'initial';
      elemInfo.visible = true;

      newXCoord = direction === 0 ? -randomXCoord : randomXCoord;
    }

    elemInfo.coords.y = newYCoord;
    elemInfo.coords.x = newXCoord;
    elem.style.transform = `translate(${newXCoord}px, ${newYCoord}px)`;
  }

  // -----------------coin animation -------------------

  // --------------get coordinates-----------------

  function getCoords(element) {
    const matrix = window.getComputedStyle(element).transform;
    const array = matrix.split(',');
    const y = array[array.length - 1];
    const x = array[array.length - 2];

    const numericY = parseFloat(y);
    const numericX = parseFloat(x);

    return { y: numericY, x: numericX };
  }

  // -----------------------------------------------

  function hasCollision(elem1Info, elem2Info) {
    const carYTop = elem1Info.coords.y - 30;
    const carYBottom = elem1Info.coords.y + elem1Info.height;

    const carXLeft = elem1Info.coords.x - elem1Info.width;
    const carXRight = elem1Info.coords.x + elem1Info.width;

    const coinYTop = elem2Info.coords.y;
    const coinYBottom = elem2Info.coords.y + elem2Info.height;

    const coinXLeft = elem2Info.coords.x - elem2Info.width;
    const coinXRight = elem2Info.coords.x + elem2Info.width;

    // console.log(carYTop);
    // console.log(coinYBottom);

    // y
    if (carYTop > coinYBottom || carYBottom < coinYTop) {
      return false;
    }

    // x
    if (carXLeft > coinXRight || carXRight < coinXLeft) {
      return false;
    }

    return true;
  }

  // -----------------------------------------------

  function cancelAnimations() {
    cancelAnimationFrame(animationId);
    cancelAnimationFrame(carInfo.move.top);
    cancelAnimationFrame(carInfo.move.bottom);
    cancelAnimationFrame(carInfo.move.left);
    cancelAnimationFrame(carInfo.move.right);
  }

  // -----------------------------------------------

  function finishGame() {
    cancelAnimations();

    gameScore.style.display = 'none';
    gameButton.style.display = 'none';
    backdrop.style.display = 'flex';
    const scoreText = backdrop.querySelector('.finish-text-score');
    scoreText.innerText = score;

    let result = JSON.parse(localStorage.getItem('result')) || [];
    let currentScore = { score: score };
    result.push(currentScore);
    localStorage.setItem('result', JSON.stringify(result));
    showStatistics();
    audio.pause();
  }

  // ------------------------------------------------

  const gameButton = document.querySelector('.game-button');
  gameButton.addEventListener('click', () => {
    isPause = !isPause;
    if (isPause) {
      cancelAnimations();
      audio.pause();
      gameButton.children[0].style.display = 'none';
      gameButton.children[1].style.display = 'initial';
    } else {
      animationId = requestAnimationFrame(startGame);
      gameButton.children[0].style.display = 'initial';
      gameButton.children[1].style.display = 'none';
    }
  });

  restartButton.addEventListener('click', () => {
    window.location.reload();
  });
  restartButton2.addEventListener('click', () => {
    window.location.reload();
  });



  let statistics = document.querySelector('.statistics');
  function showStatistics() {
    let list = JSON.parse(localStorage.getItem('result')).slice(-10);

    const listItem = document.createElement('ol');

    statistics.append(listItem);

    const olTag = document.querySelector('.statistics-list');
    // // let create li tags according to array length for list
    for (let i = 0; i < list.length; i++) {
      let liTag = `<li li-index="${i + 1}">               
                  ${list[i].score}            
                
              </li>`;
      olTag.insertAdjacentHTML('beforeend', liTag);
    }
  }

  const statisticsButton = document.querySelector('#statistics-button');

  statisticsButton.addEventListener('click', () => {
    statistics.style.display = 'flex';
    backdrop.style.display = 'none';
  });
}
