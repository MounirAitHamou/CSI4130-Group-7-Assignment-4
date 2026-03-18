precision highp float;

varying vec3 vWorldNormal;
varying vec3 vWorldPosition;
varying vec3 vObjectCenter;

void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    
    // i assume the objects center is at 0,0,0 in object space, 
    // so we can just take the translation part of the model matrix
    vObjectCenter = modelMatrix[3].xyz; 
    
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
}