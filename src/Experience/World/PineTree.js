import * as THREE from 'three'
import Experience from '../Experience.js'

export default class PineTree {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.sizes = this.experience.sizes

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('pineTree')
        }

        // Resource
        this.resource = this.resources.items.pineTreeModel

        this.setTextures()
        this.setMaterial()
        this.setModel()
        this.generateForest()
    }

    setModel() {
        this.model = this.resource.scene
    }

    setMaterial() {
        this.trunkMaterial = new THREE.MeshBasicMaterial({
            transparent: true,
            alphaMap: this.textures.alpha,
            map: this.textures.color,
            aoMap: this.textures.arm,
            roughnessMap: this.textures.arm,
            metalnessMap: this.textures.arm,
            normalMap: this.textures.normal,
            displacementMap: this.textures.displacement,
            displacementScale: 0.5,
            displacementBias: -0.2,
        })

        this.snowMaterial = new THREE.MeshBasicMaterial({
            color: '#FFFFFF',
        })

        this.threeMaterial = new THREE.MeshBasicMaterial({
            color: '#263E31'
        })
    }

    setTextures() {
        this.textures = {}

        this.textures.color = this.resources.items.pineColorTexture
        this.textures.color.colorSpace = THREE.SRGBColorSpace
        this.textures.color.repeat.set(2, 2)
        this.textures.color.wrapS = THREE.RepeatWrapping
        this.textures.color.wrapT = THREE.RepeatWrapping

        this.textures.normal = this.resources.items.pineNormalTexture
        this.textures.normal.repeat.set(2, 2)
        this.textures.normal.wrapS = THREE.RepeatWrapping
        this.textures.normal.wrapT = THREE.RepeatWrapping

        this.textures.displacement = this.resources.items.pineDisplacementTexture
        this.textures.displacement.repeat.set(2, 2)
        this.textures.displacement.wrapS = THREE.RepeatWrapping
        this.textures.displacement.wrapT = THREE.RepeatWrapping

        this.textures.arm = this.resources.items.pineARMTexture
        this.textures.arm.repeat.set(2, 2)
        this.textures.arm.wrapS = THREE.RepeatWrapping
        this.textures.arm.wrapT = THREE.RepeatWrapping
    }

    generateForest() {
        const pineTreeModel = this.model

        const treeCount = 20
        const positions = []

        const instancedMeshes = []
        const meshes = []
        const dummy = new THREE.Object3D()

        const box = new THREE.Box3().setFromObject(pineTreeModel)
        const size = new THREE.Vector3()
        box.getSize(size)
        // In order for this to work, the model must be positioned at (0, 0, 0) in Blender
        const baseRadius = Math.max(size.x, size.z) / 2

        const greenMesh = this.model.children.find(child => child.name === 'green')
        const snowMesh = this.model.children.find(child => child.name === 'snow')
        const trunkMesh = this.model.children.find(child => child.name === 'trunk')

        greenMesh.material = this.threeMaterial
        snowMesh.material = this.snowMaterial
        trunkMesh.material = this.trunkMaterial

        pineTreeModel.traverse((child) => {
            if (!child.isMesh) return

            child.material.alphaTest = 0.5
            child.material.transparent = false

            const instanced = new THREE.InstancedMesh(
                child.geometry,
                child.material,
                treeCount
            )

            instanced.castShadow = true
            instanced.receiveShadow = true

            instancedMeshes.push(instanced)
            meshes.push(child)

            this.scene.add(instanced)
        })

        for (let i = 0; i < treeCount; i++) {
            let x, z, scale, currentRadius
            let attempts = 0
            const maxAttempts = 100

            do {
                scale = 1 + Math.random() / 2
                currentRadius = baseRadius * scale

                const angle = Math.random() * Math.PI * 2

                const houseOuterRadius =
                    Math.sqrt(
                        this.sizes.houseMeasurements.width ** 2 +
                        this.sizes.houseMeasurements.depth ** 2
                    ) / 2

                const radius = (houseOuterRadius + 3) + Math.random() * 10

                x = Math.sin(angle) * radius
                z = Math.cos(angle) * radius

                // keep first quadrant empty
                if (x > -2) {
                    z = -Math.abs(z)
                }

                attempts++
            } while (
                positions.some((p) => {
                    const dx = p.x - x
                    const dz = p.z - z
                    const distSq = dx * dx + dz * dz
                    const minDist = p.radius + currentRadius
                    return distSq < minDist * minDist
                }) && attempts < maxAttempts
                )

            positions.push({ x, z, radius: currentRadius })

            dummy.position.set(x, 0, z)
            dummy.scale.setScalar(scale)
            dummy.rotation.y = Math.random() * Math.PI
            dummy.updateMatrix()

            instancedMeshes.forEach((instanced, meshIndex) => {
                const sourceMesh = meshes[meshIndex]
                const matrix = new THREE.Matrix4()
                matrix.multiplyMatrices(dummy.matrix, sourceMesh.matrixWorld)

                instanced.setMatrixAt(i, matrix)
            })
        }

        // ---- finalize GPU upload ----
        instancedMeshes.forEach((instanced) => {
            instanced.instanceMatrix.needsUpdate = true
        })
    }
}