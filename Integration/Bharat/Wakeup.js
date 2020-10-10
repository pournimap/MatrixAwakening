// global variables for this scene
var vertexShaderObject_wakeup;
var fragmentShaderObject_wakeup;
var shaderProgramObject_wakeup;

var vertexShaderObject_wakeup2;
var fragmentShaderObject_wakeup2;
var shaderProgramObject_wakeup2;

var vao_wakeup;
var vao_wakeup2;
var vao_wakeup3;
var vao_cursor_wakeup;

var vbo_position_wakeup;
var vbo_color_wakeup;
var vbo_texture_wakeup;

var mUniform_wakeup;
var vUniform_wakeup;
var pUniform_wakeup;

var mUniform_wakeup2;
var vUniform_wakeup2;
var pUniform_wakeup2;

var Paper_texture1_wakeup 	= 0;
var Paper_texture2_wakeup 	= 0;

var uniform_texture0_sampler_wakeup;

var FirstQuad 	= -0.55;
var SecondQuad 	= -0.1;

var cursor_X = 2.0;
var cursor_Y = -1.0;

var FirstQuad_done = 0;

var show_link 	= 0;

var tick_tick_cursor = 0;
// function for loading texture
function load_texture_wakeup(image_name)
{
	var Paper_texture = gl.createTexture();
	Paper_texture.image = new Image();
	Paper_texture.image.src = image_name;

	Paper_texture.image.onload = function()
	{
		gl.bindTexture(gl.TEXTURE_2D, Paper_texture);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, Paper_texture.image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}

	return(Paper_texture);
}

