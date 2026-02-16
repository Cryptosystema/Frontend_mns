import { Object3DNode, Overwrite } from '@react-three/fiber'
import * as THREE from 'three'

// Declare JSX intrinsic elements for Three.js objects
declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: Object3DNode<THREE.Mesh, typeof THREE.Mesh>
      group: Object3DNode<THREE.Group, typeof THREE.Group>
      points: Object3DNode<THREE.Points, typeof THREE.Points>
      cylinderGeometry: Overwrite<Object3DNode<THREE.CylinderGeometry, typeof THREE.CylinderGeometry>, { args?: ConstructorParameters<typeof THREE.CylinderGeometry> }>
      bufferGeometry: Object3DNode<THREE.BufferGeometry, typeof THREE.BufferGeometry>
      bufferAttribute: Object3DNode<THREE.BufferAttribute, typeof THREE.BufferAttribute>
      meshStandardMaterial: Overwrite<Object3DNode<THREE.MeshStandardMaterial, typeof THREE.MeshStandardMaterial>, { args?: ConstructorParameters<typeof THREE.MeshStandardMaterial> }>
      meshBasicMaterial: Overwrite<Object3DNode<THREE.MeshBasicMaterial, typeof THREE.MeshBasicMaterial>, { args?: ConstructorParameters<typeof THREE.MeshBasicMaterial> }>
      pointsMaterial: Overwrite<Object3DNode<THREE.PointsMaterial, typeof THREE.PointsMaterial>, { args?: ConstructorParameters<typeof THREE.PointsMaterial> }>
      ambientLight: Object3DNode<THREE.AmbientLight, typeof THREE.AmbientLight>
      directionalLight: Object3DNode<THREE.DirectionalLight, typeof THREE.DirectionalLight>
      pointLight: Object3DNode<THREE.PointLight, typeof THREE.PointLight>
      gridHelper: Overwrite<Object3DNode<THREE.GridHelper, typeof THREE.GridHelper>, { args?: ConstructorParameters<typeof THREE.GridHelper> }>
    }
  }
}

export {}


