#version 450 core

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
const float tolerance = 0.001;

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
uniform sampler2D shadowMap;

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
    vec3 lightDir = normalize(light.position - fragPosition);
    vec3 diffuse = max(dot(n, lightDir), 0.0) * light.diffuse * material.diffuse;

    //Specular
    vec3 viewDir = normalize(cameraPosition - fragPosition);
    vec3 reflectDir = reflect(-lightDir, n);
    vec3 specular = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess) * light.specular * material.specular;

    //Shadow
    float shadow = 1.0f;
    if (useShadows)
    {
        vec3 projectedCoord = ((lightSpacePosition.xyz / lightSpacePosition.w) * 0.5) + 0.5;
        if (projectedCoord.z <= 1.0)
        {
            vec2 texel = 1.0 / textureSize(shadowMap, 0);
            for (int x = -1; x <= 1; ++x)
            {
                for (int y = -1; y <= 1; ++y)
                {
                    float depth = texture(shadowMap, projectedCoord.xy + (vec2(x, y) * texel)).r;
                    shadow += (projectedCoord.z - tolerance) > depth ? 0.0 : 1.0;
                }
            }
            shadow /= 9.0;
        }
    }

    //Final
    fragColour = vec4((ambient + (shadow * (diffuse + specular))) * fragmentColour, 1.0);
}