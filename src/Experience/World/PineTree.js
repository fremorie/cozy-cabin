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

        this.setModel()
        this.generateForest()
    }

    setModel() {
        this.model = this.resource.scene
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
        const baseRadius = Math.max(size.x, size.z) / 2

        pineTreeModel.traverse((child) => {
            if (!child.isMesh) return

            child.material.alphaTest = 0.5
            child.material.transparent = false

            child.material.color.multiplyScalar(0.9)

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
                scale = 0.12 + Math.random() * 0.05
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