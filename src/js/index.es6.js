import Cylon from 'cylon';
import Logger from './Logger.es6.js';
import d3 from 'd3';
import THREE from 'three';

let scene, camera, renderer, mesh, geometry;


const getShapeGeometry = () => {
    return new THREE.SphereGeometry(5, 8, 8);
};

const moveShape = (position) => {
    console.log(position);
    mesh.position.set(position[0], position[1], position[2]);
};

const initScene = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
    camera.position.set(118, 118, 70);
    scene.add(camera);

    const light = new THREE.PointLight(0xffffff, 0.8);
    camera.add(light);

    geometry = getShapeGeometry();
    geometry.dynamic = true;
    mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color: '#f00000'}));
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('leap-canvas').appendChild(renderer.domElement);
};

const animate = (position) => {
    moveShape(position);
    renderer.render(scene, camera);
};

window.onload = () => {
    Cylon.robot({
        connections: {
            leapmotion: {adaptor: 'leapmotion'}
        },

        devices: {
            leapmotion: {driver: 'leapmotion'}
        },

        work(my) {
            initScene();
            my.leapmotion.on('frame', (frame) => {
                //console.log(frame.interactionBox);
            });
            my.leapmotion.on('hand', (hand) => {
                animate(hand.palmPosition);
            });

        }

    }).start();
};