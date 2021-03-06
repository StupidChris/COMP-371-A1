#version 450 core

//Get vertex location from layout
layout (location = 0) in vec3 pos;
layout (location = 1) in vec3 norm;
layout (location = 2) in vec2 tex;

//Output vectors
out vec3 normal;
out vec3 fragPosition;
out vec2 texCoord;

//Model View Projection matrix
uniform mat4 vpMat;
uniform mat4 model;

void main()
{
	//Set the vertex position according to the MVP matrix
    vec4 p = model * vec4(pos, 1.0);
    gl_Position = vpMat * p;

    //Get the correct normal vector
    normal = mat3(transpose(inverse(model))) * norm;
    //Set frag model position
    fragPosition = vec3(p);
    //Pass on texture coordinate
    texCoord = tex;
}