
//from asgn1
//for drawing squares
function click(ev,gl,canvas,u_ProjectionMatrix, u_ViewingMatrix) {
  var x = ev.clientX; //x coordinate of mouse pointer
  var y = ev.clientY; //y coordinate of mouse pointer
  var rect = ev.target.getBoundingClientRect();
  x = ((x - rect.left) - canvas.height/2)/(canvas.height/2);
  y = (canvas.width/2 - (y - rect.top))/(canvas.width/2);
  //store coordinates to g_points array
  gl.clear(gl.COLOR_BUFFER_BIT);
  rotation[0]= (rotation[0]+(x - currentOrientationX)) %360;
  rotation[1]= (rotation[1]-(y - currentOrientationY)) %360;
  radianX = rotation[0] * Math.PI/180;
  radianY = -rotation[1] * Math.PI/180;
  lookAt[0] = Math.cos(radianX) * Math.cos(radianY);
  lookAt[1] = Math.sin(radianY);
  lookAt[2] = Math.sin(radianX) * Math.cos(radianY);
  draw(gl, u_ProjectionMatrix, u_ViewingMatrix);
}

function draw(gl, u_ProjectionMatrix, u_ViewingMatrix){
  // Clear color and depth buffer
 	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
 	var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');


  projectionMatrix.setPerspective(60, canvas.width / canvas.height, 1, 150);
  viewingMatrix.setLookAt(eyePos[0], eyePos[1], eyePos[2], eyePos[0]+lookAt[0], eyePos[1]+lookAt[1],eyePos[2]+ lookAt[2], up[0], up[1], up[2]);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projectionMatrix.elements);
  gl.uniformMatrix4fv(u_ViewingMatrix, false, viewingMatrix.elements);
  var rotateMatrix = [0, 0, 0, 1];
  var translateMatrix  = [0, 0, 0];
  var scaleMatrix  = [32, 1, 32];
  c = [0.5,0, 1,0, 1,1, 0.5,1];
  initTextures(gl, c, 2);
  drawCube(gl, u_ModelMatrix,rotateMatrix, translateMatrix, scaleMatrix, c);
  var rotateMatrix = [0, 0, 0, 1];
  var translateMatrix  = [0, 0, 0];
  var scaleMatrix = [32,48,32];
  c = [0,0, 0.5,0, 0.5,0.5, 0,0.5];
  initTextures(gl, c, 1);
  drawCube(gl, u_ModelMatrix, rotateMatrix,translateMatrix, scaleMatrix,  c);
  var translateMatrix  = [0, 0, 0];
  var scaleMatrix  = [1, 1, 1];
  var rotateMatrix = [0, 0, 0, 1];
  //instead of color like asgn 2 , we use texture coordinates instead
  c = [0,0, 1,0, 1,1, 0,1];
  initTextures(gl, c, 1);
  //https://piazza.com/class/k56ziz1b6kwbd?cid=124
  //"Apparently, if your texture is not a square with a multiple of 2 for length, you need to set wrapping parameters to clamp rather than repeat.
  //You can use repeating only if your texture is a perfect square with side lengths a multiple of 2."
  z = -31;
  //iterate thought the mapArray to drawCube layout of map
  for(var i = 0; i < 32; i++,z+=2){
    x = -31;
    for(var j = 0; j < 32; j++,x+=2){
      if(mapLayout[i][j] == 1){
        var rotateMatrix = [0, 0, 0, 1];
        var translateMatrix = [x, 2, z];
        var scaleMatrix  = [1, 1, 1];
        drawCube(gl, u_ModelMatrix,rotateMatrix, translateMatrix, scaleMatrix, c);
      }else{
        var f = mapLayout[i][j]
        var y = 0;
        while (f>0){
          var rotateMatrix = [0, 0, 0, 1];
          var translateMatrix = [x, y+2, z];
          var scaleMatrix  = [1, 1, 1];
          drawCube(gl, u_ModelMatrix,rotateMatrix, translateMatrix, scaleMatrix, c);
          y+=2;
          f--;
        }
      }
    }
  }
}

