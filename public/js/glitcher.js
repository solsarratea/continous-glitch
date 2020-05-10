
function adjustPixelError(data, i, error, multiplier) {
    data[i] = data[i] + multiplier * error[0]; 
    data[i + 1] = data[i + 1] + multiplier * error[1]; 
    data[i + 2] = data[i + 2] + multiplier * error[2]; 
}

function dither8Bit(imageData) {
    var width = imageData.width,
        height = imageData.height,
        data = imageData.data;

    size = 4;
    for (y = 0; y < height; y += size) {
        for (x = 0; x < width; x += size) {

            sum_r = 0;
            sum_g = 0;
            sum_b = 0;

            for (s_y = 0; s_y < size; s_y++) {
                for (s_x = 0; s_x < size; s_x++) {
                    i = 4 * (width * (y + s_y) + (x + s_x));

                    sum_r += data[i];
                    sum_g += data[i + 1];
                    sum_b += data[i + 2];
                }
            }
            avg_r = (sum_r / (size * size)) > 127 ? 0xff : 00;
            avg_g = (sum_g / (size * size)) > 127 ? 0xff : 00;
            avg_b = (sum_b / (size * size)) > 127 ? 0xff : 00;

            for (s_y = 0; s_y < size; s_y++) {
                for (s_x = 0; s_x < size; s_x++) {
                    i = 4 * (width * (y + s_y) + (x + s_x));

                    data[i] = avg_r;
                    data[i + 1] = avg_g;
                    data[i + 2] = avg_b;
                }
            }
        }
    }
}

function ditherBayer(imageData) {
    var width = imageData.width,
        height = imageData.height,
        data = imageData.data;

    threshold_map = [
        [1, 9, 3, 11],
        [13, 5, 15, 7],
        [4, 12, 2, 10],
        [16, 8, 14, 6]
    ];

    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            i = 4 * (y * width + x);

            gray = .3 * data[i] + .59 * data[i + 1] + .11 * data[i + 2];
            scaled = (gray * 17) / 255;
            val = scaled > threshold_map[x % 4][y % 4] ? 0xff : 0;
            data[i] = data[i + 1] = data[i + 2] = val;
        }
    }
}

function ditherHalftone(imageData) {
    var width = imageData.width,
        height = imageData.height,
        data = imageData.data;

    for (var y = 0; y <= height - 2; y += 3) {
        for (var x = 0; x <= width - 2; x += 3) {

            sum_r = sum_g = sum_b = 0;
            indexed = [];
            count = 0;
            for (s_y = 0; s_y < 3; s_y++) {
                for (s_x = 0; s_x < 3; s_x++) {
                    i = 4 * (width * (y + s_y) + (x + s_x));
                    sum_r += data[i];
                    sum_g += data[i + 1];
                    sum_b += data[i + 2];

                    data[i] = data[i + 1] = data[i + 2] = 0xff;

                    indexed.push(i);
                    count++;
                }
            }

            avg_r = (sum_r / 9) > 127 ? 0xff : 00;
            avg_g = (sum_g / 9) > 127 ? 0xff : 00;
            avg_b = (sum_b / 9) > 127 ? 0xff : 00;

            avg_lum = (avg_r + avg_g + avg_b) / 3;
            scaled = Math.round((avg_lum * 9) / 255);

            if (scaled < 9) {
                data[indexed[4]] = avg_r;
                data[indexed[4] + 1] = avg_g;
                data[indexed[4] + 2] = avg_b;
            }

            if (scaled < 8) {
                data[indexed[5]] = avg_r;
                data[indexed[5] + 1] = avg_g;
                data[indexed[5] + 2] = avg_b;
            }

            if (scaled < 7) {
                data[indexed[1]] = avg_r;
                data[indexed[1] + 1] = avg_g;
                data[indexed[1] + 2] = avg_b;
            }

            if (scaled < 6) {
                data[indexed[6]] = avg_r;
                data[indexed[6] + 1] = avg_g;
                data[indexed[6] + 2] = avg_b;
            }

            if (scaled < 5) {
                data[indexed[3]] = avg_r;
                data[indexed[3] + 1] = avg_g;
                data[indexed[3] + 2] = avg_b;
            }

            if (scaled < 4) {
                data[indexed[8]] = avg_r;
                data[indexed[8] + 1] = avg_g;
                data[indexed[8] + 2] = avg_b;
            }

            if (scaled < 3) {
                data[indexed[2]] = avg_r;
                data[indexed[2] + 1] = avg_g;
                data[indexed[2] + 2] = avg_b;
            }

            if (scaled < 2) {
                data[indexed[0]] = avg_r;
                data[indexed[0] + 1] = avg_g;
                data[indexed[0] + 2] = avg_b;
            }
            
            if (scaled < 1) {
                data[indexed[7]] = avg_r;
                data[indexed[7] + 1] = avg_g;
                data[indexed[7] + 2] = avg_b;
            }
        }
    }
}

