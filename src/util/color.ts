export const writePixel = (image: ImageData, x: number, y: number, color: number) => {
	image.data[4 * (y * image.width + x)] = color >>> 16;
	image.data[4 * (y * image.width + x) + 1] = (color >>> 8) % 0x100;
	image.data[4 * (y * image.width + x) + 2] = color % 0x100;
	image.data[4 * (y * image.width + x) + 3] = 255;
}