//from asgn2
function drawCube(gl, u_ModelMatrix, rotateMatrix,translateMatrix, scaleMatrix, c){
  //var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
 	// Set the vertex information
 	// var n = initVertexBuffers(gl,color);
 	// if (n < 0) {
 	// 	console.log('Failed to set the vertex information');
 	// 	return;
 	// }
 	//will be used for all the alpine transformation
 	var transformationMatrix = new Matrix4();
  transformationMatrix.rotate(rotateMatrix[0],rotateMatrix[1],rotateMatrix[2],rotateMatrix[3]);
 	transformationMatrix.translate(translateMatrix[0],translateMatrix[1],translateMatrix[2]);
 	transformationMatrix.scale(scaleMatrix[0],scaleMatrix[1],scaleMatrix[2]);

 	// Pass the model view projection matrix to u_MvpMatrix
  gl.uniformMatrix4fv(u_ModelMatrix, false,transformationMatrix.elements);
 	// Draw the cube
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}

//from asgn2
function initVertexBuffers(gl) {
  // Create a cube
  //    v6----- v5
  //   /|      /|
  //  v1------v0|
  //  | |     | |
  //  | |v7---|-|v4
  //  |/      |/
  //  v2------v3

  var vertices = new Float32Array([   // Vertex coordinates
     1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0, // v0-v1-v2-v3 front
     1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0, // v0-v3-v4-v5 right
     1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0, // v0-v5-v6-v1 up
    -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0, // v1-v6-v7-v2 left
    -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0, // v7-v4-v3-v2 down
     1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0  // v4-v7-v6-v5 back
  ]);
  // var colors = new Float32Array([     // Colors
  //   // 1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  // v0-v1-v2-v3 front(white)
  //   // 1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  // v0-v3-v4-v5 right(white)
  //   // 1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  // v0-v5-v6-v1 up(white)
  //   // 1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  // v1-v6-v7-v2 left(white)
  //   // 1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  // v7-v4-v3-v2 down(white)
  //   // 1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0   // v4-v7-v6-v5 back(white)
  //
  //   c[0], c[1], c[2],  c[0], c[1], c[2],  c[0], c[1], c[2],  c[0], c[1], c[2],  // v0-v1-v2-v3 front(white)
  //   c[0], c[1], c[2],  c[0], c[1], c[2],  c[0], c[1], c[2],  c[0], c[1], c[2],  // v0-v3-v4-v5 right(white)
  //   c[0], c[1], c[2],  c[0], c[1], c[2],  c[0], c[1], c[2],  c[0], c[1], c[2],  // v0-v5-v6-v1 up(white)
  //   c[0], c[1], c[2],  c[0], c[1], c[2],  c[0], c[1], c[2],  c[0], c[1], c[2],  // v1-v6-v7-v2 left(white)
  //   c[0], c[1], c[2],  c[0], c[1], c[2],  c[0], c[1], c[2],  c[0], c[1], c[2],  // v7-v4-v3-v2 down(white)
  //   c[0], c[1], c[2],  c[0], c[1], c[2],  c[0], c[1], c[2],  c[0], c[1], c[2]   // v4-v7-v6-v5 back(white)
  // ]);

  var indices = new Uint8Array([       // Indices of the vertices
     0, 1, 2,   0, 2, 3,    // front
     4, 5, 6,   4, 6, 7,    // right
     8, 9,10,   8,10,11,    // up
    12,13,14,  12,14,15,    // left
    16,17,18,  16,18,19,    // down
    20,21,22,  20,22,23     // back
  ]);

  // Create a buffer object
  var indexBuffer = gl.createBuffer();
  if (!indexBuffer)
    return -1;

  // Write the vertex coordinates and color to the buffer object
  if (!initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position'))
    return -1;

  //gl.bindBuffer(gl.ARRAY_BUFFER, null);
  // Write the indices to the buffer object
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);


  return indices.length;
}

