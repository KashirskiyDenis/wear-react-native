export default `
<script>
  document.addEventListener('DOMContentLoaded', function () {
    let base64 = null;
    let inputImage = document.getElementById('inputImage');
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d', {
      willReadFrequently: true,
    });
    document.getElementById('backgroundEraser').addEventListener('click', () => {
      canvas.removeEventListener('pointerdown', tools[tool]);
      canvas.addEventListener('pointerdown', eraser);
      tool = 'bgEraser';
    });
    document.getElementById('magicEraser').addEventListener('click', () => {
      canvas.removeEventListener('pointerdown', tools[tool]);
      canvas.addEventListener('pointerdown', filling);
      tool = 'filling';
    });
    
    document.getElementById('saveImage').addEventListener('click', () => {
     window.ReactNativeWebView.postMessage(canvas.toDataURL().split(';base64,')[1]);
    });

    window.addEventListener('message', function(event) {
      let image = new Image();
      image.src = event.data;
      image.onload = draw.bind(image);
    });

    let tools = {
      bgEraser : eraser,
      filling : filling
    };
    
    let tool = 'bgEraser';
    let arrayChecked;
    let arrayData;
    let imageData;
    
    function changeInput() {
      let image = new Image();
      image.onload = draw;
      image.onerror = () => {
        console.log('Error loading')
      };
      if (this.files[0])
        image.src = URL.createObjectURL(this.files[0]);
    }
    
    function draw() {
      canvas.width = window.innerWidth;
      canvas.height = this.height * window.innerWidth / this.width;
      ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
      
      to2DArray(ctx.getImageData(0, 0, canvas.width, canvas.height));
      checkArray(arrayData, canvas.width, canvas.height);
      clearArrayChecked();
    }
    
    let clearArrayChecked = () => {
      arrayChecked = [];
      for (let i = 0; i <= canvas.width; i++) {
        arrayChecked[i] = [];
        for (let j = 0; j <= canvas.height; j++)
          arrayChecked[i][j] = 0;
      }		
    };
    
    let checkArray = (array, width, height) => {
      for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
          if (array[i][j].length != 4) {
            console.log({i: i, j: j});
            return;
          }
        }
      }
    };
    
    let to2DArray = (imageData) => {
      let { width, height, data } = imageData;
      arrayData = [];
      let dataIndex = 0;
      
      for (let i = 0; i < height; i++) {
        let row = [];
        for (let j = 0; j < width; j++) {
          row[j] = data.subarray(dataIndex, dataIndex + 4);
          dataIndex += 4;
        }
        arrayData[i] = row;
      }
    };
    
    let toImageData = (array, width, height) => {
      imageData = new ImageData(width, height);
      let index = 0;
      for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
          imageData.data[index] = array[i][j][0];
          imageData.data[index + 1] = array[i][j][1];
          imageData.data[index + 2] = array[i][j][2];
          imageData.data[index + 3] = array[i][j][3];
          index += 4;
        }
      }		
    };
    
    function compare(data1, data2) {
      let R = (data1[0] - data2[0]) ** 2;
      let G = (data1[1] - data2[1]) ** 2;
      let B = (data1[2] - data2[2]) ** 2;
      let a = Math.sqrt(R + G + B);
      return a < 25 ? true : false;	
    }
    
    function filling(event) {
      let target = event.currentTarget
      let shiftX = ~~(event.clientX - target.getBoundingClientRect().left);
      let shiftY = ~~(event.clientY - target.getBoundingClientRect().top);
      let pixel = ctx.getImageData(shiftX, shiftY, 1, 1);

      fillXORArray(shiftX, shiftY, pixel, canvas.width, canvas.height);
      toImageData(arrayData, canvas.width, canvas.height);
      ctx.putImageData(imageData, 0, 0);
      clearArrayChecked();
    }
    
    function fillXORArray(x, y, fg, width, height) {
      const fillColor = new Uint8ClampedArray([0, 0, 0, 0]);
      const neighbors = [
        { dx: 0, dy: -1 },
        { dx: 0, dy: 1 },
        { dx: -1, dy: 0 },
        { dx: 1, dy: 0 }
      ];
      
      let stack = [{ x, y }];
      arrayChecked[x][y] = 1;
      
      while (stack.length) {
        let { x: currentX, y: currentY } = stack.pop();
        arrayData[currentY][currentX].set(fillColor);
        
        for (let neighbor of neighbors) {
          let newX = currentX + neighbor.dx;
          let newY = currentY + neighbor.dy;
          
          if (newX >= 0 && newY >= 0 &&
            newX < width && newY < height &&
            arrayChecked[newX][newY] !== 1 &&
            compare(arrayData[newY][newX], fg.data)
            ) {
            stack.push({ x: newX, y: newY });
            arrayChecked[newX][newY] = 1;
          }
        }
      }
    }
    
	function canvasMouseMove(event) {
		let target = event.currentTarget;
		let shiftX = ~~(event.clientX - target.getBoundingClientRect().left);
		let shiftY = ~~(event.clientY - target.getBoundingClientRect().top);
		
		ctx.lineTo(shiftX, shiftY);
		ctx.stroke();
	}
	
	function cusorMove(event) {
		let target = event.currentTarget;
		let shiftX = ~~(event.clientX - target.getBoundingClientRect().left);
		let shiftY = ~~(event.clientY - target.getBoundingClientRect().top);
		
		ctx.globalCompositeOperation = 'destination-out';
		ctx.lineWidth = 10;
		ctx.lineCap = 'round';		
		ctx.moveTo(shiftX, shiftY);
		ctx.lineTo(shiftX, shiftY);
		ctx.stroke();		
	}
	
	function eraser(event) {
		cusorMove(event);
		
		canvas.addEventListener('pointermove', canvasMouseMove);
		canvas.addEventListener('pointerover', cusorMove);
		
		document.addEventListener('pointerup', () => {
			canvas.removeEventListener('pointermove', canvasMouseMove);	
			to2DArray(ctx.getImageData(0, 0, canvas.width, canvas.height));
		});
	}
	
	inputImage.addEventListener('change', changeInput);
	canvas.addEventListener('pointerdown', eraser);
});	
</script>`;
