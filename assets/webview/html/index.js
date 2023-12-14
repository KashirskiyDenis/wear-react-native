export default `
<!DOCTYPE html>
<html>
	<head>
		<title>
			Canvas editor
		</title>
		<meta http-equiv="content-type" content="text/html; charset=utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">
		<style></style>
    <script></script>
	</head>
	<body>
		<div class="container">
			<label for="inputImage">Выберите картинку</label>
			<input type="file" id="inputImage" accept="image/*" />
		</div>
		<canvas id="canvas" width="0" height="0"></canvas>
		<div class="container">
			<label for="magicEraser">Magic Eraser</label>
			<input type="button" id="magicEraser"/>
			<label for="backgroundEraser">Background Eraser</label>
			<input type="button" id="backgroundEraser"/>			
		</div>
		<div class="container">
			<label for="saveImage">Сохранить картинку</label>
			<input type="button" id="saveImage"/>
		</div>
	</body>
</html>`;