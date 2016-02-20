import Cylon from 'cylon';
import Logger from './Logger.es6.js';
import d3 from 'd3';
import THREE from 'three';

const SCALE = 0.9, CAMERA_CONFIG = {
    fieldOfView: 90,
    near: 0.1,
    far: 10000
};

let scene, camera, renderer, leftHand, rightHand;

const setPosition = (mesh, positionVector) => {
    mesh.position.set(positionVector[0], positionVector[1], positionVector[2]);
};

const moveFinger = (finger, fingerModel) => {
    setPosition(finger.carp, fingerModel.carpPosition);
    setPosition(finger.dip, fingerModel.dipPosition);
    setPosition(finger.mcp, fingerModel.mcpPosition);
    setPosition(finger.pip, fingerModel.pipPosition);
    setPosition(finger.tip, fingerModel.tipPosition);
};

const moveHand = (hand, handModel) => {
    setPosition(hand.palm, handModel.palmPosition);
    moveFinger(hand.thumb, handModel.thumb);
    moveFinger(hand.indexFinger, handModel.indexFinger);
    moveFinger(hand.middleFinger, handModel.middleFinger);
    moveFinger(hand.ringFinger, handModel.ringFinger);
    moveFinger(hand.pinky, handModel.pinky);
};

const sphere = (color = '#f00000', radius = 5) => {
    const geometry = new THREE.SphereGeometry(radius, 8, 8);
    geometry.dynamic = true;
    return new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color: color}));
};

const getFinger = (color) => {
    return {
        carp: sphere(color),
        dip: sphere(color),
        mcp: sphere(color),
        pip: sphere(color),
        tip: sphere(color)
    }
};

const getHand = () => {
    return {
        palm: sphere('#00f000', 10),
        thumb: getFinger('#f00000'),
        indexFinger: getFinger('#0000f0'),
        middleFinger: getFinger('#f0f000'),
        ringFinger: getFinger('#f000f0'),
        pinky: getFinger('#00f0f0')
    };
};

const addFingerToScene = (scene, finger) => {
    scene.add(finger.carp);
    scene.add(finger.dip);
    scene.add(finger.mcp);
    scene.add(finger.pip);
    scene.add(finger.tip);
};

const addHandToScene = (scene, hand) => {
    scene.add(hand.palm);
    addFingerToScene(scene, hand.thumb);
    addFingerToScene(scene, hand.indexFinger);
    addFingerToScene(scene, hand.middleFinger);
    addFingerToScene(scene, hand.ringFinger);
    addFingerToScene(scene, hand.pinky);
};

const initScene = () => {
    scene = new THREE.Scene();
    const aspectRatio = (window.innerWidth / window.innerHeight) * SCALE;
    camera = new THREE.PerspectiveCamera(CAMERA_CONFIG.fieldOfView, aspectRatio, CAMERA_CONFIG.near, CAMERA_CONFIG.far);
    camera.position.z = 200;
    camera.position.y = 200;
    scene.add(camera);

    leftHand = getHand();
    addHandToScene(scene, leftHand);
    rightHand = getHand();
    addHandToScene(scene, rightHand);

    const light = new THREE.PointLight(0xffffff, 0.8);
    camera.add(light);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth * SCALE, window.innerHeight * SCALE);
    document.getElementById('leap-canvas').appendChild(renderer.domElement);
};

const animate = (hand, handModel) => {
    moveHand(hand, handModel);
    renderer.render(scene, camera);
};

window.onload = () => {
    Cylon.robot({
        connections: {leapmotion: {adaptor: 'leapmotion'}},
        devices: {leapmotion: {driver: 'leapmotion'}},

        work(my) {
            initScene();
            my.leapmotion.on('hand', (handModel) => {
                if (handModel.type === 'left') {
                    animate(leftHand, handModel);
                }
                if (handModel.type === 'right') {
                    animate(rightHand, handModel);
                }
            });
        }

    }).start();
};