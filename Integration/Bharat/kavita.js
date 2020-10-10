// global variables for this scene
var vertexShaderObject_kavita;
var fragmentShaderObject_kavita;
var shaderProgramObject_kavita;

var vao_kavita;

var vbo_position_kavita;
var vbo_texture_kavita;

var mUniform_kavita;
var vUniform_kavita;
var pUniform_kavita;

var Paper_texture1_kavita 	= 0;

var uniform_texture0_sampler_kavita;

var uniform_blast_val;

var blast_val = 0;

// function for loading texture
function kavita_load_texture(image_name)
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

function kavita_init()
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

	vertexShaderObject_kavita = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShaderObject_kavita, vertexShaderSourceCode);
	gl.compileShader(vertexShaderObject_kavita);
	if(gl.getShaderParameter(vertexShaderObject_kavita, gl.COMPILE_STATUS) == false)
	{
		var error = gl.getShaderInfoLog(vertexShaderObject_kavita);
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
	"uniform float u_blast_val;" +
	"out vec4 FragColor;" +

	"void main(void)" +
	"{" +
		"vec4 temp_color;" +
		"temp_color = texture(u_texture0_sampler, out_texture0_coord);" +
		
		"if(temp_color.g >= u_blast_val)" +
		"discard;" +

		"FragColor = temp_color;"+
	"}";

	fragmentShaderObject_kavita = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShaderObject_kavita, fragmentShaderSourceCode);
	gl.compileShader(fragmentShaderObject_kavita);
	if(gl.getShaderParameter(fragmentShaderObject_kavita, gl.COMPILE_STATUS) == false)
	{
		var error = gl.getShaderInfoLog(fragmentShaderObject_kavita);
		if(error.length > 0)
		{
			alert(error);
			unititialize();
		}
	}


	shaderProgramObject_kavita = gl.createProgram();
	gl.attachShader(shaderProgramObject_kavita, vertexShaderObject_kavita);
	gl.attachShader(shaderProgramObject_kavita, fragmentShaderObject_kavita);

	gl.bindAttribLocation(shaderProgramObject_kavita, WebGLMacros.AMC_ATTRIBUTE_POSITION, "vPosition");
	gl.bindAttribLocation(shaderProgramObject_kavita, WebGLMacros.AMC_ATTRIBUTE_TEXTURE,"vTexture0_Coord");

	gl.linkProgram(shaderProgramObject_kavita);
	if(!gl.getProgramParameter(shaderProgramObject_kavita, gl.LINK_STATUS))
	{
		var error = gl.getProgramInfoLog(shaderProgramObject_kavita);
		if(error.length > 0)
		{
			alert(error);
			unititialize();
		}
	}

	mUniform_kavita 					= gl.getUniformLocation(shaderProgramObject_kavita, "u_m_matrix");
	vUniform_kavita 					= gl.getUniformLocation(shaderProgramObject_kavita, "u_v_matrix");
	pUniform_kavita 					= gl.getUniformLocation(shaderProgramObject_kavita, "u_p_matrix");
	uniform_texture0_sampler_kavita 	= gl.getUniformLocation(shaderProgramObject_kavita, "u_texture0_sampler");
	uniform_blast_val					= gl.getUniformLocation(shaderProgramObject_kavita, "u_blast_val");

	// texture loading part
	Paper_texture1_kavita = kavita_load_texture("resources/kavita-01.png");

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

	vao_kavita = gl.createVertexArray();
	gl.bindVertexArray(vao_kavita);

	vbo_position_kavita = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo_position_kavita);
	gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);
	gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_POSITION, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_POSITION);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	
	vbo_texture_kavita = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo_texture_kavita);
	gl.bufferData(gl.ARRAY_BUFFER, quadTexcoords, gl.STATIC_DRAW);
	gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_TEXTURE, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_TEXTURE);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
		
	gl.bindVertexArray(null);
		
// other initialization task

	gl.clearColor(0.0, 0.0, 0.0, 1.0);	
	
	//gl.enable(gl.DEPTH_TEST);
	//gl.depthFunc(gl.LEQUAL);

	perspectiveProjectionMatrix = mat4.create();
}

function kavita_draw()
{	
	var modelMatrix				= mat4.create();
	var rotateMatrix			= mat4.create();
	var viewMatrix				= mat4.create();
	var projectionMatrix		= mat4.create();

	gl.useProgram(shaderProgramObject_kavita);

	mat4.identity(modelMatrix);
	
	mat4.translate(modelMatrix, modelMatrix, [0.0, 0.0, -2.5]);
	
	projectionMatrix = perspectiveProjectionMatrix;

	gl.uniformMatrix4fv(mUniform_kavita, false, modelMatrix);
	gl.uniformMatrix4fv(vUniform_kavita, false, viewMatrix);
	gl.uniformMatrix4fv(pUniform_kavita, false, projectionMatrix);


	gl.bindTexture(gl.TEXTURE_2D, Paper_texture1_kavita);

	gl.uniform1i(uniform_texture0_sampler_kavita, 0);
	gl.uniform1f(uniform_blast_val, blast_val);
	gl.bindVertexArray(vao_kavita);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	gl.bindVertexArray(null);
	//gl.bindTexture(gl.TEXTURE_2D, 0);

	if(blast_val <= 1.0)
	{
		if(blast_val <= 0.5)
			blast_val = blast_val + 0.0004;
		else
		{
			kavitaAudio.play();
			blast_val = blast_val + 0.0002;
		}
	}

	gl.useProgram(null);
}


function kavita_unititialize()
{
// paper_texture
	if(Paper_texture1_kavita)
	{
		gl.deleteTexture(Paper_texture1_kavita);
		Paper_texture1_kavita = 0;
	}

// vao
	if(vao_kavita1)
	{
		gl.deleteVertexArray(vao_kavita1);
		vao_kavita1 = null;
	}

// vbo
	if(vbo_position_kavita)
	{
		gl.deleteBuffer(vbo_position_kavita);
		vbo_position_kavita = null;
	}

	if(vbo_texture_kavita)
	{
		gl.deleteBuffer(vbo_texture_kavita);
		vbo_texture_kavita = null;
	}

// shader programs
	if(shaderProgramObject_kavita)
	{
		if(fragmentShaderObject_kavita)
		{
			gl.detachShader(shaderProgramObject_kavita, fragmentShaderObject_kavita);
			gl.deleteShader(fragmentShaderObject_kavita);
			fragmentShaderObject_kavita = null;
		}

		if(vertexShaderObject_kavita)
		{
			gl.detachShader(shaderProgramObject_kavita, vertexShaderObject_kavita);
			gl.deleteShader(vertexShaderObject_kavita);
			vertexShaderObject_kavita = null;
		}

		gl.delteProgram(shaderProgramObject_kavita);
		shaderProgramObject_kavita = null;
	}
}


function degToRad(degrees)
{
	return(degrees * Math.PI / 180);
}
