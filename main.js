const inputImages = document.querySelectorAll(".inputImage");
const outputImage = document.querySelector(".outputImage");
let frame = 0;
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
const blurMax = 30;
const imageProps = [];
window.addEventListener("scroll", handleScroll);
window.addEventListener("mousemove", handleMousemove);
let scrollY = window.scrollY;
function handleScroll(e) {
  scrollY = window.scrollY;
  // update()
}
function handleMousemove(e) {
  mouseX = e.pageX;
  mouseY = e.pageY;
}
function handleMouseenter(e, i) {
  imageProps[i].isHovered = true;
}
function handleMouseleave(e, i) {
  imageProps[i].isHovered = false;
}
initialize();

function initialize() {
  setTimeout(() => {
    document.body.classList.add("isInitialized");
  }, 100);
  inputImages.forEach((image, i) => {
    const rect = image.getBoundingClientRect();
    setTimeout(() => {
      image.style.opacity = 1;
      imageProps[i] = {
        startRho:
          (0.35 + Math.random() * 0.75) *
          ((window.innerHeight + window.innerWidth) / 4),
        startPhi: Math.random() * Math.PI * 2,
        startTheta: (i / inputImages.length) * Math.PI * 6,
        startSpeed: (i / inputImages.length) * 4,
        frame: 0,
        focalDepth: 0,
        isHovered: false
      };
    }, i * 300);
    image.addEventListener("mouseenter", (e) => {
      handleMouseenter(e, i);
    });
    image.addEventListener("mouseleave", (e) => {
      handleMouseleave(e, i);
    });
  });
  update();
}

function update() {
  imageProps.forEach((imageProp, i) => {
    const image = inputImages[i];
    if (!imageProps[i].isHovered) {
      imageProp.frame += 1;
      imageProp.focalDepth += 0.01;
    }
    const rect = image.getBoundingClientRect();
    // const x = rect.left + rect.width / 2
    // const y = rect.top + rect.height / 2
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const theta =
      Number(imageProp.startTheta) +
      (imageProp.frame + imageProp.startSpeed) * 0.001;
    const x = centerX + Math.cos(theta) * imageProp.startRho;
    const z = Math.cos(imageProp.startPhi) * imageProp.startRho;
    const scale = 0.6 + Math.abs(z / 400);
    const focalDist = 0.5 * Math.cos(imageProp.focalDepth);
    const y =
      centerY + Math.sin(theta) * imageProp.startRho - scrollY * scale * 0.5;
    const dist =
      Math.sqrt(
        Math.pow(Math.abs(mouseX - x), 2) + Math.pow(Math.abs(mouseY - y), 2)
      ) / window.innerWidth;
    const blur = Math.max(0, focalDist * blurMax);
    const opacity = 1 - blur / blurMax;
    // image.style.opacity = opacity;
    image.style.filter = `blur(${blur}px)`;
    // image.style.transform = `perspective(100vw) rotateY(${-dist * 10}deg) scale(${1 + dist * 0.2})`;
    image.style.transform = `perspective(100vw) translate3d(${
      x - rect.width / 2
    }px, ${y - rect.height / 2}px, ${0}px) scale(${scale})`;
    if (opacity < 0) {
      image.style.opacity = 0;
      image.style.filter = "none";
    }
  });
  requestAnimationFrame(update);
}
