#version 450 core

//The lighting of this shader has been adapted from https://learnopengl.com/Lighting/Basic-Lighting
//The shadows implementation from this shaders has been adapted from https://learnopengl.com/Advanced-Lighting/Shadows/Point-Shadows

//Material
struct Material
{
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float shininess;
};

//Light
struct Light
{
    vec3 position;
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};

//Constants
const float radius = 0.05;
const int size = 20;

//Shadows smoothing directions
const vec3 offsets[size] = vec3[]
(
   vec3(1, 1,  1), vec3( 1, -1,  1), vec3(-1, -1,  1), vec3(-1, 1,  1), 
   vec3(1, 1, -1), vec3( 1, -1, -1), vec3(-1, -1, -1), vec3(-1, 1, -1),
   vec3(1, 1,  0), vec3( 1, -1,  0), vec3(-1, -1,  0), vec3(-1, 1,  0),
   vec3(1, 0,  1), vec3(-1,  0,  1), vec3( 1,  0, -1), vec3(-1, 0, -1),
   vec3(0, 1,  1), vec3( 0, -1,  1), vec3( 0, -1, -1), vec3( 0, 1, -1)
);

//Vertex colour
out vec4 fragColour;

//Input vectors
in vec3 normal;
in vec3 fragPosition;
in vec2 texCoord;
in vec4 lightSpacePosition;

//Texture
uniform int state;
uniform sampler2D tex1;
uniform sampler2D tex2;
uniform vec3 colour;

//Shadows
uniform bool useShadows;
uniform samplerCube shadowMap;
uniform float farPlane;

//Lighting
uniform Material material;
uniform Light light;
uniform vec3 cameraPosition;
  
void main()
{
    //Pixel colour
    vec3 fragmentColour;
    switch (state)
    {
        case 0:
            fragmentColour = colour; break;
        case 1:
            fragmentColour = texture(tex1, texCoord).rgb; break;
        case 2:
            fragmentColour = texture(tex2, texCoord).rgb; break;
        default:
            fragmentColour = vec3(1.0); break;
    }

    //Ambient light
    vec3 ambient = light.ambient * material.ambient;

    //Diffuse
    vec3 n = normalize(normal);
    vec3 diff = fragPosition - light.position;
    vec3 lightDir = normalize(-diff);
    vec3 diffuse = max(dot(n, lightDir), 0.0) * light.diffuse * material.diffuse;

    //Specular
    vec3 viewDir = cameraPosition - fragPosition;
    vec3 specular = pow(max(dot(normalize(viewDir), reflect(-lightDir, n)), 0.0), material.shininess) * light.specular * material.specular;

    //Shadows
    float shadows;
    if (useShadows)
    {
        shadows = 0.0;
        float tolerance = length(diff) - max(0.5 * (1.0 - dot(normal, lightDir)), 0.05);
        float radius = (1.0 + (length(viewDir) / farPlane)) / 25.0;
        //PCF
        for (int i = 0; i < size; i++)
        {
            if (tolerance > (texture(shadowMap, diff + (offsets[i] * radius)).r * farPlane))
            {
                shadows++;
            }
        }
        shadows = 1.0f - (shadows / size);
    }
    else { shadows = 1.0; }

    //Final
    fragColour = vec4((ambient + (shadows * (diffuse + specular))) * fragmentColour, 1.0);
}