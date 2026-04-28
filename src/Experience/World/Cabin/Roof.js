import * as THREE from 'three'
import Experience from '../../Experience.js'

export default class Roof {
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
            this.sizes.roofMeasurements.plateWidth,
            this.sizes.roofMeasurements.plateHeight,
            this.sizes.roofMeasurements.plateDepth,
            100,
            100,
        )
    }

    setTextures() {
        this.textures = {}

        this.textures.color = this.resources.items.roofColorTexture
        this.textures.color.colorSpace = THREE.SRGBColorSpace
        this.textures.color.center.set(0.5, 0.5)
        this.textures.color.rotation = Math.PI / 2

        this.textures.normal = this.resources.items.roofNormalTexture
        this.textures.normal.center.set(0.5, 0.5)
        this.textures.normal.rotation = Math.PI / 2

        this.textures.displacement = this.resources.items.roofDisplacementTexture
        this.textures.displacement.center.set(0.5, 0.5)
        this.textures.displacement.rotation = Math.PI / 2

        this.textures.arm = this.resources.items.roofARMTexture
        this.textures.arm.center.set(0.5, 0.5)
        this.textures.arm.rotation = Math.PI / 2
    }

    setMaterial() {
        this.material = new THREE.MeshStandardMaterial({
            color: 0x967C33,
            side: THREE.DoubleSide,
            map: this.textures.color,
            aoMap: this.textures.arm,
            roughnessMap: this.textures.arm,
            metalnessMap: this.textures.arm,
            normalMap: this.textures.normal,
        })
    }

    setMesh() {
        this.roofLeftMesh = new THREE.Mesh(this.geometry, this.material)
        this.roofLeftMesh.receiveShadow = true
        this.roofLeftMesh.castShadow = true
        this.roofLeftMesh.position.y = this.sizes.houseMeasurements.height + this.sizes.roofMeasurements.height / 2
        this.roofLeftMesh.position.x = -this.sizes.houseMeasurements.width / 4
        // Hack: add extra PI to flip the texture
        this.roofLeftMesh.rotation.z = Math.PI * 0.2 + Math.PI
        this.roofLeftMesh.translateX(0.25)

        this.group.add(this.roofLeftMesh)

        this.roofRightMesh = new THREE.Mesh(this.geometry, this.material)
        this.roofRightMesh.receiveShadow = true
        this.roofRightMesh.castShadow = true
        this.roofRightMesh.position.y = this.sizes.houseMeasurements.height + this.sizes.roofMeasurements.height / 2
        this.roofRightMesh.position.x = -this.sizes.houseMeasurements.width / 4
        // Prevent z-fighting
        this.roofRightMesh.position.z += 0.001
        this.roofRightMesh.rotation.z = Math.PI * 0.2
        this.roofRightMesh.rotation.z = -Math.PI * 0.2
        this.roofRightMesh.position.x = this.sizes.houseMeasurements.width / 4
        this.roofRightMesh.translateX(0.25)

        this.group.add(this.roofRightMesh)
    }
}