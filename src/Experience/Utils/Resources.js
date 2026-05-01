import * as THREE from 'three'
import { GLTFLoader, DRACOLoader } from 'three/addons'
import EventEmitter from './EventEmitter.js'
import LoaderOverlay from './LoaderOverlay.js'

export default class Resources extends EventEmitter {
    constructor(sources) {
        super()

        this.sources = sources

        this.items = {}

        this.loaderOverlay = new LoaderOverlay()

        this.setManager()
        this.setLoaders()
        this.startLoading()
    }

    setManager() {
        this.manager = new THREE.LoadingManager(
            // Loaded
            () => {
                this.trigger('ready')
                this.loaderOverlay.onReady()
            },
            // Progress
            (itemUrl, itemsLoaded, itemsTotal) => {
                this.loaderOverlay.onProgress(itemUrl, itemsLoaded, itemsTotal)
            },
        );
    }

    setLoaders() {
        this.loaders = {}

        this.loaders.dracoLoader = new DRACOLoader(this.manager)
        this.loaders.dracoLoader.setDecoderPath('draco/')

        this.loaders.gltfLoader = new GLTFLoader(this.manager)
        this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader)

        this.loaders.textureLoader = new THREE.TextureLoader(this.manager)
        this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader(this.manager)
    }

    startLoading() {
        // Load each source
        for (const source of this.sources) {
            if (source.type === 'gltfModel') {
                this.loaders.gltfLoader.load(
                    source.path,
                    (file) => {
                        this.sourceLoaded(source, file)
                    },
                )
            }
            else if (source.type === 'texture') {
                this.loaders.textureLoader.load(
                    source.path,
                    (file) => {
                        this.sourceLoaded(source, file)
                    },
                )
            }
        }
    }

    sourceLoaded(source, file) {
        this.items[source.name] = file
    }
}