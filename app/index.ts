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

const plane_geometry = new THREE.PlaneGeometry(100, 100, 100, 100);
const plane_material = new THREE.MeshPhongMaterial({color : 0xFFFF00, wireframe : false});
const plane = new THREE.Mesh(plane_geometry, plane_material);

for (let i = 0; i < plane_geometry.vertices.length; i++) {
    const element = plane_geometry.vertices[i];
    element.z = 20 * noise2D(element.x/20, element.y/20);
}
plane_geometry.computeVertexNormals();

scene.add(plane);

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