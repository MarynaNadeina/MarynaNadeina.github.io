document.addEventListener("DOMContentLoaded", (event) => {
  let startButton = document.getElementById('buttonStart');
  let stopButton = document.getElementById('buttonStop');
  const symbols = Array.from({ length: 40 }, (_, i) => i + 1);
  let reel = document.getElementById('reel');
  let isSpinning = false;
  let spin;

  initializeReel();

  //event listeners
  startButton.addEventListener('click', startReel);
  stopButton.addEventListener('click', stopReel);

  //create the reel with symbols
  function initializeReel() {
    reel.innerHTML = '';
    symbols.forEach(symbol => {
      let imgSrc = getSrc(symbol);
      const symbolElement = document.createElement('div');
      symbolElement.innerHTML = `
        <img src=${imgSrc} alt="img">
      `
      symbolElement.className = 'symbol';
      reel.appendChild(symbolElement);
    });
  }

  //start spin
  function startReel() {
    initializeReel();
    spin = verticalLoop(".symbol", 20000)
    spin.play();
    isSpinning = true;
    updateButtonStates();
  }

  //stop spin
  function stopReel() {
    spin.pause();

    if (isSpinning) {
      const randomIndex = Math.floor(Math.random() * 40);
      const displayedSymbols = [
        symbols[randomIndex],
        symbols[(randomIndex + 1) % 40],
        symbols[(randomIndex + 2) % 40]
      ];

      reel.innerHTML = '';
      displayedSymbols.forEach(symbol => {
        let imgSrc = getSrc(symbol);
        const symbolElement = document.createElement('div');
        symbolElement.innerHTML = `
        <img src=${imgSrc} alt="img">
      `
        symbolElement.className = 'symbol';
        reel.appendChild(symbolElement);
      });
    }

    isSpinning = false;
    updateButtonStates();
  }

  //spin GSAP function
  function verticalLoop(elements, speed) {
    elements = gsap.utils.toArray(elements);

    let firstBounds = elements[0].getBoundingClientRect(),
      lastBounds = elements[elements.length - 1].getBoundingClientRect(),
      top = firstBounds.top - firstBounds.height - Math.abs(elements[1].getBoundingClientRect().top - firstBounds.bottom),
      bottom = lastBounds.top,
      distance = bottom - top,
      duration = Math.abs(distance / speed),
      tl = gsap.timeline({ repeat: -1 }),
      plus = speed < 0 ? "-=" : "+=",
      minus = speed < 0 ? "+=" : "-=";
    elements.forEach(el => {
      let bounds = el.getBoundingClientRect(),
        ratio = Math.abs((bottom - bounds.top) / distance);
      if (speed < 0) {
        ratio = 1 - ratio;
      }
      tl.to(el, {
        y: plus + distance * ratio,
        duration: duration * ratio,
        ease: "none"
      }, 0);
      tl.fromTo(el, {
        y: minus + distance
      }, {
        y: plus + (1 - ratio) * distance,
        ease: "none",
        duration: (1 - ratio) * duration,
        immediateRender: false
      }, duration * ratio)
    });
    return tl;
  }

  //get images src depend on index number
  function getSrc(i) {
    let src = "";
    if (i === 1 || i === 23 || i === 24 || i === 25) {
      src = "./img/square_full.png";
    } else if (i === 2 || i === 22) {
      src = "./img/circle.png";
    } else if (i === 3 || i === 10 || i === 19 || i === 20 || i === 21 || i === 26 || i === 35 || i === 30) {
      src = "./img/hexagon_full.png";
    } else if (i === 4 || i === 9 || i === 11 || i === 18 || i === 34 || i === 36 || i === 38 || i === 39 || i === 40) {
      src = "./img/triangle.png";
    } else if (i === 5 || i === 12 || i === 27 || i === 28 || i === 29 || i === 33) {
      src = "./img/star.png";
    } else if (i === 6 || i === 13 || i === 32) {
      src = "./img/square.png";
    } else if (i === 7 || i === 14 || i === 15 || i === 16 || i === 31) {
      src = "./img/circle_full.png";
    } else if (i === 8 || i === 17 || i === 37) {
      src = "./img/hexagon.png";
    }
    return src;
  }

  //update buttons state
  function updateButtonStates() {
    startButton.disabled = isSpinning;
    stopButton.disabled = !isSpinning;
  }
});
