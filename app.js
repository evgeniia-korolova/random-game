game();

function game() {
  let isPause = false;
    let animationId = null;
    const speed = 3;

    // console.log(window); 
    
    // window.innerHeight = 834
    // window.innerWidth = 1044


  const car = document.querySelector('.car');
    const trees = document.querySelectorAll('.tree');
    
    const treesCoords = [];

    for (let i = 0; i < trees.length; i++) {
      const tree = trees[i];
      const coordsTree = getCoords(tree);

      treesCoords.push(coordsTree);
    }

    console.log(treesCoords);

   
    
    // console.log(coords.y);
    


  animationId = requestAnimationFrame(startGame);

  function startGame() {
    // console.log(animationId);
    animationId = requestAnimationFrame(startGame);
    treesAnimation();
  }

  // ----------------trees animation ----------------

    function treesAnimation() {
      for (let i = 0; i < trees.length; i++) {
        const tree = trees[i];
        const coords = treesCoords[i];

        let newYCoord = coords.y + speed;

        if (newYCoord > window.innerHeight) {
          newYCoord = -tree.height;
        }

        treesCoords[i].y = newYCoord;
        tree.style.transform = `translate(${coords.x}px, ${newYCoord}px)`;
      }
    }

  // --------------get tree coordinates-----------------

  function getCoords(element) {
    const matrix = window.getComputedStyle(element).transform;
    const array = matrix.split(',');
    const y = array[array.length - 1];
    const x = array[array.length - 2];

    const numericY = parseFloat(y);
    const numericX = parseFloat(x);

      return { y : numericY, x : numericX };
  }

  // -----------------------------------------------

  const gameButton = document.querySelector('.game-button');
  gameButton.addEventListener('click', () => {
    isPause = !isPause;
    if (isPause) {
      cancelAnimationFrame(animationId);
      gameButton.children[0].style.display = 'none';
      gameButton.children[1].style.display = 'initial';
    } else {
        animationId = requestAnimationFrame(startGame);
      gameButton.children[0].style.display = 'initial';
      gameButton.children[1].style.display = 'none';
    }
  });
}
