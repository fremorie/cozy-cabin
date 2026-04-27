import * as THREE from 'three'
import Experience from '../../Experience.js'

export default class Walls {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.sizes = this.experience.sizes

        this.group = new THREE.Object3D()

        this.setGeometry()
        this.setAtticGeometry()
        this.setTextures()
        this.setMaterial()
        this.setMesh()
    }

    setAtticGeometry() {
        this.atticGeometry = new THREE.BufferGeometry()
        // Attic front and back
        const vertices = new Float32Array([
            // left side
            -this.sizes.houseMeasurements.width / 2, 0, -this.sizes.houseMeasurements.depth / 2, // bottom left
            this.sizes.houseMeasurements.width / 2, 0, -this.sizes.houseMeasurements.depth / 2, // bottom right
            0, this.sizes.roofMeasurements.height, -this.sizes.houseMeasurements.depth / 2, // top

            // right side
            -this.sizes.houseMeasurements.width / 2, 0, this.sizes.houseMeasurements.depth / 2,
            this.sizes.houseMeasurements.width / 2, 0,  this.sizes.houseMeasurements.depth / 2,
            0, this.sizes.roofMeasurements.height,  this.sizes.houseMeasurements.depth / 2,
        ])

        const indices = [
            0, 1, 2, // front triangle
            3, 5, 4  // back triangle
        ]

        this.atticGeometry.setAttribute(
            'position',
            new THREE.BufferAttribute(vertices, 3)
        )
        this.atticGeometry.setIndex(indices)
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

        this.atticGeometry.setAttribute(
            'uv',
            new THREE.BufferAttribute(uvs, 2)
        )
        this.atticGeometry.computeVertexNormals()
    }

    setGeometry() {
        this.geometry = new THREE.BoxGeometry(
            this.sizes.houseMeasurements.width,
            this.sizes.houseMeasurements.height,
            this.sizes.houseMeasurements.depth,
            100,
            100,
        )
    }

    setTextures() {
        this.textures = {}

        this.textures.color = this.resources.items.wallColorTexture
        this.textures.color.colorSpace = THREE.SRGBColorSpace
        this.textures.color.center.set(0.5, 0.5)
        this.textures.color.rotation = Math.PI / 2

        this.textures.normal = this.resources.items.wallNormalTexture
        this.textures.normal.center.set(0.5, 0.5)
        this.textures.normal.rotation = Math.PI / 2

        this.textures.displacement = this.resources.items.wallDisplacementTexture
        this.textures.displacement.center.set(0.5, 0.5)
        this.textures.displacement.rotation = Math.PI / 2

        this.textures.arm = this.resources.items.wallARMTexture
        this.textures.arm.center.set(0.5, 0.5)
        this.textures.arm.rotation = Math.PI / 2
    }

    setMaterial() {
        this.material = new THREE.MeshStandardMaterial({
            side: THREE.DoubleSide,
            map: this.textures.color,
            aoMap: this.textures.arm,
            roughnessMap: this.textures.arm,
            metalnessMap: this.textures.arm,
            normalMap: this.textures.normal,
        })
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.position.y = this.sizes.houseMeasurements.height / 2
        this.mesh.receiveShadow = true

        this.atticMesh = new THREE.Mesh(this.atticGeometry, this.material)
        this.atticMesh.position.y = this.sizes.houseMeasurements.height
        this.atticMesh.receiveShadow = true

        this.group.add(this.mesh, this.atticMesh)
    }
}