function wakeup_init()
{
	// 1st shader combo part
	
	var vertexShaderSourceCode=
	"#version 300 es" +
	"\n" +
	"in vec4 vPosition;" +
	"in vec2 vTexture0_Coord;" +

	"out vec2 out_texture0_coord;" +


	"uniform mat4 u_m_matrix;" +
	"uniform mat4 u_v_matrix;" +
	"uniform mat4 u_p_matrix;" +

	"void main(void)" +
	"{" +
		"gl_Position 		= u_p_matrix * u_v_matrix * u_m_matrix *  vPosition;" +
		"out_texture0_coord = vTexture0_Coord;" +
	"}";

	vertexShaderObject_wakeup = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShaderObject_wakeup, vertexShaderSourceCode);
	gl.compileShader(vertexShaderObject_wakeup);
	if(gl.getShaderParameter(vertexShaderObject_wakeup, gl.COMPILE_STATUS) == false)
	{
		var error = gl.getShaderInfoLog(vertexShaderObject_wakeup);
		if(error.length > 0)
		{
			alert(error);
			unititialize();
		}
	}


	var fragmentShaderSourceCode=
	"#version 300 es" +
	"\n" +
	"precision highp float;" +

	"in vec2 out_texture0_coord;" +

	"uniform highp sampler2D u_texture0_sampler;" +
	
	"out vec4 FragColor;" +

	"void main(void)" +
	"{" +
		"vec4 temp_color;" +
		"temp_color = texture(u_texture0_sampler, out_texture0_coord);" +
		"FragColor = temp_color;"+
	"}";

	fragmentShaderObject_wakeup = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShaderObject_wakeup, fragmentShaderSourceCode);
	gl.compileShader(fragmentShaderObject_wakeup);
	if(gl.getShaderParameter(fragmentShaderObject_wakeup, gl.COMPILE_STATUS) == false)
	{
		var error = gl.getShaderInfoLog(fragmentShaderObject_wakeup);
		if(error.length > 0)
		{
			alert(error);
			unititialize();
		}
	}


	shaderProgramObject_wakeup = gl.createProgram();
	gl.attachShader(shaderProgramObject_wakeup, vertexShaderObject_wakeup);
	gl.attachShader(shaderProgramObject_wakeup, fragmentShaderObject_wakeup);

	gl.bindAttribLocation(shaderProgramObject_wakeup, WebGLMacros.AMC_ATTRIBUTE_POSITION, "vPosition");
	gl.bindAttribLocation(shaderProgramObject_wakeup, WebGLMacros.AMC_ATTRIBUTE_TEXTURE,"vTexture0_Coord");

	gl.linkProgram(shaderProgramObject_wakeup);
	if(!gl.getProgramParameter(shaderProgramObject_wakeup, gl.LINK_STATUS))
	{
		var error = gl.getProgramInfoLog(shaderProgramObject_wakeup);
		if(error.length > 0)
		{
			alert(error);
			unititialize();
		}
	}

	mUniform_wakeup 					= gl.getUniformLocation(shaderProgramObject_wakeup, "u_m_matrix");
	vUniform_wakeup 					= gl.getUniformLocation(shaderProgramObject_wakeup, "u_v_matrix");
	pUniform_wakeup 					= gl.getUniformLocation(shaderProgramObject_wakeup, "u_p_matrix");
	uniform_texture0_sampler_wakeup 	= gl.getUniformLocation(shaderProgramObject_wakeup, "u_texture0_sampler");

	
	// 2nd shader combo part
	
	var vertexShaderSourceCode2=
	"#version 300 es" +
	"\n" +
	"precision highp float;" +
	"in vec4 vPosition;" +
	"in vec4 vColor;" +

	"uniform mat4 u_m_matrix;" +
	"uniform mat4 u_v_matrix;" +
	"uniform mat4 u_p_matrix;" +

	"out vec4 out_color;" +

	"void main(void)" +
	"{" +
		"gl_Position 		= u_p_matrix * u_v_matrix * u_m_matrix *  vPosition;" +
		"out_color 			= vColor;" +
	"}";

	vertexShaderObject_wakeup2 = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShaderObject_wakeup2, vertexShaderSourceCode2);
	gl.compileShader(vertexShaderObject_wakeup2);
	if(gl.getShaderParameter(vertexShaderObject_wakeup2, gl.COMPILE_STATUS) == false)
	{
		var error = gl.getShaderInfoLog(vertexShaderObject_wakeup2);
		if(error.length > 0)
		{
			alert(error);
			unititialize();
		}
	}


	var fragmentShaderSourceCode2=
	"#version 300 es" +
	"\n" +
	"precision highp float;" +
	"in vec4 out_color;" +
	
	"out vec4 FragColor;" +

	"void main(void)" +
	"{" +
		"FragColor = out_color;"+
	"}";

	fragmentShaderObject_wakeup2 = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShaderObject_wakeup2, fragmentShaderSourceCode2);
	gl.compileShader(fragmentShaderObject_wakeup2);
	if(gl.getShaderParameter(fragmentShaderObject_wakeup2, gl.COMPILE_STATUS) == false)
	{
		var error = gl.getShaderInfoLog(fragmentShaderObject_wakeup2);
		if(error.length > 0)
		{
			alert(error);
			unititialize();
		}
	}


	shaderProgramObject_wakeup2 = gl.createProgram();
	gl.attachShader(shaderProgramObject_wakeup2, vertexShaderObject_wakeup2);
	gl.attachShader(shaderProgramObject_wakeup2, fragmentShaderObject_wakeup2);

	gl.bindAttribLocation(shaderProgramObject_wakeup2, WebGLMacros.AMC_ATTRIBUTE_POSITION, "vPosition");
	gl.bindAttribLocation(shaderProgramObject_wakeup2, WebGLMacros.AMC_ATTRIBUTE_COLOR, "vColor");

	gl.linkProgram(shaderProgramObject_wakeup2);
	if(!gl.getProgramParameter(shaderProgramObject_wakeup2, gl.LINK_STATUS))
	{
		var error = gl.getProgramInfoLog(shaderProgramObject_wakeup2);
		if(error.length > 0)
		{
			alert(error);
			unititialize();
		}
	}

	mUniform_wakeup2 					= gl.getUniformLocation(shaderProgramObject_wakeup2, "u_m_matrix");
	vUniform_wakeup2 					= gl.getUniformLocation(shaderProgramObject_wakeup2, "u_v_matrix");
	pUniform_wakeup2 					= gl.getUniformLocation(shaderProgramObject_wakeup2, "u_p_matrix");

	// texture loading part
	Paper_texture1_wakeup = load_texture_wakeup("resources/wakeup/Wakeup.png");
	Paper_texture2_wakeup = load_texture_wakeup("resources/wakeup/WakeupLink.png");

// vao vbo

