precision highp float;

varying vec3 vWorldNormal;
varying vec3 vWorldPosition;
varying vec3 vObjectCenter;

void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    
    vObjectCenter = modelMatrix[3].xyz; 
    
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
}