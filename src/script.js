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

// Roof
const roofColorTexture = textureLoader.load('/textures/roof/clay_roof_tiles_03_diff_1k.jpg')
const roofARMTexture = textureLoader.load('/textures/roof/clay_roof_tiles_03_arm_1k.jpg')
const roofNormalTexture = textureLoader.load('/textures/roof/clay_roof_tiles_03_nor_gl_1k.jpg')
const roofDisplacementTexture = textureLoader.load('/textures/roof/clay_roof_tiles_03_disp_1k.jpg')

roofColorTexture.center.set(0.5, 0.5)
roofColorTexture.rotation = Math.PI / 2

roofARMTexture.center.set(0.5, 0.5)
roofARMTexture.rotation = Math.PI / 2

roofNormalTexture.center.set(0.5, 0.5)
roofNormalTexture.rotation = Math.PI / 2

roofDisplacementTexture.center.set(0.5, 0.5)
roofDisplacementTexture.rotation = Math.PI / 2

roofColorTexture.colorSpace = THREE.SRGBColorSpace

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
    height: 3,

    doorWidth: 1.5,
    doorHeight: 2.2,
}

const roofHeight = 2

const roofMeasurements = {
    height: roofHeight,

    plateHeight: 0.2,
    plateDepth: 7,
    plateWidth: Math.sqrt((houseMeasurements.width / 2) ** 2 + roofHeight ** 2) + 0.5
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
})

// Walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(
        houseMeasurements.width,
        houseMeasurements.height,
        houseMeasurements.depth,
    ),
    wallsMaterial,
)
walls.position.y = houseMeasurements.height / 2
house.add(walls)

// Windows
const cozyWindowSize = 0.8
const windowGeo = new THREE.PlaneGeometry(cozyWindowSize, cozyWindowSize);
const windowMat = new THREE.MeshStandardMaterial({ color: 0xffffff });

const rimGeometry = new THREE.TorusGeometry(0.55, 0.1, 5, 4)
const rimMaterial = new THREE.MeshStandardMaterial({color: 0x5C413C, side: THREE.DoubleSide,})

const stickGeometry = new THREE.BoxGeometry(cozyWindowSize, 0.05, 0.1)

function createWindow({x, y, z, rotation = 0}) {
    const cozyWindow = new THREE.Object3D()

    // Window plane
    const plane = new THREE.Mesh(windowGeo, windowMat);
    plane.position.set(x, y, z);
    plane.rotation.y = rotation
    cozyWindow.add(plane);

    // Light
    const rectLight = new THREE.RectAreaLight(0xffaa55, 5, cozyWindowSize, cozyWindowSize);
    rectLight.position.copy(plane.position);
    rectLight.position.z += 0.01
    rectLight.position.x += 0.01
    rectLight.position.y += 0.01
    rectLight.rotation.y = rotation
    cozyWindow.add(rectLight);

    // Rim
    const rim = new THREE.Mesh(rimGeometry, rimMaterial)
    rim.position.set(x, y, z)
    rim.rotation.z = Math.PI / 4
    rim.rotation.y = rotation
    cozyWindow.add(rim)

    // Cross
    const stick1 = new THREE.Mesh(stickGeometry, rimMaterial)
    stick1.position.set(x, y + 0.05, z)
    stick1.rotation.y = rotation
    cozyWindow.add(stick1)

    const stick2 = new THREE.Mesh(stickGeometry, rimMaterial)
    stick2.position.set(x, y, z)
    stick2.rotation.z = Math.PI / 2
    stick2.rotation.y = rotation
    cozyWindow.add(stick2)

    house.add(cozyWindow)
}

const cozyWindows = [
    // Front windows
    {
        x: houseMeasurements.width / 2 - 0.9,
        y: 1.55,
        z: houseMeasurements.depth / 2 + 0.01,
    },
    {
        x: - houseMeasurements.width / 2 + 0.9,
        y: 1.55,
        z: houseMeasurements.depth / 2 + 0.01,
    },
    {
        x: 0,
        y: houseMeasurements.height + roofMeasurements.height / 2 - cozyWindowSize / 2,
        z: houseMeasurements.depth / 2 + 0.01,
    },

    // Right side windows
    {
        x: houseMeasurements.width / 2 + 0.01,
        y: 1.55,
        z: houseMeasurements.depth / 2 - 0.9,
        rotation: Math.PI / 2,
    },
    {
        x: houseMeasurements.width / 2 + 0.01,
        y: 1.55,
        z: - houseMeasurements.depth / 2 + 0.9,
        rotation: Math.PI / 2,
    },
    {
        x: houseMeasurements.width / 2 + 0.01,
        y: 1.55,
        z: 0,
        rotation: Math.PI / 2,
    },
]

