let video;
let videoLoaded;

const fr = 30;

let videoScaleDownFactor = 10;
let initialVideoWidth;
let initialVideoHeight;
let showVideo;

const sliders = [];
const initialSliderValues = [
  0.12, 0.296, 0.488, 0.529, 0.632, 0.707, 0.839, 0.922, 1,
];
let sliderText;

let videoScaleSlider;
let videoScaleSliderText;
const videoScaleSliderMin = 1;
const videoScaleSliderMax = 40;

let imageTiles = [];

function setup() {
  frameRate(fr);

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

  loadTiles();
  setupSliders();
}

function draw() {
  if (!videoLoaded) return;

  try {
    video.loadPixels();
  } catch (e) {
    console.error(`Error loading video pixels: ${e}`);
  }

  background(255);
  video.hide();

  for (let j = 0; j < video.height; j = j + 1) {
    for (let i = 0; i < video.width; i = i + 1) {
      const avgNormalized = getGreyScaleNormalized(i, j);

      const tileIndex = getTileIndexFromGrayScale(avgNormalized);
      const img = getTileImgFromIndex(tileIndex, i, j);

      image(
        img,
        i * videoScaleDownFactor,
        j * videoScaleDownFactor,
        videoScaleDownFactor,
        videoScaleDownFactor
      );
    }
  }
}

function keyPressed() {
  if (key == " ") {
    saveCanvas(`study_of_perception_${new Date().getTime()}`, "png");
  }
}

function loadTiles() {
  imageTiles.push([loadImage("images/0.svg")]);
  imageTiles.push([loadImage("images/1.1.svg"), loadImage("images/1.2.svg")]);
  imageTiles.push([loadImage("images/2.1.svg"), loadImage("images/2.2.svg")]);
  imageTiles.push([loadImage("images/3.1.svg"), loadImage("images/3.2.svg")]);
  imageTiles.push([loadImage("images/4.1.svg"), loadImage("images/4.2.svg")]);
  imageTiles.push([loadImage("images/5.1.svg"), loadImage("images/5.2.svg")]);
  imageTiles.push([loadImage("images/6.1.svg"), loadImage("images/6.2.svg")]);
  imageTiles.push([loadImage("images/7.svg")]);
}

function getGrayScaleColor(r, g, b) {
  // Gray scale based on linear luminance for each color channel:
  // https://en.wikipedia.org/wiki/Grayscale
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getGreyScaleNormalized(i, j) {
  const pixelIndex = (i + j * video.width) * 4;
  const r = video.pixels[pixelIndex + 0];
  const g = video.pixels[pixelIndex + 1];
  const b = video.pixels[pixelIndex + 2];

  const greyScaleColor = getGrayScaleColor(r, g, b);
  const greyScaleColorNormalized = map(greyScaleColor, 0, 255, 0, 1);

  return greyScaleColorNormalized;
}

function getSliderText() {
  let sliderValues = [];

  sliders.forEach((slider) => {
    sliderValues.push(slider.value());
  });

  return `[${sliderValues.join(", ")}]`;
}

function setupSliders() {
  for (let i = 0; i < imageTiles.length; i++) {
    slider = createSlider(0, 1, initialSliderValues[i], 0.001);

    slider.input(() => {
      updateSliderText();
    });

    sliders.push(slider);
  }

  sliderText = createP();
  updateSliderText();

  videoScaleSlider = createSlider(
    videoScaleSliderMin,
    videoScaleSliderMax,
    videoScaleDownFactor,
    1
  );
  videoScaleSliderText = createP();
  updateVideoScaleSliderText();

  videoScaleSlider.input(() => {
    videoScaleDownFactor = videoScaleSlider.value();
    video.size(
      initialVideoWidth / videoScaleDownFactor,
      initialVideoHeight / videoScaleDownFactor
    );

    updateVideoScaleSliderText();
  });
}

function updateSliderText() {
  sliderText.html(`GreyScale thresholds: ${getSliderText()}`);
}

function updateVideoScaleSliderText() {
  videoScaleSliderText.html(`video scale: ${videoScaleSlider.value()}`);
}

function getTileIndexFromGrayScale(grayScaleValue) {
  for (let i = 0; i < imageTiles.length - 1; i++) {
    let slider = sliders[i];
    if (grayScaleValue < slider.value()) {
      return i;
    }
  }

  return imageTiles.length - 1;
}

function getTileImgFromIndex(tileIndex, i, j) {
  const imgSet = imageTiles[tileIndex];

  if (imgSet.length == 1) {
    return imgSet[0];
  }

  const [img1, img2] = imgSet;

  if ((i + j) % 2 == 0) {
    return img1;
  }

  return img2;
}
