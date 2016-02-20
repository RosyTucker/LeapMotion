import Cylon from 'cylon';
import Logger from './Logger.es6.js';
import d3 from 'd3';
import THREE from 'three';

const SCALE = 0.9, CAMERA_CONFIG = {
    fieldOfView: 50,
    near: 0.1,
    far: 10000
};

let scene, camera, renderer, mesh, geometry;

const moveShape = (position) => {
    mesh.position.set(position[0], position[1], position[2]);
};

const initScene = () => {
    scene = new THREE.Scene();
    const aspectRatio = (window.innerWidth / window.innerHeight) * SCALE;
    camera = new THREE.PerspectiveCamera(CAMERA_CONFIG.fieldOfView, aspectRatio, CAMERA_CONFIG.near, CAMERA_CONFIG.far);
    camera.position.z = 200;
    camera.position.y = 200;
    scene.add(camera);

    const light = new THREE.PointLight(0xffffff, 0.8);
    camera.add(light);

    geometry = new THREE.SphereGeometry(5, 8, 8);
    geometry.dynamic = true;
    mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color: '#f00000'}));
    mesh.position.set(0, 0, 0);
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth * SCALE, window.innerHeight * SCALE);
    document.getElementById('leap-canvas').appendChild(renderer.domElement);
};

const animate = (position) => {
    moveShape(position);
    renderer.render(scene, camera);
};

window.onload = () => {
    Cylon.robot({
        connections: {leapmotion: {adaptor: 'leapmotion'}},
        devices: {leapmotion: {driver: 'leapmotion'}},

        work(my) {
            initScene();
            my.leapmotion.on('hand', (hand) => {
                animate(hand.palmPosition);
            });
        }

    }).start();
};