for (const cozyWindow of cozyWindows) {
    createWindow(cozyWindow)
}

// Roof
const roof = new THREE.Object3D()

const roofMaterial = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    map: roofColorTexture,
    aoMap: roofARMTexture,
    roughnessMap: roofARMTexture,
    metalnessMap: roofARMTexture,
    normalMap: roofNormalTexture,
    displacementMap: roofDisplacementTexture,
    displacementScale: 0.3,
    displacementBias: -0.2,
})

const roofLeft = new THREE.Mesh(
    new THREE.BoxGeometry(roofMeasurements.plateWidth, roofMeasurements.plateHeight, roofMeasurements.plateDepth, 100, 100),
    roofMaterial,
)

roofLeft.position.y = houseMeasurements.height + roofMeasurements.height / 2
roofLeft.position.x = -houseMeasurements.width / 4
// Hack: add extra PI to flip the texture
roofLeft.rotation.z = Math.PI * 0.2 + Math.PI
roof.add(roofLeft)

const roofRight = new THREE.Mesh(
    new THREE.BoxGeometry(roofMeasurements.plateWidth, roofMeasurements.plateHeight, roofMeasurements.plateDepth + 0.02, 100, 100),
    roofMaterial,
)

roofRight.position.y = houseMeasurements.height + roofMeasurements.height / 2
roofRight.position.x = -houseMeasurements.width / 4
roofRight.rotation.z = Math.PI * 0.2

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
house.add(roofFrontAndBack)

house.add(roof)

// Door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(houseMeasurements.doorWidth, houseMeasurements.doorHeight, 100, 100),
    new THREE.MeshStandardMaterial({
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
const ambientLight = new THREE.AmbientLight('#ffffff', 0.7)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#ffffff', 1.5)
directionalLight.position.set(10, 5, 3)
scene.add(directionalLight)

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight)
scene.add(directionalLightHelper)

/**
 * Fog
 */
scene.background = new THREE.Color('#191D3B')
scene.fog = new THREE.Fog('#191D3B', 10, 40)

/**
 * Snow
 */
const snowSpheres = [];
const snowCount = 1000;
const geometry = new THREE.SphereGeometry(0.05, 6, 6);
const material = new THREE.MeshStandardMaterial({ color: 0xffffff });

for (let i = 0; i < snowCount; i++) {
    const sphere = new THREE.Mesh(geometry, material);

    sphere.position.set(
        (Math.random() - 0.5) * 50,
        Math.random() * 50,
        (Math.random() - 0.5) * 50
    );

    scene.add(sphere);
    snowSpheres.push(sphere);
}

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
 * Shadows
 */
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap

// Cast and receive
directionalLight.castShadow = true

walls.castShadow = true
roofLeft.castShadow = true
roofRight.castShadow = true
roofFrontAndBack.castShadow = true
floor.receiveShadow = true

// Optimize performance
directionalLight.shadow.mapSize.width = 256
directionalLight.shadow.mapSize.height = 256
directionalLight.shadow.camera.top = 8
directionalLight.shadow.camera.right = 8
directionalLight.shadow.camera.bottom = -8
directionalLight.shadow.camera.left = -8
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 40

/**
 * Animate
 */

function animateSnowSpheres() {
    snowSpheres.forEach(s => {
        s.position.y -= 0.1; // falling speed
        s.position.x -= Math.random() * 0.01
        s.position.z += Math.random() * 0.01

        // reset
        if (s.position.y < 0) {
            s.position.set(
                (Math.random() - 0.5) * 50,
                Math.random() * 50,
                (Math.random() - 0.5) * 50
            );

        }
    });
}

const timer = new THREE.Timer()

const tick = () =>
{
    // Timer
    timer.update()
    const elapsedTime = timer.getElapsed()
    animateSnowSpheres()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()