// 1st paper
	var quadVertices = new Float32Array
	([
		 2.5, 1.5, 0.0,
		-2.5, 1.5, 0.0,
		-2.5,-1.5, 0.0,
		 2.5,-1.5, 0.0
	]);

	var quadTexcoords = new Float32Array
	([
 		1.0,0.0,
		0.0,0.0,
		0.0,1.0,
		1.0,1.0
	]);

	vao_wakeup = gl.createVertexArray();
	gl.bindVertexArray(vao_wakeup);

	vbo_position_wakeup = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo_position_wakeup);
	gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);
	gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_POSITION, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_POSITION);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	
	vbo_texture_wakeup = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo_texture_wakeup);
	gl.bufferData(gl.ARRAY_BUFFER, quadTexcoords, gl.STATIC_DRAW);
	gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_TEXTURE, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_TEXTURE);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
		
	gl.bindVertexArray(null);
	
// 2nd paper
	quadVertices = new Float32Array
	([
		 1.2,  0.1, 0.00,
		-1.2,  0.1, 0.00,
		-1.2, -0.1, 0.00,
		 1.2, -0.1, 0.00,		 
	]);

	quadColor = new Float32Array
	([
 		0.0,0.0,0.0,
		0.0,0.0,0.0,
		0.0,0.0,0.0,
		0.0,0.0,0.0
	]);

	vao_wakeup2 = gl.createVertexArray();
	gl.bindVertexArray(vao_wakeup2);

	vbo_position_wakeup = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo_position_wakeup);
	gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);
	gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_POSITION, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_POSITION);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	vbo_color_wakeup = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo_color_wakeup);
	gl.bufferData(gl.ARRAY_BUFFER, quadColor, gl.STATIC_DRAW);
	gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_COLOR, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_COLOR);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
		
	gl.bindVertexArray(null);

// 2nd . 1 paper
	quadVertices = new Float32Array
	([
		-1.1,  0.1, 0.00,
		-1.2,  0.1, 0.00,
		-1.2, -0.1, 0.00,
		-1.1, -0.1, 0.00,		 
	]);

	quadColor = new Float32Array
	([
 		0.0,1.0,0.0,
		0.0,1.0,0.0,
		0.0,1.0,0.0,
		0.0,1.0,0.0
	]);

	vao_wakeup3 = gl.createVertexArray();
	gl.bindVertexArray(vao_wakeup3);

	vbo_position_wakeup = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo_position_wakeup);
	gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);
	gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_POSITION, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_POSITION);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	vbo_color_wakeup = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo_color_wakeup);
	gl.bufferData(gl.ARRAY_BUFFER, quadColor, gl.STATIC_DRAW);
	gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_COLOR, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_COLOR);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
		
	gl.bindVertexArray(null);

// 3rd paper
	quadVertices = new Float32Array
	([
		 0.00, 0.05, 0.00,
		-0.03, 0.0, 0.00,
		 0.03, 0.0, 0.00,
		 0.00, 0.05, 0.00,
		
		-0.01, 0.0, 0.00,
		-0.01,-0.02, 0.00,
		 0.01,-0.02, 0.00,
		 0.01, 0.0, 0.00,
	]);

	quadColor = new Float32Array
	([
 		0.7,1.0,0.0,
		0.0,0.0,0.0,
		0.0,0.0,0.0,
		0.0,0.0,0.0,
		0.7,1.0,0.0,
		0.0,0.0,0.0,
		0.0,0.0,0.0,
		0.0,0.0,0.0
	]);

	vao_cursor_wakeup = gl.createVertexArray();
	gl.bindVertexArray(vao_cursor_wakeup);

	vbo_position_wakeup = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo_position_wakeup);
	gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);
	gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_POSITION, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_POSITION);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	vbo_color_wakeup = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo_color_wakeup);
	gl.bufferData(gl.ARRAY_BUFFER, quadColor, gl.STATIC_DRAW);
	gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_COLOR, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_COLOR);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
		
	gl.bindVertexArray(null);

	
// other initialization task

	gl.clearColor(0.0, 0.0, 0.0, 1.0);	
	
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	//gl.enable(gl.CULL_FACE);					// if this is enable, texture will not get applied on backside (inside)

	perspectiveProjectionMatrix = mat4.create();
}

