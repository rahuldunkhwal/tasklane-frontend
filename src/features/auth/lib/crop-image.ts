// Turns the crop region chosen in the cropper into a square image file to upload.
export type CropArea = { x: number; y: number; width: number; height: number };

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', () => reject(new Error('Could not load the image')));
    image.src = src;
  });
}

// `area` is in pixels of the source image (what react-easy-crop's onCropComplete gives).
// We draw just that square onto a fixed 512×512 canvas and export a JPEG blob.
export async function getCroppedBlob(src: string, area: CropArea, size = 512): Promise<Blob> {
  const image = await loadImage(src);
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is not supported');
  ctx.drawImage(image, area.x, area.y, area.width, area.height, 0, 0, size, size);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Could not crop the image'))),
      'image/jpeg',
      0.9,
    );
  });
}
