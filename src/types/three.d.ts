/**
 * Three.js / React Three Fiber JSX element declarations.
 *
 * React 19 moved JSX types from the global namespace into `React.JSX`.
 * We augment the 'react' module so tsx files resolve R3F elements
 * when using `"jsx": "react-jsx"`.
 */

import { ThreeElements } from '@react-three/fiber'

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}