function initArrayBuffer(gl, data, num, type, attribute) {
  // Create a buffer object
  var buffer = gl.createBuffer();
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return false;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
// Assign the buffer object to the attribute variable
  var a_attribute = gl.getAttribLocation(gl.program, attribute);
  if (a_attribute < 0) {
    console.log('Failed to get the storage location of ' + attribute);
    return false;
  }
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  // Enable the assignment of the buffer object to the attribute variable
  gl.enableVertexAttribArray(a_attribute);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  return true;
}

// similar  to vertex buffers
function initTextures(gl,c, n) {
    var textCoords = new Float32Array([
    c[6], c[7], c[0], c[1], c[2], c[3], c[4], c[5],
    c[4], c[5], c[6], c[7], c[0], c[1], c[2], c[3],
    c[0], c[1], c[2], c[3], c[4], c[5], c[6], c[7],
    c[6], c[7], c[0], c[1], c[2], c[3], c[4], c[5],
    c[0], c[1], c[2], c[3], c[4], c[5], c[6], c[7],
    c[0], c[1], c[2], c[3], c[4], c[5], c[6], c[7]
  ]);

  if (!initArrayBuffer(gl, textCoords, 2, gl.FLOAT, 'a_TexCoord'))
    return -1;

  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  // Get the storage location of u_Sampler
  var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
  if (!u_Sampler) {
    console.log('Failed to get the storage location of u_Sampler');
    return false;
  }
  var image = new Image();  // Create the image object
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }

  image.onload = function(){
    loadTexture(gl, texture, u_Sampler, image);
  }
  image.src = './src/sky2.jpg';
  return true;
}

function loadTexture(gl, texture, u_Sampler, image) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE0);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);
  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler, 0);
  //gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
  draw(gl, u_ProjectionMatrix, u_ViewingMatrix);
}

function magnitude(vector){
  return Math.sqrt((vector[0] * vector[0]) + (vector[1] * vector[1]) + (vector[2] * vector[2]));
}

function normalize(vector){
  var mag = magnitude(vector);
  return [vector[0]/mag, vector[1]/mag, vector[2]/mag];
}

function crossProduct(vector1, vector2){
  var a = (vector1[1] *vector2[2]) - (vector1[2] * vector2[1]);
  var s = (vector1[2] *vector2[0]) - (vector1[0] * vector2[2]);
  var d = (vector1[0] *vector2[1]) - (vector1[1] * vector2[0]);
  return [a,s,d];
}


//https://piazza.com/class/k56ziz1b6kwbd?cid=150
function keydown(ev, gl, u_ProjectionMatrix, u_ViewingMatrix) {
  //e
  if(ev.keyCode == 69){
    rotation[0]= (rotation[0]+(10 - currentOrientationX)) %360;
    radianX = rotation[0] * Math.PI/180;
    lookAt[0] = Math.cos(radianX) * Math.cos(radianY);
    lookAt[1] = Math.sin(radianY);
    lookAt[2] = Math.sin(radianX) * Math.cos(radianY);
    //q
  }else if(ev.keyCode == 81){
    rotation[0]= (rotation[0]-(10 + currentOrientationX)) %360;
    radianX = rotation[0] * Math.PI/180;
    lookAt[0] = Math.cos(radianX) * Math.cos(radianY);
    lookAt[1] = Math.sin(radianY);
    lookAt[2] = Math.sin(radianX) * Math.cos(radianY);
  }
  else if(ev.keyCode == 87) {
    eyePos[0] += lookAt[0];
    eyePos[1] += lookAt[1];
    eyePos[2] += lookAt[2];
  //down
  }else if(ev.keyCode == 83){
    eyePos[0] -= lookAt[0];
    eyePos[1] -= lookAt[1];
    eyePos[2] -= lookAt[2];
  //left
  }else if(ev.keyCode == 65){
    //must compute cross product than normalize to do left and right
    var o = normalize(crossProduct(lookAt,up));
    eyePos[0] -= o[0];
    eyePos[1] -= o[1];
    eyePos[2] -= o[2];
  //right
  }else if(ev.keyCode == 68){
    var o = normalize(crossProduct(lookAt,up));
    eyePos[0] += o[0];
    eyePos[1] += o[1];
    eyePos[2] += o[2];
  }
  draw(gl, u_ProjectionMatrix, u_ViewingMatrix);
}
