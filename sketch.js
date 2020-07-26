const MAXITER = 360;
const MINX = -2.00, MAXX = 1.00;
const MINY = -1.25, MAXY = 1.25;

let minx = MINX, maxx = MAXX;
let miny = MINY, maxy = MAXY;

function mousePressed() {
	const px = mouseX;
	const py = mouseY;
	if (px >= 0 && px < width && py >= 0 && py < height) {
		if (mouseButton === CENTER) {
			minx = MINX; maxx = MAXX;
			miny = MINY; maxy = MAXY;
			mandelbrot();
			return false;
		}
		const a = map(px, 0, width, minx, maxx);
		const b = map(py, 0, height, miny, maxy);
		const len = Math.hypot(a, b);
		if (len < 2) {
			let zoom = 10;
			if (mouseButton === LEFT)
				zoom = 1 / zoom;
			const w = (maxx - minx) * zoom / 2;
			const h = (maxy - miny) * zoom / 2;
			minx = a - w;
			maxx = a + w;
			miny = b - h;
			maxy = b + h;
			mandelbrot();
			return false;
		}
	}
}

function mandelbrot() {
	loadPixels();
	let pix = 0;
	for (let py = 0; py < height; ++py) {
		const cb = map(py, 0, height, miny, maxy);
		for (let px = 0; px < width; ++px) {
			const ca = map(px, 0, width, minx, maxx);

			let i = 0;
			let a = ca, b = cb;
			let len = Math.hypot(a, b);
			const alph = max(0, map(len, 0, 2, 255, 10));
			while (i < MAXITER && len <= 2) {
				const a1 = a*a - b*b + ca;
				const b1 = 2*a*b + cb;
				if (a1 == a && b1 == b) {
					i = MAXITER;
				} else {
					a = a1;
					b = b1;
					len = Math.hypot(a, b);
					++i;
				}
			}

			if (i == 0 || i == MAXITER) {
				pixels[pix] = 0;
				pixels[pix + 1] = 0;
				pixels[pix + 2] = 0;
			} else {
				const c = color(i, 100, 100, 1);
				pixels[pix] = red(c);
				pixels[pix + 1] = green(c);
				pixels[pix + 2] = blue(c);
			}
			pixels[pix + 3] = alph;
			pix += 4;
		}
	}
	updatePixels();
}

function setup() {
	pixelDensity(1);
	createCanvas(900, 750);
	colorMode(HSB);
	mandelbrot();
}
