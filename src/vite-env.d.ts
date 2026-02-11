/// <reference types="vite/client" />
/// <reference types="@react-three/fiber" />

import { Object3DNode } from '@react-three/fiber'
import * as THREE from 'three'

interface ImportMetaEnv {
  readonly VITE_ENABLE_3D: string
  readonly DEV: boolean
  readonly PROD: boolean
  readonly MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Extend JSX intrinsic elements for Three.js objects
declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: Object3DNode<THREE.Mesh, typeof THREE.Mesh>
      group: Object3DNode<THREE.Group, typeof THREE.Group>
      cylinderGeometry: any
      meshStandardMaterial: any
      ambientLight: any
      directionalLight: any
      pointLight: any
      gridHelper: any
    }
  }
}

