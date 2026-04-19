import * as THREE from 'three'
import { OrbitControls } from 'three/addons'
import GUI from 'lil-gui'
import { GLTFLoader, DRACOLoader } from 'three/addons'

/**
 * Base
 */
// Debug
const gui = new GUI()
gui.hide()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Axes helper
const axesHelper = new THREE.AxesHelper(10)
// scene.add(axesHelper)

/**
 * Update all materials
 */
const updateAllMaterials = () =>
{
    scene.traverse((child) =>
    {
        if(child.isMesh)
        {
            // Activate shadow here
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}

/**
 * Models
 */
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

let mixer = null

let walkingFoxAction = null
let lookAroundFoxAction = null
let runningFoxAction = null

let gltfScene = null
let gltfAnimations = null

gltfLoader.load(
    'models/Pinetree/pine.glb',
    (gltf) => {
        const pineTreeModel = gltf.scene

        const treeCount = 20
        const pineTreeGroup = new THREE.Group()

        for (let i = 0; i < treeCount; i++) {
            const tree = pineTreeModel.clone()

            const angle = Math.random() * Math.PI * 2
            const houseOuterRadius = Math.sqrt(houseMeasurements.width ** 2 + houseMeasurements.depth ** 2) / 2
            const radius = (houseOuterRadius + 3) + Math.random() * 10
            let x = Math.sin(angle) * radius
            let z = Math.cos(angle) * radius

            // Keep the first quadrant empty
            if (x > 0) {
                z = -Math.abs(z)
            }

            const scale = 0.12 + Math.random() * 0.08
            tree.scale.setScalar(scale)
            tree.rotation.y = Math.random() * Math.PI
            tree.position.set(
                x,
                0,
                z,
            )

            pineTreeGroup.add(tree)
        }

        scene.add(pineTreeGroup)

        updateAllMaterials()
    }
)

gltfLoader.load(
    'models/Fox/glTF/Fox.gltf',
    (gltf) => {
        mixer = new THREE.AnimationMixer(gltf.scene)
        walkingFoxAction = mixer.clipAction(gltf.animations[1])
        lookAroundFoxAction = mixer.clipAction(gltf.animations[0])
        runningFoxAction = mixer.clipAction(gltf.animations[2])

        walkingFoxAction.play()

        gltf.scene.scale.setScalar(0.015)
        gltf.scene.position.set(-20,0,8)
        gltf.scene.rotation.y = Math.PI / 2

        gltfScene = gltf.scene
        gltfAnimations = gltf.animations

        scene.add(gltf.scene)
    },
)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

// Snowflake
const snowflakeTexture = textureLoader.load('textures/weather/snowflake.png')

// Tree trunks
const trunkColorTexture = textureLoader.load('textures/trees/pine/pine_bark_diff_1k.jpg')
const trunkARMTexture = textureLoader.load('textures/trees/pine/pine_bark_arm_1k.jpg')
const trunkNormalTexture = textureLoader.load('textures/trees/pine/pine_bark_nor_gl_1k.jpg')
const trunkDisplacementTexture = textureLoader.load('textures/trees/pine/pine_bark_disp_1k.jpg')

trunkColorTexture.colorSpace = THREE.SRGBColorSpace

// Snowy pines
const treeColorTexture = textureLoader.load('textures/trees/snow/snow_03_diff_1k.jpg')
const treeARMTexture = textureLoader.load('textures/trees/snow/snow_03_arm_1k.jpg')
const treeNormalTexture = textureLoader.load('textures/trees/snow/snow_03_nor_gl_1k.jpg')
const treeDisplacementTexture = textureLoader.load('textures/trees/snow/snow_03_disp_1k.jpg')

treeColorTexture.colorSpace = THREE.SRGBColorSpace

treeColorTexture.repeat.set(3, 3)
treeColorTexture.wrapS = THREE.RepeatWrapping
treeColorTexture.wrapT = THREE.RepeatWrapping

treeARMTexture.repeat.set(3, 3)
treeARMTexture.wrapS = THREE.RepeatWrapping
treeARMTexture.wrapT = THREE.RepeatWrapping

treeNormalTexture.repeat.set(3, 3)
treeNormalTexture.wrapS = THREE.RepeatWrapping
treeNormalTexture.wrapT = THREE.RepeatWrapping

treeDisplacementTexture.repeat.set(3, 3)
treeDisplacementTexture.wrapS = THREE.RepeatWrapping
treeDisplacementTexture.wrapT = THREE.RepeatWrapping


// Floor
const floorAlphaTexture = textureLoader.load('textures/floor/alpha.webp')

const floorColorTexture = textureLoader.load('textures/floor/snow/snow_02_diff_1k.jpg')
const floorARMTexture = textureLoader.load('textures/floor/snow/snow_02_arm_1k.jpg')
const floorNormalTexture = textureLoader.load('textures/floor/snow/snow_02_nor_gl_1k.jpg')
const floorDisplacementTexture = textureLoader.load('textures/floor/snow/snow_02_disp_1k.jpg')

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
const wallColorTexture = textureLoader.load('textures/walls/shutter/wood_shutter_diff_1k.jpg')
const wallARMTexture = textureLoader.load('textures/walls/shutter/wood_shutter_arm_1k.jpg')
const wallNormalTexture = textureLoader.load('textures/walls/shutter/wood_shutter_nor_gl_1k.jpg')
const wallDisplacementTexture = textureLoader.load('textures/shutter/wood_shutter_disp_1k.jpg')

wallColorTexture.colorSpace = THREE.SRGBColorSpace

wallColorTexture.center.set(0.5, 0.5)
wallColorTexture.rotation = Math.PI / 2

wallARMTexture.center.set(0.5, 0.5)
wallARMTexture.rotation = Math.PI / 2

wallNormalTexture.center.set(0.5, 0.5)
wallNormalTexture.rotation = Math.PI / 2

wallDisplacementTexture.center.set(0.5, 0.5)
wallDisplacementTexture.rotation = Math.PI / 2

// Rim
const rimColorTexture = textureLoader.load('textures/rim/plywood_diff_1k.jpg')
const rimARMTexture = textureLoader.load('textures/rim/plywood_arm_1k.jpg')
const rimNormalTexture = textureLoader.load('textures/rim/plywood_nor_gl_1k.jpg')
const rimDisplacementTexture = textureLoader.load('textures/rim/plywood_disp_1k.jpg')

rimColorTexture.colorSpace = THREE.SRGBColorSpace

// Roof
const roofColorTexture = textureLoader.load('textures/roof/reeds/reed_roof_03_diff_1k.jpg')
const roofARMTexture = textureLoader.load('textures/roof/reeds/reed_roof_03_arm_1k.jpg')
const roofNormalTexture = textureLoader.load('textures/roof/reeds/reed_roof_03_nor_gl_1k.jpg')
const roofDisplacementTexture = textureLoader.load('textures/roof/reeds/reed_roof_03_disp_1k.jpg')

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
const doorColorTexture = textureLoader.load('textures/door/color.webp')
const doorAlphaTexture = textureLoader.load('textures/door/alpha.webp')
const doorAmbientOcclusionTexture = textureLoader.load('textures/door/ambientOcclusion.webp')
const doorHeightTexture = textureLoader.load('textures/door/height.webp')
const doorNormalTexture = textureLoader.load('textures/door/normal.webp')
const doorMetalnessTexture = textureLoader.load('textures/door/metalness.webp')
const doorRoughnessTexture = textureLoader.load('textures/door/roughness.webp')

doorColorTexture.colorSpace = THREE.SRGBColorSpace

/**
 * House
 */
const houseMeasurements = {
    width: 5,
    depth: 6,
    height: 3,

    doorWidth: 2.2,
    doorHeight: 2.2,
}

const roofHeight = 2

const roofMeasurements = {
    height: roofHeight,

    plateHeight: 0.2,
    plateDepth: 7,
    plateWidth: Math.sqrt((houseMeasurements.width / 2) ** 2 + roofHeight ** 2) + 0.5
}

const SCENE_WIDTH = 40

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(SCENE_WIDTH, SCENE_WIDTH, 200, 200),
    new THREE.MeshStandardMaterial({
        transparent: true,
        alphaMap: floorAlphaTexture,
        map: floorColorTexture,
        aoMap: floorARMTexture,
        roughnessMap: floorARMTexture,
        metalnessMap: floorARMTexture,
        normalMap: floorNormalTexture,
        displacementMap: floorDisplacementTexture,
        displacementScale: 0.5,
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
        100,
        100,
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
const rimMaterial = new THREE.MeshStandardMaterial({
    color: 0xd7935b,
    map: rimColorTexture,
    aoMap: rimARMTexture,
    roughnessMap: rimARMTexture,
    metalnessMap: rimARMTexture,
    normalMap: rimNormalTexture,
})

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
    color: 0x967C33,
    map: roofColorTexture,
    aoMap: roofARMTexture,
    roughnessMap: roofARMTexture,
    metalnessMap: roofARMTexture,
    normalMap: roofNormalTexture,
})

const roofLeft = new THREE.Mesh(
    new THREE.BoxGeometry(roofMeasurements.plateWidth, roofMeasurements.plateHeight, roofMeasurements.plateDepth, 100, 100),
    roofMaterial,
)

roofLeft.position.y = houseMeasurements.height + roofMeasurements.height / 2
roofLeft.position.x = -houseMeasurements.width / 4
// Hack: add extra PI to flip the texture
roofLeft.rotation.z = Math.PI * 0.2 + Math.PI
roofLeft.translateX(0.25)

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

roofRight.translateX(0.25)
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
        color: 0x6B6B6B,
        transparent: true,
        alphaMap: doorAlphaTexture,
        map: doorColorTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.15,
        displacementBasis: -0.04,
        roughnessMap: doorRoughnessTexture,
        metalnessMap: doorMetalnessTexture,
        normalMap: doorNormalTexture,
    }),
)

