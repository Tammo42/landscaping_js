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

void main() {
    z = position.z;
    if (z < 0.0) {
        z = 0.0;
    }
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xy, z, 1.0);

    if (z <= 0.0) {
        color = vec4(0.0, 0.0, 1.0, 1.0);
    } else if (z < 10.0) {
        color = vec4(0.0, 1.0, 0.0, 1.0);
    } else if (true) {
        color = vec4(0.6, 0.6, 0.6, 0.0);
    } else {
        //discard;
    }
}
`;

const plane2_f_shade = `
varying vec4 color;
varying float z;

void main() {
    gl_FragColor = color;
}
`;

const plane2_geometry = new THREE.PlaneGeometry(100, 100, 20, 20);
const plane2_material = new THREE.ShaderMaterial({
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

var animate = function () {
    //requestAnimationFrame(animate);

    //cube.rotation.x += 0.01;
    //cube.rotation.y += 0.01;

    renderer.render(scene, camera);
};

animate();