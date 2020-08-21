import * as THREE from 'three';
import {noise1D, noise2D, noise3D} from './perlin';

const scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var geometry = new THREE.BoxGeometry();
var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
var cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

camera.position.y = -50;
camera.position.z = 50;

camera.rotation.set(0.175 * Math.PI, 0, 0);

noise3D(0.0, 0.0, 0.0);
noise2D(0.0, 0.0);

const points = [];
for (let i = -200; i < 200; i++) {
    points.push(new THREE.Vector3(i/10, 10 * noise1D(i/100), 0));
}

const line_geometry = new THREE.BufferGeometry().setFromPoints(points);
const line_material = new THREE.LineBasicMaterial({color : 0x0000FF});
const line = new THREE.Line(line_geometry, line_material);

scene.add(line);

const plane1_geometry = new THREE.PlaneGeometry(100, 100, 100, 100);
const plane1_material = new THREE.MeshPhongMaterial({color : 0xFFFF00, wireframe : false});
const plane1 = new THREE.Mesh(plane1_geometry, plane1_material);

for (let i = 0; i < plane1_geometry.vertices.length; i++) {
    const element = plane1_geometry.vertices[i];
    element.z = 20 * noise2D(element.x/20, element.y/20);
}
plane1_geometry.computeVertexNormals();

//scene.add(plane1);

const plane2_v_shade = `
varying vec4 color;
varying float z;
uniform float maxHeight;

void main() {
    z = position.z;
    if (z < -0.2) {
        z = -0.2;
    }
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xy, z, 1.0);
    z = z / maxHeight;
}
`;

const plane2_f_shade = `
varying vec4 color;
varying float z;

void main() {
    vec3 step_color;
    step_color = mix(vec3(0.0, 0.0, 1.0), vec3(1.0, 1.0 , 0.0), smoothstep(0.0, 0.1, z));
    step_color = mix(step_color, vec3(0.0, 1.0, 0.0), smoothstep(0.1, 0.2, z));
    step_color = mix(step_color, vec3(0.5, 0.5, 0.5), smoothstep(0.2, 0.5, z));
    step_color = mix(step_color, vec3(1.0, 1.0, 1.0), smoothstep(0.5, 0.7, z));

    gl_FragColor = vec4(step_color, 1.0);
}
`;

const plane2_geometry = new THREE.PlaneGeometry(100, 100, 20, 20);
const plane2_material = new THREE.ShaderMaterial({
    uniforms: {
        maxHeight: {value: 20}
    },
    vertexShader: plane2_v_shade,
    fragmentShader: plane2_f_shade,
});

for (let i = 0; i < plane2_geometry.vertices.length; i++) {
    const element = plane2_geometry.vertices[i];
    element.z = 20 * noise2D(element.x/20, element.y/20);
}
plane2_geometry.computeVertexNormals();
const plane2 = new THREE.Mesh(plane2_geometry, plane2_material);

scene.add(plane2);

const dir_light = new THREE.DirectionalLight(0xAAAAAA, 0.5);
dir_light.position.set(0,1,1);

scene.add(dir_light);

const fpsDisplay = document.createElement('div');
document.body.appendChild(fpsDisplay);
fpsDisplay.style.position = 'absolute';
fpsDisplay.style.top = '0';
fpsDisplay.style.left = '0';
fpsDisplay.style.backgroundColor = '#4444ff';
fpsDisplay.style.width = '5ch';
fpsDisplay.style.textAlign = 'center';
fpsDisplay.innerText = '/';
let fpsTime = window.performance.now();
let frames = 0;

let time = 0;
const animate = function () {
    requestAnimationFrame(animate);

    //cube.rotation.x += 0.01;
    //cube.rotation.y += 0.01;
    for (let i = 0; i < plane2_geometry.vertices.length; i++) {
        const element = plane2_geometry.vertices[i];
        element.z =
            20 * noise2D(element.x/20+Math.sin(time), element.y/20+time)
            + 2 * noise2D((element.x/20+Math.sin(time))*5, (element.y/20+time)*5);
    }
    plane2_geometry.verticesNeedUpdate = true;
    time += 0.01;

    frames++;

    let newFPSTime = window.performance.now();
    let diff = newFPSTime - fpsTime;
    if(diff > 1000) {
        fpsDisplay.innerText = ''+frames;
        fpsTime = newFPSTime;
        frames = 0;
    }

    renderer.render(scene, camera);
};

animate();

window.THREE = THREE;