// Add 0.01 to prevent z-fighting
door.position.z = houseMeasurements.depth / 2 + 0.01
door.position.y = houseMeasurements.doorHeight / 2

house.add(door)

// Door rim
const doorRimGroup = new THREE.Group()
const doorRimGeometry = new THREE.BoxGeometry(0.2, houseMeasurements.doorHeight + 0.2, 0.2)

const doorRimLeft = new THREE.Mesh(doorRimGeometry, rimMaterial)
doorRimLeft.position.set(
    -houseMeasurements.doorWidth / 2 + 0.4,
    houseMeasurements.doorHeight / 2,
    houseMeasurements.depth / 2
)
doorRimGroup.add(doorRimLeft)

const doorRimRight = new THREE.Mesh(doorRimGeometry, rimMaterial)
doorRimRight.position.set(
    houseMeasurements.doorWidth / 2 - 0.4,
    houseMeasurements.doorHeight / 2,
    houseMeasurements.depth / 2
)
doorRimGroup.add(doorRimRight)

const doorRimTop = new THREE.Mesh(
    new THREE.BoxGeometry(houseMeasurements.doorWidth - 0.4, 0.2, 0.21),
    rimMaterial,
)
doorRimTop.position.set(
    0,
    houseMeasurements.doorHeight,
    houseMeasurements.depth / 2
)
doorRimGroup.add(doorRimTop)

