import * as THREE from 'three'
import Experience from '../../Experience.js'

export default class Walls {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.sizes = this.experience.sizes

        this.setGeometry()
        this.setTextures()
        this.setMaterial()
        this.setMesh()
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
    }
}