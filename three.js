import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { MapControls } from 'three/examples/jsm/controls/MapControls.js'

import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

const scene = new THREE.Scene();
//const camera = new THREE.OrthographicCamera( -5, 5, 5, -5, 0.1, 1000 );
const camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const controls = new MapControls( camera, renderer.domElement );

camera.position.z = 10;

const gridHelper = new THREE.GridHelper( 10, 10 );
scene.add( gridHelper );

const loader = new FontLoader();
const letters = [];

document.getElementById("textInput").addEventListener("input", updateText);
splitTextIntoLetters(document.getElementById("textInput").value);

function splitTextIntoLetters(text) {
  // Clear the existing letters
  letters.length = 0;

  // Split the text into individual characters
  for (let i = 0; i < text.length; i++) {
    letters.push(text[i]);
  }
}

function updateText() {


  //clear the scene of any existing text meshes
  for (let i = scene.children.length - 1; i >= 0; i--) {
    const child = scene.children[i];
    if (child instanceof THREE.Mesh && child.geometry instanceof TextGeometry) {
      scene.remove(child);
    }
  }

  // shift each letter so when a new letter is added the whole text stays centered on the scene
  let totalWidth = 0;
  for (let i = 0; i < letters.length; i++) {
    totalWidth += 0.6;
  }
  const offset = -totalWidth / 2;

  // Load the font and create the text geometry
  loader.load( 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function ( font ) {

    splitTextIntoLetters(document.getElementById("textInput").value);

    for (let i = 0; i < letters.length; i++) {
    const textGeometry = new TextGeometry( letters[i], {
      font: font,
      size: 0.5,
      height: 0.05,
      depth: 0.05,
      curveSegments: 12,
      steps: 1,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.005,
    } );

    const textMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff } );
    const textMesh = new THREE.Mesh( textGeometry, textMaterial );

    //center the text mesh on scene
    // textGeometry.computeBoundingBox();
    // const centerOffset = -0.5 * ( textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x );
    textMesh.position.x = offset + i * 0.6;

    //make each individual letter face the camera
    textMesh.lookAt(camera.position);

    scene.add( textMesh );
  }
  } );

}

function animate( time ) {
  controls.update();
  renderer.render( scene, camera );
  requestAnimationFrame(animate);

  // Calculate distance
  const distance = textMesh.position.distanceTo(camera.position);
  
  // Scale factor (adjust 0.05 to change visual size)
  const scaleFactor = distance * 0.05; 
  textMesh.scale.set(scaleFactor, scaleFactor, scaleFactor);

  // Keep it facing the camera
  textMesh.quaternion.copy(camera.quaternion);

  renderer.render(scene, camera);

}