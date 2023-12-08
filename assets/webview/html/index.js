export default `
<!DOCTYPE html>
<html>
	<head>
		<title>
			Canvas editor
		</title>
		<meta http-equiv="content-type" content="text/html; charset=utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<style></style>
    <script></script>
	</head>
	<body>
		<div id="container">
			<label for="inputImage">Выберите картинку</label>
			<input type="file" id="inputImage" accept="image/*" />
		</div>
		<canvas id="canvas" width="390" height="390"></canvas>
	</body>
</html>`;