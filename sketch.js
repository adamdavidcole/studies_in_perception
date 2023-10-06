// Video ASCII with scaling
// Marc Duiker, May 2022
// https://twitter.com/marcduiker
//
// Move mouse or tap in X direction to change the ASCII scaling.
//
// Based on the excellent tutorial by The Coding Train / Daniel Shiffman, https://thecodingtrain.com/CodingChallenges/166-ascii-image.html, https://youtu.be/55iwMYv8tGI

const density = "∎@$=+-. ";

let video;
let asciiDiv;
let videoLoaded;

const videoScaleDownFactor = 10;
let initialVideoWidth;
let initialVideoHeight;
let showVideo;

const maxStep = 10;
const minFontSize = 6;
const maxFontSize = minFontSize * maxStep;

const imageTiles = [];
const tileCount = 9;

const sliders = [];
const initialSliderValues = [
  0.12, 0.296, 0.488, 0.529, 0.632, 0.707, 0.839, 0.922, 1,
];
let sliderText;

let alternateImageTile1;
let alternateImageTile3;

function setup() {
  videoLoaded = false;
  showVideo = false;

  video = createCapture(VIDEO, () => {
    initialVideoWidth = video.width;
    initialVideoHeight = video.height;
    console.log("initial video size: ", initialVideoWidth, initialVideoHeight);

    video.size(
      initialVideoWidth / videoScaleDownFactor,
      initialVideoHeight / videoScaleDownFactor
    );

    createCanvas(initialVideoWidth, initialVideoHeight);
    videoLoaded = true;
  });
  console.log(video.width, video.height);
  // video.size(180, 110);
  createP("Move mouse or tap in X direction to change the ASCII scaling.");
  asciiDiv = createDiv();

  setupSliders();

  imageTiles.push(loadImage("images/0.png"));
  imageTiles.push(loadImage("images/1.1.png"));
  // imageTiles.push(loadImage("images/1.2.png"));
  imageTiles.push(loadImage("images/2.png"));
  imageTiles.push(loadImage("images/3.png"));
  imageTiles.push(loadImage("images/4.png"));
  imageTiles.push(loadImage("images/5.png"));
  imageTiles.push(loadImage("images/6.png"));
  imageTiles.push(loadImage("images/7.png"));
  imageTiles.push(loadImage("images/8.png"));

  alternateImageTile1 = loadImage("images/1.2.png");
  alternateImageTile2 = loadImage("images/2.1.png");
  alternateImageTile3 = loadImage("images/3.1.png");
}

function draw() {
  if (!videoLoaded) return;

  video.loadPixels();
  video.hide();
  // let asciiImage = "";

  // const stepSize = floor(map(mouseX, 0, windowWidth, 1, maxStep));
  const stepSize = 1;
  for (let j = 0; j < video.height; j = j + stepSize) {
    for (let i = 0; i < video.width; i = i + stepSize) {
      const pixelIndex = (i + j * video.width) * 4;
      const r = video.pixels[pixelIndex + 0];
      const g = video.pixels[pixelIndex + 1];
      const b = video.pixels[pixelIndex + 2];
      const avg = getGrayScaleColor(r, g, b);
      const avgNormalized = map(avg, 0, 255, 0, 1);

      // const len = density.length;
      // const charIndex = floor(map(avg, 0, 255, 0, len));
      const charIndex = getTileIndexFromGrayScale(avgNormalized);

      let img = imageTiles[charIndex];

      if (charIndex == 1) {
        if ((i + j) % 2 == 0) {
          img = alternateImageTile1;
        }
      }

      if (charIndex == 2) {
        if ((i + j) % 2 == 0) {
          img = alternateImageTile2;
        }
      }

      if (charIndex == 3) {
        if ((i + j) % 2 == 0) {
          img = alternateImageTile3;
        }
      }

      image(
        img,
        i * videoScaleDownFactor,
        j * videoScaleDownFactor,
        videoScaleDownFactor,
        videoScaleDownFactor
      );

      // const c = density.charAt(charIndex);
      // if (c == " ") asciiImage += "&nbsp;";
      // else asciiImage += c;
    }

    // asciiImage += "<br/>";
  }

  // const pointSize = map(stepSize, 1, maxStep, minFontSize, maxFontSize);
  // const lineHeightSize = pointSize * 0.75;
  // asciiDiv.style("font-size", `${pointSize}pt`);
  // asciiDiv.style("line-height", `${lineHeightSize}pt`);
  // asciiDiv.html(asciiImage);

  // if (mouseIsPressed) {
  //   let c = video.get(0, 0, width, height);
  //   image(
  //     c,
  //     0,
  //     0,
  //     initialVideoWidth * videoScaleDownFactor,
  //     initialVideoHeight * videoScaleDownFactor
  //   );
  // }
}

function mousePressed() {
  //saveCanvas('video-ascii', 'jpg');
}

function getGrayScaleColor(r, g, b) {
  // Gray scale based on linear luminance for each color channel:
  // https://en.wikipedia.org/wiki/Grayscale
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getSliderText() {
  let sliderValues = [];

  sliders.forEach((slider) => {
    sliderValues.push(slider.value());
  });

  return `[${sliderValues.join(", ")}]`;
}

function setupSliders() {
  for (let i = 0; i < tileCount; i++) {
    slider = createSlider(0, 1, initialSliderValues[i], 0.001);

    slider.input(() => {
      updateSliderText();
    });

    sliders.push(slider);
  }

  sliderText = createP(getSliderText());
}

function updateSliderText() {
  sliderText.html(getSliderText());
}

function getTileIndexFromGrayScale(grayScaleValue) {
  for (let i = 0; i < tileCount - 1; i++) {
    let slider = sliders[i];
    if (grayScaleValue < slider.value()) {
      return i;
    }
  }

  return tileCount - 1;
}