function ditherAtkinsons(imageData) {
    var width = imageData.width,
        height = imageData.height,
        data = imageData.data;
    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            i = 4 * (y * width + x);
            old_r = data[i]
            old_g = data[i + 1]
            old_b = data[i + 2];

            new_r = (old_r > 127) ? 0xff : 0;
            new_g = (old_g > 127) ? 0xff : 0;
            new_b = (old_b > 127) ? 0xff : 0;

            data[i] = new_r;
            data[i + 1] = new_g;
            data[i + 2] = new_b;

            err_r = old_r - new_r;
            err_g = old_g - new_g;
            err_b = old_b - new_b;

            // Redistribute the pixel's error like this:
            //       *  1/8 1/8
            //  1/8 1/8 1/8
            //      1/8 

            // The ones to the right...
            if (x < width - 1) {
                adj_i = i + 4;
                adjustPixelError(data, adj_i, [err_r, err_g, err_b], 1/8);

                // The pixel that's down and to the right
                if (y < height - 1) {
                    adj_i = adj_i + (width * 4) + 4;
                    adjustPixelError(data, adj_i, [err_r, err_g, err_b], 1/8);
                }

                // The pixel two over
                if (x < width - 2) {
                    adj_i = i + 8;
                    adjustPixelError(data, adj_i, [err_r, err_g, err_b], 1/8);
                }
            }

            if (y < height - 1) {
                // The one right below
                adj_i = i + (width * 4);
                adjustPixelError(data, adj_i, [err_r, err_g, err_b], 1/8);

                if (x > 0) {
                    // The one to the left
                    adj_i = adj_i - 4;
                    adjustPixelError(data, adj_i, [err_r, err_g, err_b], 1/8);
                }

                if (y < height - 2) {
                    // The one two down
                    adj_i = i + (2 * width * 4);
                    adjustPixelError(data, adj_i, [err_r, err_g, err_b], 1/8);
                }
            }
        }
    }
}

function randomColor(imageData){
    var width = imageData.width,
        height = imageData.height,
        data = imageData.data,
        m = Math.floor(Math.random() * width) + 1;
    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            i = 4 * (y * width + x);
            if (i%m == 0){
                data[i] = Math.floor(Math.random() * 256) + 1;
                data[i + 1] = Math.floor(Math.random() * 256) + 1;
                data[i + 2] = Math.floor(Math.random() * 256) + 1;
            }
        }
    }
}

function colorInvertHorizontalBand(imageData){
    var width = imageData.width,
        height = imageData.height,
        data = imageData.data,
        col = Math.floor(Math.random() * 3),
        j = Math.floor(Math.random()*height);
        bandWidth=Math.floor(Math.random()*30)+1;

        for (var x = 0; x < width * bandWidth; x++) {
            i = 4 * (j * width + x);
            data[i + col ]    = 255 ;     // red
            data[i + col + 1] = 255 - data[i + 1]; // green
            data[i + col + 2] = 255 - data[i + 2]; // blue
        }
}

