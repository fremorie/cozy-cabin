import * as THREE from 'three'
import Experience from '../../Experience.js'
import Walls from './Walls.js'
import CozyWindow from './CozyWindow.js'
import Roof from './Roof.js'

export default class Cabin {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.sizes = this.experience.sizes

        this.setGroup()
        this.setMeshes()
    }

    setGroup() {
        this.group = new THREE.Group()
        this.scene.add(this.group)
    }

    setMeshes() {
        this.walls = new Walls()
        this.group.add(this.walls.group)

        this.roof = new Roof()
        this.group.add(this.roof.group)

        this.setWindows()
    }

    setWindows() {
        const cozyWindows = [
            // Front windows
            {
                position: new THREE.Vector3(
                    this.sizes.houseMeasurements.width / 2 - 0.9,
                    1.55,
                    this.sizes.houseMeasurements.depth / 2 + 0.01,
                ),

            },
            {
                position: new THREE.Vector3(
                    - this.sizes.houseMeasurements.width / 2 + 0.9,
                    1.55,
                    this.sizes.houseMeasurements.depth / 2 + 0.01,
                ),
            },
            {
                position: new THREE.Vector3(
                    0,
                    this.sizes.houseMeasurements.height + this.sizes.roofMeasurements.height / 2 - this.sizes.windowSize / 2,
                    this.sizes.houseMeasurements.depth / 2 + 0.01,
                ),
            },

            // Right side windows
            {
                position: new THREE.Vector3(
                    this.sizes.houseMeasurements.width / 2 + 0.01,
                    1.55,
                    this.sizes.houseMeasurements.depth / 2 - 0.9,
                ),
                rotation: Math.PI / 2,
            },
            {
                position: new THREE.Vector3(
                    this.sizes.houseMeasurements.width / 2 + 0.01,
                    1.55,
                    - this.sizes.houseMeasurements.depth / 2 + 0.9,
                ),
                rotation: Math.PI / 2,
            },
            {
                position: new THREE.Vector3(
                    this.sizes.houseMeasurements.width / 2 + 0.01,
                    1.55,
                    0,
                ),
                rotation: Math.PI / 2,
            },
        ]

        for (const cozyWindow of cozyWindows) {
            const windowGroup = (new CozyWindow(cozyWindow.position, cozyWindow.rotation)).group
            console.log({windowGroup})
            this.group.add(windowGroup)
        }
    }
}