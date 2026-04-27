import * as THREE from 'three'
import Experience from '../../Experience.js'

export default class DoorRim {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.sizes = this.experience.sizes

        this.group = new THREE.Object3D()

        this.setGeometry()
        this.setTextures()
        this.setMaterial()
        this.setMesh()
    }

    setGeometry() {
        this.geometry = new THREE.BoxGeometry(
            0.2,
            this.sizes.houseMeasurements.doorHeight + 0.2,
            0.2,
        )
    }

    setTextures() {
        this.textures = {}

        this.textures.color = this.resources.items.rimColorTexture
        this.textures.color.colorSpace = THREE.SRGBColorSpace

        this.textures.normal = this.resources.items.rimNormalTexture

        this.textures.displacement = this.resources.items.rimDisplacementTexture

        this.textures.arm = this.resources.items.rimARMTexture
    }

    setMaterial() {
        this.material = new THREE.MeshStandardMaterial({
            color: 0xd7935b,
            map: this.textures.color,
            aoMap: this.textures.arm,
            roughnessMap: this.textures.arm,
            metalnessMap: this.textures.arm,
            normalMap: this.textures.normal,
        })
    }

    setMesh() {
        this.rimLeftMesh = new THREE.Mesh(
            this.geometry,
            this.material,
        )

        this.rimLeftMesh.position.set(
            -this.sizes.houseMeasurements.doorWidth / 2 + 0.4,
            this.sizes.houseMeasurements.doorHeight / 2,
            this.sizes.houseMeasurements.depth / 2
        )
        this.group.add(this.rimLeftMesh)

        this.rimRightMesh = new THREE.Mesh(this.geometry, this.material)
        this.rimRightMesh.position.set(
            this.sizes.houseMeasurements.doorWidth / 2 - 0.4,
            this.sizes.houseMeasurements.doorHeight / 2,
            this.sizes.houseMeasurements.depth / 2
        )
        this.group.add(this.rimRightMesh)

        this.rimTopMesh = new THREE.Mesh(
            new THREE.BoxGeometry(this.sizes.houseMeasurements.doorWidth - 0.4, 0.2, 0.21),
            this.material,
        )
        this.rimTopMesh.position.set(
            0,
            this.sizes.houseMeasurements.doorHeight,
            this.sizes.houseMeasurements.depth / 2
        )
        this.group.add(this.rimTopMesh)
    }
}