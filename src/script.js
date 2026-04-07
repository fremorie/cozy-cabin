import * as THREE from 'three'
import { OrbitControls } from 'three/addons'
import GUI from 'lil-gui'
import {debug} from "three/tsl";

/**
 * Base
 */
// Debug
// const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Axes helper
const axesHelper = new THREE.AxesHelper(10)
// scene.add(axesHelper)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

// Tree trunks
const trunkColorTexture = textureLoader.load('/textures/trees/pine/pine_bark_diff_1k.jpg')
const trunkARMTexture = textureLoader.load('/textures/trees/pine/pine_bark_arm_1k.jpg')
const trunkNormalTexture = textureLoader.load('/textures/trees/pine/pine_bark_nor_gl_1k.jpg')
const trunkDisplacementTexture = textureLoader.load('/textures/trees/pine/pine_bark_disp_1k.jpg')

trunkColorTexture.colorSpace = THREE.SRGBColorSpace

// Snowy pines
const treeColorTexture = textureLoader.load('/textures/trees/snow/snow_03_diff_1k.jpg')
const treeARMTexture = textureLoader.load('/textures/trees/snow/snow_03_arm_1k.jpg')
const treeNormalTexture = textureLoader.load('/textures/trees/snow/snow_03_nor_gl_1k.jpg')
const treeDisplacementTexture = textureLoader.load('/textures/trees/snow/snow_03_disp_1k.jpg')

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
const wallColorTexture = textureLoader.load('/textures/walls/shutter/wood_shutter_diff_1k.jpg')
const wallARMTexture = textureLoader.load('/textures/walls/shutter/wood_shutter_arm_1k.jpg')
const wallNormalTexture = textureLoader.load('/textures/walls/shutter/wood_shutter_nor_gl_1k.jpg')
const wallDisplacementTexture = textureLoader.load('/textures/shutter/wood_shutter_disp_1k.jpg')

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
const rimColorTexture = textureLoader.load('/textures/rim/plywood_diff_1k.jpg')
const rimARMTexture = textureLoader.load('/textures/rim/plywood_arm_1k.jpg')
const rimNormalTexture = textureLoader.load('/textures/rim/plywood_nor_gl_1k.jpg')
const rimDisplacementTexture = textureLoader.load('/textures/rim/plywood_disp_1k.jpg')

rimColorTexture.colorSpace = THREE.SRGBColorSpace

// Roof
const roofColorTexture = textureLoader.load('/textures/roof/reeds/reed_roof_03_diff_1k.jpg')
const roofARMTexture = textureLoader.load('/textures/roof/reeds/reed_roof_03_arm_1k.jpg')
const roofNormalTexture = textureLoader.load('/textures/roof/reeds/reed_roof_03_nor_gl_1k.jpg')
const roofDisplacementTexture = textureLoader.load('/textures/roof/reeds/reed_roof_03_disp_1k.jpg')

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
const doorColorTexture = textureLoader.load('/textures/door/color.webp')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.webp')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.webp')
const doorHeightTexture = textureLoader.load('/textures/door/height.webp')
const doorNormalTexture = textureLoader.load('/textures/door/normal.webp')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.webp')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.webp')

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
        displacementScale: 0.5,
        displacementBias: -0.2,
    })
)

floor.rotation.x = - Math.PI / 2

scene.add(floor)

// Trees

// Leaves (stacked cones)
const coneMaterial = new THREE.MeshStandardMaterial({
    map: treeColorTexture,
    aoMap: treeARMTexture,
    roughnessMap: treeARMTexture,
    metalnessMap: treeARMTexture,
    normalMap: treeNormalTexture,
})

const trunkMaterial = new THREE.MeshStandardMaterial({
    map: trunkColorTexture,
    aoMap: trunkARMTexture,
    roughnessMap: trunkARMTexture,
    metalnessMap: trunkARMTexture,
    normalMap: trunkNormalTexture,
})

const trunkGeometry = new THREE.CylinderGeometry(0.1, 0.15, 1, 8)
const bigConeGeometry = new THREE.ConeGeometry(0.8, 1.5, 8)
const mediumConeGeometry = new THREE.ConeGeometry(0.6, 1.2, 8)
const smallConeGeometry = new THREE.ConeGeometry(0.4, 1.0, 8)

function createPineTree() {
    const group = new THREE.Group()

    // Trunk
    const trunk = new THREE.Mesh(
        trunkGeometry,
        trunkMaterial,
    )
    trunk.position.y = 0.5
    group.add(trunk)

    const cone1 = new THREE.Mesh(bigConeGeometry, coneMaterial)
    cone1.position.y = 1.5

    const cone2 = new THREE.Mesh(mediumConeGeometry, coneMaterial)
    cone2.position.y = 2.2

    const cone3 = new THREE.Mesh(smallConeGeometry, coneMaterial)
    cone3.position.y = 2.8

    group.add(cone1, cone2, cone3)

    cone1.position.x += (Math.random() - 0.5) * 0.1
    cone2.scale.y *= 0.9 + Math.random() * 0.2

    return group
}

const treeCount = 20
const pineTreeGroup = new THREE.Group()

for (let i = 0; i < treeCount; i++) {
    const tree = createPineTree()

    const angle = Math.random() * Math.PI * 2
    const houseOuterRadius = Math.sqrt(houseMeasurements.width ** 2 + houseMeasurements.depth ** 2) / 2
    const radius = (houseOuterRadius + 3) + Math.random() * 10
    let x = Math.sin(angle) * radius
    let z = Math.cos(angle) * radius

    // Keep the first quadrant empty
    if (x > 0) {
        z = -Math.abs(z)
    }

    tree.scale.setScalar(0.8 + Math.random() * 0.8)
    tree.rotation.y = Math.random() * Math.PI
    tree.position.set(
        x,
        0,
        z,
    )

    pineTreeGroup.add(tree)
}

scene.add(pineTreeGroup)

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
const directionalLight = new THREE.DirectionalLight('#F5F0BF', 1.5)
directionalLight.position.set(10, 5, 3)
scene.add(directionalLight)

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