"use client";

export async function mergePngUrlsToSvg(urls = [], xOffsets = []) {
  if (!Array.isArray(urls) || urls.length === 0) return null;

  const loadImage = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

  const images = await Promise.all(urls.map(loadImage));

  const width = images.reduce((sum, img) => sum + img.width, 0);
  const height = Math.max(...images.map((img) => img.height));

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = height;

  images.forEach((img, index) => {
    const x = typeof xOffsets[index] === "number" ? xOffsets[index] : 0;

    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");
    tempCanvas.width = img.width + 50;
    tempCanvas.height = img.height;

    tempCtx.drawImage(img, 0, 0);

    const imageData = tempCtx.getImageData(0, 0, img.width, img.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (r >= 200 && g >= 200 && b >= 200) {
        data[i + 3] = 0;
      }
    }
    tempCtx.putImageData(imageData, 0, 0);

    ctx.drawImage(tempCanvas, x, 0);
  });

  const dataUrl = canvas.toDataURL();
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <image xlink:href="${dataUrl}" width="${width}" height="${height}" />
  </svg>`;

  return svg;
}
