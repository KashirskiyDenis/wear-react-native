export default `
  let color;
	let canvasWidth;
	let canvasHeight;

	let canvas = document.getElementById('canvas');
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;

	let ctx = canvas.getContext('2d', {
		willReadFrequently: true,
	});

	let grd = ctx.createLinearGradient(0, canvasHeight / 2, canvasWidth, canvasHeight / 2);
	grd.addColorStop(0, "red");
	grd.addColorStop(0.16667, "yellow");
	grd.addColorStop(0.33333, "lime");
	grd.addColorStop(0.5, "cyan");
	grd.addColorStop(0.66667, "blue");
	grd.addColorStop(0.83333, "magenta");
	grd.addColorStop(1, "red");

	ctx.fillStyle = grd;
	ctx.fillRect(0, 0, canvasWidth, canvasHeight);

	grd = ctx.createLinearGradient(canvasWidth / 2, 0, canvasWidth / 2, canvasHeight);
	grd.addColorStop(0.6, "#ffffff00");
	grd.addColorStop(0.85, "#000000ff");

	ctx.fillStyle = grd;
	ctx.fillRect(0, 0, canvasWidth, canvasHeight);

	grd = ctx.createLinearGradient(canvasWidth / 2, 0, canvasWidth / 2, canvasHeight);
	grd.addColorStop(0.85, "#ffffff00");
	grd.addColorStop(1.0, "#ffffffff");

	ctx.fillStyle = grd;
	ctx.fillRect(0, 0.85 * canvasHeight, canvasWidth, canvasHeight);
	
	grd = ctx.createLinearGradient(canvasWidth / 2, 0, canvasWidth / 2, canvasHeight);
	grd.addColorStop(0, "#ffffffff");
	grd.addColorStop(0.4, "#ffffff00");

	ctx.fillStyle = grd;
	ctx.fillRect(0, 0, canvasWidth, canvasHeight);

	gradient = document.getElementById('gradient');

  if (color) {
    gradient.style.backgroundColor = color;
  }
  
	function canvasCusorMove(event) {
		let target = event.currentTarget;
		let shiftX = ~~(event.clientX - target.getBoundingClientRect().left);
		let shiftY = ~~(event.clientY - target.getBoundingClientRect().top);

		let imageData = ctx.getImageData(shiftX, shiftY, 1, 1);

		color = 'rgb(' + imageData.data[0] + ', ' + imageData.data[1] + ', ' + imageData.data[2] + ')';
    gradient.style.backgroundColor = color;
    window.ReactNativeWebView.postMessage(color);
	}

	function canvasCusorDown(event) {
		canvasCusorMove(event);

		canvas.addEventListener('pointermove', canvasCusorMove);
		document.addEventListener('pointerup', () => {
			canvas.removeEventListener('pointermove', canvasCusorMove);
		});
	}

	canvas.addEventListener('pointerdown', canvasCusorDown);
`;