function wakeup_draw()
{	
	var modelMatrix				= mat4.create();
	var rotateMatrix			= mat4.create();
	var viewMatrix				= mat4.create();
	var projectionMatrix		= mat4.create();

  // shader program 1
	gl.useProgram(shaderProgramObject_wakeup);

	mat4.identity(modelMatrix);
	
	mat4.translate(modelMatrix, modelMatrix, [-0.5, 0.0, -3.0]);
	
	projectionMatrix = perspectiveProjectionMatrix;

	gl.uniformMatrix4fv(mUniform_wakeup, false, modelMatrix);
	gl.uniformMatrix4fv(vUniform_wakeup, false, viewMatrix);
	gl.uniformMatrix4fv(pUniform_wakeup, false, projectionMatrix);

	// paper 1
	if(show_link == 0)
	{
		gl.bindTexture(gl.TEXTURE_2D, Paper_texture1_wakeup);
	}	
	else
	{
		gl.bindTexture(gl.TEXTURE_2D, Paper_texture2_wakeup);
	}	

	gl.uniform1i(uniform_texture0_sampler_wakeup, 0);
	gl.bindVertexArray(vao_wakeup);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	gl.bindVertexArray(null);
	gl.bindTexture(gl.TEXTURE_2D, null);

	gl.useProgram(null);

 	if(show_link == 0)
 	{
		// shader program object 2
		gl.useProgram(shaderProgramObject_wakeup2);

		// 1st quad
		mat4.identity(modelMatrix);
		mat4.translate(modelMatrix, modelMatrix, [FirstQuad, 0.41, -2.0]);

		gl.uniformMatrix4fv(mUniform_wakeup2, false, modelMatrix);
		gl.uniformMatrix4fv(vUniform_wakeup2, false, viewMatrix);
		gl.uniformMatrix4fv(pUniform_wakeup2, false, projectionMatrix);

		gl.bindVertexArray(vao_wakeup2);
		gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
		gl.bindVertexArray(null);

		// 2nd quad
		mat4.identity(modelMatrix);
		mat4.translate(modelMatrix, modelMatrix, [SecondQuad, 0.2, -2.0]);

		gl.uniformMatrix4fv(mUniform_wakeup2, false, modelMatrix);
		gl.uniformMatrix4fv(vUniform_wakeup2, false, viewMatrix);
		gl.uniformMatrix4fv(pUniform_wakeup2, false, projectionMatrix);

		gl.bindVertexArray(vao_wakeup2);
		gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
		gl.bindVertexArray(null);

		if(FirstQuad < 0.5)
		{
			// 3rd quad

			mat4.identity(modelMatrix);
			mat4.translate(modelMatrix, modelMatrix, [FirstQuad, 0.41, -2.0]);

			gl.uniformMatrix4fv(mUniform_wakeup2, false, modelMatrix);
			gl.uniformMatrix4fv(vUniform_wakeup2, false, viewMatrix);
			gl.uniformMatrix4fv(pUniform_wakeup2, false, projectionMatrix);

			gl.bindVertexArray(vao_wakeup3);
			if(tick_tick_cursor % 28 >= 0 && tick_tick_cursor % 28 <= 1)
				gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
			
			gl.bindVertexArray(null);
		}

		if(FirstQuad_done == 1 )//&& SecondQuad < 1.5)
		{
			// 4th quad
			mat4.identity(modelMatrix);
			if(SecondQuad < 1.5)
				mat4.translate(modelMatrix, modelMatrix, [SecondQuad, 0.2, -2.0]);
			else
				mat4.translate(modelMatrix, modelMatrix, [1.5, 0.2, -2.0]);
			gl.uniformMatrix4fv(mUniform_wakeup2, false, modelMatrix);
			gl.uniformMatrix4fv(vUniform_wakeup2, false, viewMatrix);
			gl.uniformMatrix4fv(pUniform_wakeup2, false, projectionMatrix);

			gl.bindVertexArray(vao_wakeup3);
			if(tick_tick_cursor % 28 >= 0 && tick_tick_cursor % 28 <= 1)
				gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
			gl.bindVertexArray(null);
		}

		gl.useProgram(null);
	}
	if(show_link == 1)
	{
		draw_cursor_wakeup();
	}	
	wakeup_update();
}

