function main() {
    /**
* @type {HTMLCanvasElement} canvas
*/
var canvas = document.getElementById('myCanvas');

/**
* @type {WebGLRenderingContext} gl
*/
var gl = canvas.getContext('webgl');


const depan ={
   color_kertas: [0.25, 0.45, 0.85],
   color_isi: [0.25, 0.45, 0.85],
   
   kertasTitik1 : [-0.725, -0.600],
   kertasTitik2 : [-0.220, -0.600],
   kertasTitik3 : [-0.700, 0.550],
   kertasTitik4 : [-0.250, 0.550],
   
   isiTitik1 : [-0.550, 0.200],
   isiTitik2 : [-0.350, 0.200],
   isiTitik3 : [-0.550, 0.100],
   isiTitik4 : [-0.350, 0.100],

   isiTitik5 : [-0.500, 0.095],
   isiTitik6 : [-0.400, 0.095],
   isiTitik7 : [-0.500, 0.045],
   isiTitik8 : [-0.400, 0.045],
};


const kiri ={
   color_kertas1: [0.25, 0.45, 0.85],

   kertasTitik1 : [0.725, -0.100],
   kertasTitik2 : [0.175, -0.100],       
   kertasTitik3 : [0.800, 0.600],
   kertasTitik4 : [0.100, 0.600],
};

const vertices=[
   ...depan.kertasTitik1, ...depan.color_kertas,
   ...depan.kertasTitik2, ...depan.color_kertas,
   ...depan.kertasTitik3, ...depan.color_kertas,

   ...depan.kertasTitik2, ...depan.color_kertas,
   ...depan.kertasTitik4, ...depan.color_kertas,
   ...depan.kertasTitik3, ...depan.color_kertas,

   ...depan.isiTitik1, ...depan.color_isi,
   ...depan.isiTitik2, ...depan.color_isi,
   ...depan.isiTitik3, ...depan.color_isi,

   ...depan.isiTitik2, ...depan.color_isi,
   ...depan.isiTitik4, ...depan.color_isi,
   ...depan.isiTitik3, ...depan.color_isi,

   ...depan.isiTitik5, ...depan.color_isi,
   ...depan.isiTitik6, ...depan.color_isi,
   ...depan.isiTitik7, ...depan.color_isi,

   ...depan.isiTitik6, ...depan.color_isi,
   ...depan.isiTitik8, ...depan.color_isi,
   ...depan.isiTitik7, ...depan.color_isi,

   ...kiri.kertasTitik1, ...kiri.color_kertas1,
   ...kiri.kertasTitik2, ...kiri.color_kertas1,
   ...kiri.kertasTitik3, ...kiri.color_kertas1,

   ...kiri.kertasTitik2, ...kiri.color_kertas1,
   ...kiri.kertasTitik4, ...kiri.color_kertas1,
   ...kiri.kertasTitik3, ...kiri.color_kertas1,
];

var vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);


var buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);


var vertexShaderSource = `
   attribute vec2 aPosition;
   attribute vec3 aColor;
   varying vec3 vColor;
   uniform float uChange;
   void main() {
       gl_Position = vec4(aPosition.x, aPosition.y, 1.0, 1.0);
       vColor = aColor;
   }
`;

var fragmentShaderSource = `
   precision mediump float;
   varying vec3 vColor;
   void main() {
       gl_FragColor = vec4(vColor, 1.0);
   }
`;

var vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSource);


gl.compileShader(vertexShader);
gl.compileShader(fragmentShader);

//file .exe --> compileable for GPU
var shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);
gl.useProgram(shaderProgram);


var aPosition = gl.getAttribLocation(shaderProgram, "aPosition");
gl.vertexAttribPointer( aPosition, 2, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0);
gl.enableVertexAttribArray(aPosition);

var aColor = gl.getAttribLocation(shaderProgram, "aColor");
gl.vertexAttribPointer(aColor,3,gl.FLOAT,false,5 * Float32Array.BYTES_PER_ELEMENT,
   2 * Float32Array.BYTES_PER_ELEMENT);
gl.enableVertexAttribArray(aColor);

var speed = 0.0107;
var change = 0;
var uChange = gl.getUniformLocation(shaderProgram, "uChange");

console.log(vertices.length);
   
function moveVertices() {
   if (vertices[91] < -1.0 || vertices[111] > 1.0) {
       speed = speed * -1;
   }

   for (let i = 91; i < vertices.length; i += 5) {
       vertices[i] = vertices[i] + speed;
   }
}

function render() {
   moveVertices();
   gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
   change = change + speed;
   gl.uniform1f(uChange, change);

   gl.clearColor(0.6, 0.75, 0.46, 0.90);
   gl.clear(gl.COLOR_BUFFER_BIT);
   gl.drawArrays(gl.TRIANGLES, 0, 30);
   requestAnimationFrame(render);
}
requestAnimationFrame(render)
}