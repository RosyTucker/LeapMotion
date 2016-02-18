import Cylon from 'cylon';
import Logger from './Logger.es6.js';
import d3 from 'd3';
import THREE from 'three';

let scene, camera, renderer, mesh, geometry;


const getShapeGeometry = () => {
    const shape = new THREE.Shape();

    shape.moveTo(0, 0);
    shape.bezierCurveTo(0, 0, 0, 10, 10, 10);
    //shape.bezierCurveTo( 30, 0, 30, 35,30,35 );
    //shape.bezierCurveTo( 30, 55, 10, 77, 25, 95 );
    //shape.bezierCurveTo( 60, 77, 80, 55, 80, 35 );
    //shape.bezierCurveTo( 80, 35, 80, 0, 50, 0 );
    //shape.bezierCurveTo( 35, 0, 25, 25, 25, 25 );

    const extrudeSettings = {
        amount: 8,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 2,
        bevelSize: 1,
        bevelThickness: 1
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
};

const moveShape = () => {
    geometry.vertices.forEach((vert) => {
        vert.x -= 100;
        vert.y -= 100;
    });
    mesh.geometry.__dirtyVertices = true;
};

const initScene = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 0, 500);
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

const animate = () => {
    requestAnimationFrame(animate);
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;
    moveShape();
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
            my.leapmotion.on('hand', (hand) => {
                console.log(hand);
                animate();
            });

        }

    }).start();
};