function draw_cursor_wakeup()
{
	var modelMatrix				= mat4.create();
	var rotateMatrix			= mat4.create();
	var viewMatrix				= mat4.create();
	var projectionMatrix		= mat4.create();

	gl.useProgram(shaderProgramObject_wakeup2);
	
	mat4.identity(modelMatrix);
	mat4.identity(rotateMatrix);

	
	mat4.translate(modelMatrix, modelMatrix, [cursor_X, cursor_Y, -2.0]);
	mat4.rotateZ(modelMatrix,modelMatrix,degToRad(45.0));

	projectionMatrix = perspectiveProjectionMatrix;
	
	gl.uniformMatrix4fv(mUniform_wakeup2, false, modelMatrix);
	gl.uniformMatrix4fv(vUniform_wakeup2, false, viewMatrix);
	gl.uniformMatrix4fv(pUniform_wakeup2, false, projectionMatrix);

	gl.bindVertexArray(vao_cursor_wakeup);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
	gl.bindVertexArray(null);
	
	gl.useProgram(null);	
}

function wakeup_update()
{
	tick_tick_cursor = tick_tick_cursor + 1;
	if(FirstQuad < 0.5 && FirstQuad_done == 0)
	{
		FirstQuad = FirstQuad + 0.003;
		FirstQuad_done = 0;
	}
	else
	{
		FirstQuad_done = 1;
	}
	if(FirstQuad_done == 1 &&  SecondQuad < 3.1)
	{
		SecondQuad = SecondQuad + 0.003;
	}
	if(SecondQuad >= 3.0)
	{
		show_link = 1;
	}
	if(show_link == 1)
	{
		if(cursor_X >= -0.1)
		{
			cursor_X = cursor_X - 0.0078;
		}
		if(cursor_Y <= 0.35)
		{
			cursor_Y = cursor_Y + 0.005;
		}
		if((cursor_X < -0.1) && (cursor_Y > 0.35))
		{
			finishWakeupScene = true;
			
		}
	}
}


function wakeup_unititialize()
{
// paper_texture
	if(Paper_texture1_wakeup)
	{
		gl.deleteTexture(Paper_texture1_wakeup);
		Paper_texture1_wakeup = 0;
	}

	if(Paper_texture2_wakeup)
	{
		gl.deleteTexture(Paper_texture2_wakeup);
		Paper_texture2_wakeup = 0;
	}

// vao
	if(vao_wakeup1)
	{
		gl.deleteVertexArray(vao_wakeup1);
		vao_wakeup1 = null;
	}

	if(vao_wakeup2)
	{
		gl.deleteVertexArray(vao_wakeup2);
		vao_wakeup2 = null;
	}

	if(vao_wakeup3)
	{
		gl.deleteVertexArray(vao_wakeup3);
		vao_wakeup3 = null;
	}

// vbo
	if(vbo_position_wakeup)
	{
		gl.deleteBuffer(vbo_position_wakeup);
		vbo_position_wakeup = null;
	}

	if(vbo_texture_wakeup)
	{
		gl.deleteBuffer(vbo_texture_wakeup);
		vbo_texture_wakeup = null;
	}

// shader programs
	if(shaderProgramObject_wakeup)
	{
		if(fragmentShaderObject_wakeup)
		{
			gl.detachShader(shaderProgramObject_wakeup, fragmentShaderObject_wakeup);
			gl.deleteShader(fragmentShaderObject_wakeup);
			fragmentShaderObject_wakeup = null;
		}

		if(vertexShaderObject_wakeup)
		{
			gl.detachShader(shaderProgramObject_wakeup, vertexShaderObject_wakeup);
			gl.deleteShader(vertexShaderObject_wakeup);
			vertexShaderObject_wakeup = null;
		}

		gl.delteProgram(shaderProgramObject_wakeup);
		shaderProgramObject_wakeup = null;
	}

	if(shaderProgramObject_wakeup2)
	{
		if(fragmentShaderObject_wakeup2)
		{
			gl.detachShader(shaderProgramObject_wakeup2, fragmentShaderObject_wakeup2);
			gl.deleteShader(fragmentShaderObject_wakeup2);
			fragmentShaderObject_wakeup2 = null;
		}

		if(vertexShaderObject_wakeup2)
		{
			gl.detachShader(shaderProgramObject_wakeup2, vertexShaderObject_wakeup2);
			gl.deleteShader(vertexShaderObject_wakeup2);
			vertexShaderObject_wakeup2 = null;
		}

		gl.delteProgram(shaderProgramObject_wakeup2);
		shaderProgramObject_wakeup2 = null;
	}
}


function degToRad(degrees)
{
	return(degrees * Math.PI / 180);
}