house.add(doorRimGroup)


/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.7)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#F5F0BF', 4.4)
directionalLight.position.set(20, 5.5, 1.6)
scene.add(directionalLight)

gui.add(directionalLight, 'intensity')
    .min(0)
    .max(10)
    .step(0.001)
    .name('Light intensity')
gui.add(directionalLight.position, 'x').min(-20).max(20).step(0.001).name('Light X')
gui.add(directionalLight.position, 'y').min(-20).max(20).step(0.001).name('Light Y')
gui.add(directionalLight.position, 'z').min(-20).max(20).step(0.001).name('Light Z')
gui.add(directionalLight.shadow, 'normalBias').min(-0.05).max(0.05).step(0.001)
gui.add(directionalLight.shadow, 'bias').min(-0.05).max(0.05).step(0.001)

directionalLight.shadow.bias = -0.004

/**
 * Fog
 */
scene.background = new THREE.Color('#191D3B')
scene.fog = new THREE.Fog('#191D3B', 10, 40)

/**
 * Snow
 */

const particlesGeometry = new THREE.BufferGeometry()
const snowflakeCount = 50000
const snowflakePositions = new Float32Array(snowflakeCount * 3)

for (let i = 0; i < snowflakeCount; i++) {
    const i3 = i * 3

    // Keep snowflake inside the circle (R = 20)
    const planeRadius = SCENE_WIDTH / 2 + 3 // just so that they are slightly outside the lit area
    const angle = Math.random() * Math.PI * 2
    const radius = Math.sqrt(Math.random()) * planeRadius

    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius

    // x
    // Random number between [-20, 20]
    snowflakePositions[i3] = x
    // y
    // Always positive: we don't want underground snowflakes
    snowflakePositions[i3 + 1] = Math.random() * 20
    // z
    // Random number between [-20, 20]
    snowflakePositions[i3 + 2] = z
}

particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(snowflakePositions, 3)
)

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05,
    sizeAttenuation: true,
    alphaMap: snowflakeTexture,
    transparent: true,
    depthWrite: false,
})

const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

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
camera.position.x = 19
camera.position.y = 6
camera.position.z = 19
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Shadows
 */
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// Tone mapping
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 0.892

gui.add(renderer, 'toneMapping', {
    No: THREE.NoToneMapping,
    Linera: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping,
})

gui.add(renderer, 'toneMappingExposure').min(0.001).max(10).step(0.001)


// Cast and receive
directionalLight.castShadow = true

walls.castShadow = true
walls.receiveShadow = true
roofLeft.castShadow = true
roofRight.castShadow = true
roofFrontAndBack.castShadow = true
roofFrontAndBack.receiveShadow = true
floor.receiveShadow = true
doorRimTop.castShadow = true

// Optimize performance
// How sharp the shadows are
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.top = 20
directionalLight.shadow.camera.right = 20
directionalLight.shadow.camera.bottom = -20
directionalLight.shadow.camera.left = -20
directionalLight.shadow.camera.near = -10
directionalLight.shadow.camera.far = 80

// Helper
// const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(directionalLightCameraHelper)

/**
 * Animate
 */

function animateSnowflakes(elapsedTime) {
    particles.position.z = Math.sin(elapsedTime) * 0.05
    particles.position.x = Math.cos(elapsedTime) * 0.05

    for (let i = 0; i < snowflakeCount; i++) {
        const i3 = i * 3
        particlesGeometry.attributes.position.array[i3 + 1] -= 0.01

        const y = particlesGeometry.attributes.position.array[i3 + 1]

        if (y <= 1) {
            particlesGeometry.attributes.position.array[i3 + 1] = 20 + Math.random()
        }
    }
    particlesGeometry.attributes.position.needsUpdate = true
}

const timer = new THREE.Timer()

let foxStoppedTime = null

// State: 'walking' | 'idle'
let foxState = 'walking'
let hasStopped = false

let foxAngle = - Math.PI / 2
let foxRadius = 10
const foxAngularSpeed = 0.2 // radians per second

const tick = () =>
{
    // Timer
    timer.update()
    const elapsedTime = timer.getElapsed()
    const deltaTime = timer.getDelta()
    animateSnowflakes(elapsedTime)

    const idleTimeDone = foxStoppedTime && elapsedTime - foxStoppedTime > 2.5

    // Update mixer
    if (mixer !== null) {
        mixer.update(deltaTime)

        const reachedStopPoint = gltfScene.position.x >= 3

        if (foxState === 'walking' && reachedStopPoint && !hasStopped) {
            walkingFoxAction.crossFadeTo(lookAroundFoxAction, 1, false)
            lookAroundFoxAction.reset().play()
            foxStoppedTime = elapsedTime
            foxState = 'idle'
            hasStopped = true
        } else if (foxState === 'idle' && idleTimeDone) {
            lookAroundFoxAction.crossFadeTo(walkingFoxAction, 1, false)
            walkingFoxAction.reset().play()
            foxStoppedTime = null
            foxState = 'walking'
        }
    }

    // Update model position
    if (gltfScene !== null) {
        if (foxState === 'walking') {
            const prevX = gltfScene.position.x
            const prevZ = gltfScene.position.z

            // Move on the circle
            foxAngle -= deltaTime * foxAngularSpeed
            gltfScene.position.x = Math.cos(foxAngle) * foxRadius
            gltfScene.position.z = Math.sin(foxAngle) * foxRadius

            // Compute direction of movement
            const dx = gltfScene.position.x - prevX
            const dz = gltfScene.position.z - prevZ

            gltfScene.rotation.y = Math.atan2(dx, dz)
        }
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()