function colorInvertVerticalBand(imageData){
var width = imageData.width,
    height = imageData.height,
    data = imageData.data,
    col = Math.floor(Math.random() * 3),
    j = Math.floor(Math.random()*width);
    bandWidth=Math.floor(Math.random()*30)+1;

    for (var y = 0; y < height; y++) {
        for( var k = j; k < (j + bandWidth); k++){
            i = 4 * (y * width + k);
            data[i + col ]    = 255 ;     // red
            data[i + col + 1] = 255 - data[i + 1]; // green
            data[i + col + 2] = 255 - data[i + 2]; // blue
        }
    
    }
}

function ditherFloydSteinberg(imageData) {
    var width = imageData.width,
        height = imageData.height,
        data = imageData.data;
    var data2 = imageData.data;

    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            i = 4 * (y * width + x);
            old_r = data[i]
            old_g = data[i + 1]
            old_b = data[i + 2];

            new_r = (old_r > 127) ? 0xff : 0;
            new_g = (old_g > 127) ? 0xff : 0;
            new_b = (old_b > 127) ? 0xff : 0;

            data[i] = new_r;
            data[i + 1] = new_g;
            data[i + 2] = new_b;

            err_r = old_r - new_r;
            err_g = old_g - new_g;
            err_b = old_b - new_b;

            // Redistribute the pixel's error like this:
            //   * 7
            // 3 5 1 

            // The ones to the right...
            if (x < width - 1) {
                right_i = i + 4;
                adjustPixelError(data, right_i, [err_r, err_g, err_b], 7/16);

                // The pixel that's down and to the right
                if (y < height - 1) {
                    next_right_i = right_i + (width * 4)
                    adjustPixelError(data, next_right_i, [err_r, err_g, err_b], 1/16);
                }
            }
            
            if (y < height - 1) {
                // The one right below
                down_i = i + (width * 4);
                adjustPixelError(data, down_i, [err_r, err_g, err_b], 5/16);

                if (x > 0) {
                    // The one down and to the left...
                    left_i = down_i - 4;
                    adjustPixelError(data, left_i, [err_r, err_g, err_b], 3/16);
                }
            }
        }
    }
}

function updateImage(oldImage, newImage){
    oldImage.src = newImage.src;
    document.body.style.backgroundImage = `url(${img.src})`;
    
}

function randomGlitch(imgData){
    var randomEf = Math.floor(Math.random() * 10) + 1;

switch (randomEf) {
    case 1:
    ditherBayer(imgData);
    break;
    case 2:
    ditherHalftone(imgData);
    break;
    case 3:
    ditherAtkinsons(imgData);
    break;
    case 4:
    ditherFloydSteinberg(imgData);
    break;
    case 5:
    dither8Bit(imgData);
    break;
    case 6:
    randomColor(imgData);
    break;
    case 7:
    colorInvertVerticalBand(imgData);
    break;
    default:
    colorInvertHorizontalBand(imgData);
    break;
}

}

function ditherGlitch(image){
    let newImage = new Image();
    var canvas = document.createElement('canvas');  
        canvas.height = image.height,
        canvas.width = image.width,
        ctx    = canvas.getContext('2d');
    
    ctx.drawImage(image,0,0);
    let imgData = ctx.getImageData(0,0,image.width, image.height); 
    randomGlitch(imgData)
    ctx.putImageData(imgData, 0, 0);
    newImage.src = canvas.toDataURL("image/png");

    datachannel.send(JSON.stringify({
		kind: 'image',
		path: newImage.src,
	}));
    return newImage;
}

var createGUID = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

class Glitcher {
    constructor(image, frequency = 10000, state = 0) { 
        
        this.img = image;
        this.frequency = frequency;
        this.state = 0 ;
        this.id = createGUID();
        return this.id;
    }


    start() {
        this.state = 1;
        const freq = this.frequency;
        img.onload = function() {
            setTimeout( () => {
                let newImage = ditherGlitch(img);
                updateImage(img,newImage);
            },freq)
        }
    }

    stop(){
        this.state = 0;
    }

    
}