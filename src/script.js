import * as THREE from 'three'
import { OrbitControls } from 'three/addons'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Axes helper
const axesHelper = new THREE.AxesHelper(10)
scene.add(axesHelper)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

// Floor
const floorAlphaTexture = textureLoader.load('/textures/floor/alpha.webp')

const floorColorTexture = textureLoader.load('/textures/floor/snow/snow_02_diff_1k.jpg')
const floorARMTexture = textureLoader.load('/textures/floor/snow/snow_02_arm_1k.jpg')
const floorNormalTexture = textureLoader.load('/textures/floor/snow/snow_02_nor_gl_1k.jpg')
const floorDisplacementTexture = textureLoader.load('/textures/floor/snow/snow_02_disp_1k.jpg')

const FLOOR_TEXTURES = [
    floorColorTexture,
    floorARMTexture,
    floorNormalTexture,
    floorDisplacementTexture,
]

floorColorTexture.colorSpace = THREE.SRGBColorSpace

FLOOR_TEXTURES.forEach(texture => {
    texture.repeat.set(2, 2)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
})

// Walls
const wallColorTexture = textureLoader.load('/textures/walls/wood_planks_diff_1k.jpg')
const wallARMTexture = textureLoader.load('/textures/walls/wood_planks_arm_1k.jpg')
const wallNormalTexture = textureLoader.load('/textures/walls/wood_planks_nor_gl_1k.jpg')
const wallDisplacementTexture = textureLoader.load('/textures/walls/wood_planks_disp_1k.jpg')

wallColorTexture.colorSpace = THREE.SRGBColorSpace

// Door
const doorColorTexture = textureLoader.load('/textures/door/rough_pine_door_diff_1k.jpg')
const doorARMTexture = textureLoader.load('/textures/door/rough_pine_door_arm_1k.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/rough_pine_door_nor_gl_1k.jpg')
const doorDisplacementTexture = textureLoader.load('/textures/door/rough_pine_door_disp_1k.jpg')

doorColorTexture.colorSpace = THREE.SRGBColorSpace

/**
 * House
 */
const houseMeasurements = {
    width: 5,
    depth: 6,
    height: 3.5,

    doorWidth: 1.5,
    doorHeight: 2.2,
}

const roofHeight = 2

const roofMeasurements = {
    height: roofHeight,

    plateHeight: 0.2,
    plateDepth: 7,
    plateWidth: Math.sqrt((houseMeasurements.width / 2) ** 2 + roofHeight ** 2)
}

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 40, 200, 200),
    new THREE.MeshStandardMaterial({
        transparent: true,
        alphaMap: floorAlphaTexture,
        map: floorColorTexture,
        aoMap: floorARMTexture,
        roughnessMap: floorARMTexture,
        metalnessMap: floorARMTexture,
        normalMap: floorNormalTexture,
        displacementMap: floorDisplacementTexture,
        displacementScale: 0.3,
        displacementBias: -0.2,
    })
)

floor.rotation.x = - Math.PI / 2

scene.add(floor)

// House container
const house = new THREE.Group()
scene.add(house)

const wallsMaterial = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    map: wallColorTexture,
    aoMap: wallARMTexture,
    roughnessMap: wallARMTexture,
    metalnessMap: wallARMTexture,
    normalMap: wallNormalTexture,
    // displacementMap: wallDisplacementTexture,
    // displacementScale: 0.2,
    // displacementBias: -0.2,
})

// Walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(
        houseMeasurements.width,
        houseMeasurements.height,
        houseMeasurements.depth,
        100, 100, 100
    ),
    wallsMaterial,
)
walls.position.y = houseMeasurements.height / 2
house.add(walls)

// Roof
const roof = new THREE.Object3D()

const roofLeft = new THREE.Mesh(
    new THREE.BoxGeometry(roofMeasurements.plateWidth, roofMeasurements.plateHeight, roofMeasurements.plateDepth),
    wallsMaterial,
)

roofLeft.position.y = houseMeasurements.height + roofMeasurements.height / 2
roofLeft.position.x = -houseMeasurements.width / 4
roofLeft.rotation.z = Math.PI * 0.2
roof.add(roofLeft)

const roofRight = roofLeft.clone()
roofRight.rotation.z = -Math.PI * 0.2
roofRight.position.x = houseMeasurements.width / 4
roof.add(roofRight)

// Roof front and back
const vertices = new Float32Array([
    // left side
    -houseMeasurements.width / 2, 0, -houseMeasurements.depth / 2,   // bottom left
    houseMeasurements.width / 2, 0, -houseMeasurements.depth / 2,   // bottom right
    0, roofMeasurements.height, -houseMeasurements.depth / 2, // top

    // right side
    -houseMeasurements.width / 2, 0,  houseMeasurements.depth / 2,
    houseMeasurements.width / 2, 0,  houseMeasurements.depth / 2,
    0, roofMeasurements.height,  houseMeasurements.depth / 2,
])

const indices = [
    0, 1, 2, // front triangle
    3, 5, 4  // back triangle
]

const bufferGeometry = new THREE.BufferGeometry()
bufferGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(vertices, 3)
)
bufferGeometry.setIndex(indices)
const uvs = new Float32Array([
    // front triangle
    0, 0,   // bottom left
    1, 0,   // bottom right
    0.5, 1, // top

    // back triangle
    0, 0,
    1, 0,
    0.5, 1,
])

bufferGeometry.setAttribute(
    'uv',
    new THREE.BufferAttribute(uvs, 2)
)
bufferGeometry.computeVertexNormals()

const roofFrontAndBack = new THREE.Mesh(
    bufferGeometry,
    wallsMaterial,
)

roofFrontAndBack.position.y = houseMeasurements.height
roof.add(roofFrontAndBack)

house.add(roof)

// Door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(houseMeasurements.doorWidth, houseMeasurements.doorHeight, 100, 100),
    new THREE.MeshStandardMaterial({
        color: 'red',
        map: doorColorTexture,
        aoMap: doorARMTexture,
        roughnessMap: doorARMTexture,
        metalnessMap: doorARMTexture,
        normalMap: doorNormalTexture,
        //displacementMap: doorDisplacementTexture,
    }),
)

// Add 0.01 to prevent z-fighting
door.position.z = houseMeasurements.depth / 2 + 0.01
door.position.y = houseMeasurements.doorHeight / 2

house.add(door)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#ffffff', 1.5)
directionalLight.position.set(3, 2, -8)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const timer = new THREE.Timer()

const tick = () =>
{
    // Timer
    timer.update()
    const elapsedTime = timer.getElapsed()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()