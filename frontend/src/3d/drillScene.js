import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

const PIPE_LEN = 7
const AXIS_X = 2.8
const HEAD_TOP = 7.2
const HEAD_BOTTOM = 3.6
const BORE_BOTTOM = -3.8

// Direction dyal chems (nafs l-ittijah f sky w f DirectionalLight)
const SUN_DIR = new THREE.Vector3(0.55, 0.32, 0.45).normalize()

// =====================================================
// NOISE HELPERS
// =====================================================

function hash(x, y) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return s - Math.floor(s)
}

function vnoise(x, y) {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const xf = x - xi
  const yf = y - yi
  const u = xf * xf * (3 - 2 * xf)
  const v = yf * yf * (3 - 2 * yf)
  const L = THREE.MathUtils.lerp

  return L(
    L(hash(xi, yi), hash(xi + 1, yi), u),
    L(hash(xi, yi + 1), hash(xi + 1, yi + 1), u),
    v
  )
}

function fbm(x, y, oct = 5) {
  let a = 0.5
  let f = 1
  let s = 0

  for (let i = 0; i < oct; i++) {
    s += a * vnoise(x * f, y * f)
    f *= 2
    a *= 0.5
  }

  return s
}

// Terrain height (world coordinates). Machine is at world (0,0).
function terrainHeightAt(x, zWorld) {
  const d = Math.hypot(x, zWorld)
  const padMask = THREE.MathUtils.smoothstep(d, 9, 26)
  const zl = zWorld + 30 // same coordinates used by the terrain mesh
  const hills = (fbm(x * 0.018, zl * 0.018, 5) - 0.5) * 7.0
  const detail = (fbm(x * 0.12, zl * 0.12, 3) - 0.5) * 0.25

  return -0.08 + (hills + detail) * padMask
}

class HelixCurve extends THREE.Curve {
  constructor(radius, length, turns) {
    super()
    this.radius = radius
    this.length = length
    this.turns = turns
  }

  getPoint(t, target = new THREE.Vector3()) {
    const a = t * this.turns * Math.PI * 2

    return target.set(
      Math.cos(a) * this.radius,
      (t - 0.5) * this.length,
      Math.sin(a) * this.radius
    )
  }
}

function makeParticles(color, count, size) {
  const positions = new Float32Array(count * 3)
  const velocities = new Float32Array(count * 3)
  const life = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    life[i] = -Math.random() * 2
    positions[i * 3 + 1] = -100
  }

  const geometry = new THREE.BufferGeometry()

  geometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
  )

  const material = new THREE.PointsMaterial({
    color,
    size,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })

  const points = new THREE.Points(geometry, material)

  points.frustumCulled = false
  points.visible = false

  function update(dt, intensity, speed, spread) {
    material.opacity = Math.min(1, intensity)
    points.visible = intensity > 0.02

    if (!points.visible) return

    for (let i = 0; i < count; i++) {
      const j = i * 3

      life[i] += dt

      if (life[i] < 0) {
        positions[j + 1] = -100
        continue
      }

      if (life[i] > 1.4 || positions[j + 1] < 0) {
        if (Math.random() > intensity) {
          life[i] = 0.9
          positions[j + 1] = -100
          continue
        }

        life[i] = 0

        positions[j] = AXIS_X + (Math.random() - 0.5) * 0.2
        positions[j + 1] = 0.05
        positions[j + 2] = (Math.random() - 0.5) * 0.2

        const a = Math.random() * Math.PI * 2
        const s = Math.random() * spread

        velocities[j] = Math.cos(a) * s
        velocities[j + 1] = speed * (0.6 + Math.random() * 0.6)
        velocities[j + 2] = Math.sin(a) * s
      }

      velocities[j + 1] -= 6.5 * dt

      positions[j] += velocities[j] * dt
      positions[j + 1] += velocities[j + 1] * dt
      positions[j + 2] += velocities[j + 2] * dt
    }

    geometry.attributes.position.needsUpdate = true
  }

  return { points, update }
}

// =====================================================
// BENI MELLAL PROCEDURAL LANDSCAPE
// =====================================================

function createBeniMellalLandscape(scene) {
  const landscape = new THREE.Group()

  scene.add(landscape)

  // -------------------------------------------------
  // SKY (sun + haze)
  // -------------------------------------------------

  const skyGeometry = new THREE.SphereGeometry(190, 48, 32)

  const skyMaterial = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: { sunDir: { value: SUN_DIR.clone() } },

    vertexShader: `
      varying vec3 vDir;

      void main() {
        vDir = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,

    fragmentShader: `
      varying vec3 vDir;
      uniform vec3 sunDir;

      void main() {
        float h = clamp(vDir.y, 0.0, 1.0);

        vec3 haze   = vec3(0.86, 0.78, 0.64);
        vec3 mid    = vec3(0.55, 0.72, 0.85);
        vec3 zenith = vec3(0.20, 0.42, 0.68);

        vec3 col = mix(haze, mid, smoothstep(0.0, 0.28, h));
        col = mix(col, zenith, smoothstep(0.25, 0.9, h));

        float s = max(dot(vDir, normalize(sunDir)), 0.0);
        col += vec3(1.0, 0.72, 0.4) * pow(s, 6.0) * 0.35;
        col += vec3(1.0, 0.9, 0.7) * pow(s, 400.0) * 1.2;

        col = mix(vec3(0.86, 0.78, 0.64), col, smoothstep(-0.05, 0.02, vDir.y));

        gl_FragColor = vec4(col, 1.0);
      }
    `,
  })

  const sky = new THREE.Mesh(skyGeometry, skyMaterial)
  sky.renderOrder = -10

  landscape.add(sky)

  // -------------------------------------------------
  // MOUNTAIN RANGE GENERATOR
  // -------------------------------------------------

  function createMountainRange({
    z,
    height,
    base,
    color,
    seed,
    segments = 140,
  }) {
    const positions = []
    const colors = []
    const indices = []

    const mountainColor = new THREE.Color(color)
    const summitColor = new THREE.Color(0xa69b84)

    for (let i = 0; i <= segments; i++) {
      const x = -90 + (i / segments) * 180

      const wave =
        (fbm(x * 0.028 + seed * 7.3, seed * 3.1, 5) - 0.5) * 1.5 +
        Math.sin(x * 0.04 + seed) * 0.15

      const peak = base + height * (0.55 + wave)

      positions.push(x, -5, z)

      colors.push(
        mountainColor.r * 0.65,
        mountainColor.g * 0.65,
        mountainColor.b * 0.65
      )

      positions.push(x, peak, z)

      const t = THREE.MathUtils.clamp(
        (peak - base) / height,
        0,
        1
      )

      const summit = mountainColor
        .clone()
        .lerp(summitColor, t * 0.35)

      colors.push(summit.r, summit.g, summit.b)

      if (i < segments) {
        const a = i * 2

        indices.push(a, a + 1, a + 2)
        indices.push(a + 1, a + 3, a + 2)
      }
    }

    const geometry = new THREE.BufferGeometry()

    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3)
    )

    geometry.setAttribute(
      'color',
      new THREE.Float32BufferAttribute(colors, 3)
    )

    geometry.setIndex(indices)
    geometry.computeVertexNormals()

    const material = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 1,
      metalness: 0,
      side: THREE.DoubleSide,
      flatShading: true,
    })

    const mountain = new THREE.Mesh(geometry, material)

    landscape.add(mountain)

    return mountain
  }

  createMountainRange({ z: -78, height: 26, base: 6, color: 0xa08f78, seed: 2 })
  createMountainRange({ z: -65, height: 17, base: 2, color: 0x8a7a62, seed: 5 })
  createMountainRange({ z: -43, height: 8, base: 0, color: 0x7d7650, seed: 8 })

  // -------------------------------------------------
  // TERRAIN (fbm hills, ocher / red soil / green patches)
  // -------------------------------------------------

  const terrainGeometry = new THREE.PlaneGeometry(180, 160, 220, 180)

  terrainGeometry.rotateX(-Math.PI / 2)

  const tp = terrainGeometry.attributes.position
  const terrainColors = []

  const cSoil = new THREE.Color(0x9a6f45)
  const cOcher = new THREE.Color(0xb59565)
  const cDry = new THREE.Color(0xa39a6a)
  const cGreen = new THREE.Color(0x6f7d46)
  const cPad = new THREE.Color(0x7a5c3d)
  const tmpC = new THREE.Color()

  for (let i = 0; i < tp.count; i++) {
    const x = tp.getX(i)
    const z = tp.getZ(i) // local z; terrain mesh is moved to z = -30

    const d = Math.hypot(x, z - 30)
    const padMask = THREE.MathUtils.smoothstep(d, 9, 26)

    const hills = (fbm(x * 0.018, z * 0.018, 5) - 0.5) * 7.0
    const detail = (fbm(x * 0.12, z * 0.12, 3) - 0.5) * 0.25

    tp.setY(i, -0.08 + (hills + detail) * padMask)

    const n1 = fbm(x * 0.04, z * 0.04, 4)
    const n2 = fbm(x * 0.15 + 20, z * 0.15, 3)

    tmpC.copy(cSoil).lerp(cOcher, n1)
    tmpC.lerp(
      cGreen,
      THREE.MathUtils.smoothstep(n2, 0.55, 0.8) * 0.7 * padMask
    )
    tmpC.lerp(cDry, THREE.MathUtils.smoothstep(n1, 0.5, 0.8) * 0.4)
    tmpC.multiplyScalar(0.9 + n2 * 0.2)
    tmpC.lerp(cPad, 1 - padMask)

    terrainColors.push(tmpC.r, tmpC.g, tmpC.b)
  }

  terrainGeometry.setAttribute(
    'color',
    new THREE.Float32BufferAttribute(terrainColors, 3)
  )

  terrainGeometry.computeVertexNormals()

  const terrainMaterial = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 1,
    metalness: 0,
    transparent: true,
    opacity: 1,
    depthWrite: true,
  })

  const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial)

  terrain.position.set(0, 0, -30)
  terrain.receiveShadow = true

  landscape.add(terrain)

  // -------------------------------------------------
  // ROCKS (placed on the terrain surface)
  // -------------------------------------------------

  const rockMaterial = new THREE.MeshStandardMaterial({
    color: 0x7d6a54,
    roughness: 1,
    flatShading: true,
  })

  for (let i = 0; i < 45; i++) {
    const rock = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.12 + Math.random() * 0.28, 0),
      rockMaterial
    )

    const side = Math.random() > 0.5 ? 1 : -1
    const rx = side * (5 + Math.random() * 35)
    const rz = -5 - Math.random() * 65

    rock.position.set(rx, terrainHeightAt(rx, rz) + 0.03, rz)

    rock.rotation.set(
      Math.random(),
      Math.random() * Math.PI,
      Math.random()
    )

    rock.scale.y = 0.5 + Math.random()

    rock.castShadow = true
    rock.receiveShadow = true

    landscape.add(rock)
  }

  return {
    group: landscape,
    terrainMaterial,
  }
}

// =====================================================
// MAIN DRILL SCENE
// =====================================================

export function createDrillScene(
  canvas,
  { reducedMotion = false, onContextLost } = {}
) {
  // -------------------------------------------------
  // RENDERER
  // -------------------------------------------------

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  })

  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 0.95

  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  renderer.setClearColor(0x000000, 0)

  // -------------------------------------------------
  // SCENE
  // -------------------------------------------------

  const scene = new THREE.Scene()

  // Same color as the sky horizon so the distance melts into the haze
  scene.fog = new THREE.FogExp2(0xdcc7a4, 0.0075)

  const landscape = createBeniMellalLandscape(scene)

  // -------------------------------------------------
  // ENVIRONMENT
  // -------------------------------------------------

  const pmrem = new THREE.PMREMGenerator(renderer)

  const room = new RoomEnvironment()

  const envTexture = pmrem.fromScene(room, 0.04).texture

  scene.environment = envTexture
  scene.environmentIntensity = 0.45

  room.dispose()
  pmrem.dispose()

  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 260)

  // -------------------------------------------------
  // LIGHTING
  // -------------------------------------------------

  const ambient = new THREE.HemisphereLight(0xcfe3f5, 0x8a6a48, 0.55)

  scene.add(ambient)

  // Golden hour sun
  const key = new THREE.DirectionalLight(0xffd29a, 4.2)

  key.position.copy(SUN_DIR).multiplyScalar(30)
  key.castShadow = true

  key.shadow.mapSize.set(2048, 2048)

  key.shadow.camera.left = -14
  key.shadow.camera.right = 14
  key.shadow.camera.top = 14
  key.shadow.camera.bottom = -14
  key.shadow.camera.near = 1
  key.shadow.camera.far = 80

  key.shadow.bias = -0.0003
  key.shadow.normalBias = 0.03

  scene.add(key)

  // Cool soft fill
  const fill = new THREE.DirectionalLight(0x9fbfe0, 0.45)

  fill.position.set(-10, 6, 8)

  scene.add(fill)

  // Warm rim light for silhouette
  const rim = new THREE.DirectionalLight(0xffb070, 1.4)

  rim.position.set(-8, 8, -10)

  scene.add(rim)

  const waterLight = new THREE.PointLight(0x2f8bff, 0, 14, 1.6)

  waterLight.position.set(AXIS_X, BORE_BOTTOM, 0)

  scene.add(waterLight)

  // -------------------------------------------------
  // MATERIALS
  // -------------------------------------------------

  const steel = new THREE.MeshStandardMaterial({
    color: 0xe6ad24,
    metalness: 0.62,
    roughness: 0.36,
  })

  const yellow = new THREE.MeshStandardMaterial({
    color: 0xffc928,
    metalness: 0.4,
    roughness: 0.32,
  })

  const darkSteel = new THREE.MeshStandardMaterial({
    color: 0x20252b,
    metalness: 0.78,
    roughness: 0.42,
  })

  const rubber = new THREE.MeshStandardMaterial({
    color: 0x17191c,
    roughness: 0.88,
  })

  const pipeMat = new THREE.MeshStandardMaterial({
    color: 0xbac4ce,
    metalness: 0.92,
    roughness: 0.24,
  })

  const hydraulic = new THREE.MeshStandardMaterial({
    color: 0x101419,
    metalness: 0.22,
    roughness: 0.68,
  })

  const glass = new THREE.MeshPhysicalMaterial({
    color: 0x101c27,
    metalness: 0.65,
    roughness: 0.16,
    clearcoat: 0.8,
    clearcoatRoughness: 0.12,
  })

  // -------------------------------------------------
  // MACHINE WORLD
  // -------------------------------------------------

  const world = new THREE.Group()

  scene.add(world)

  // -------------------------------------------------
  // GEOMETRY HELPERS
  // -------------------------------------------------

  function box(w, h, d, mat, x, y, z, parent = world) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)

    mesh.position.set(x, y, z)

    mesh.castShadow = true
    mesh.receiveShadow = true

    parent.add(mesh)

    return mesh
  }

  function cyl(rt, rb, h, mat, x, y, z, parent = world, seg = 24) {
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(rt, rb, h, seg),
      mat
    )

    mesh.position.set(x, y, z)

    mesh.castShadow = true
    mesh.receiveShadow = true

    parent.add(mesh)

    return mesh
  }

  function strut(a, b, radius, mat, parent = world) {
    const va = new THREE.Vector3(...a)
    const vb = new THREE.Vector3(...b)

    const direction = vb.clone().sub(va)

    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(radius, radius, direction.length(), 12),
      mat
    )

    mesh.position.copy(va.clone().add(vb).multiplyScalar(0.5))

    mesh.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.normalize()
    )

    mesh.castShadow = true
    mesh.receiveShadow = true

    parent.add(mesh)

    return mesh
  }

  // -------------------------------------------------
  // GROUND PAD (soft edge, blends into terrain) + HIDDEN GRID
  // -------------------------------------------------

  const padCanvas = document.createElement('canvas')

  padCanvas.width = padCanvas.height = 256

  const pctx = padCanvas.getContext('2d')
  const grad = pctx.createRadialGradient(128, 128, 40, 128, 128, 128)

  grad.addColorStop(0, '#fff')
  grad.addColorStop(0.7, '#fff')
  grad.addColorStop(1, '#000')

  pctx.fillStyle = grad
  pctx.fillRect(0, 0, 256, 256)

  const padAlpha = new THREE.CanvasTexture(padCanvas)

  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x7a5c3d,
    roughness: 1,
    metalness: 0,
    transparent: true,
    opacity: 1,
    alphaMap: padAlpha,
    depthWrite: false,
  })

  const ground = new THREE.Mesh(new THREE.CircleGeometry(9, 72), groundMat)

  ground.rotation.x = -Math.PI / 2
  ground.position.y = -0.04

  ground.receiveShadow = true

  world.add(ground)

  // Grid is kept (update() references it) but hidden
  const grid = new THREE.GridHelper(18, 36, 0x78652d, 0x343a40)

  grid.position.y = 0.005

  grid.material.transparent = true
  grid.material.opacity = 0.2

  grid.visible = false

  world.add(grid)

  // -------------------------------------------------
  // TRACK CHASSIS
  // -------------------------------------------------

  for (const side of [-1, 1]) {
    const z = side * 1.35

    box(4.15, 0.5, 0.58, darkSteel, 0, 0.38, z)

    for (const x of [-1.85, -0.95, 0, 0.95, 1.85]) {
      const wheel = cyl(
        Math.abs(x) > 1.5 ? 0.34 : 0.26,
        Math.abs(x) > 1.5 ? 0.34 : 0.26,
        0.18,
        rubber,
        x,
        0.38,
        z + side * 0.32
      )

      wheel.rotation.x = Math.PI / 2

      const hub = cyl(0.11, 0.11, 0.2, yellow, x, 0.38, z + side * 0.4)

      hub.rotation.x = Math.PI / 2
    }

    for (const x of [-1.35, -0.45, 0.45, 1.35]) {
      const roller = cyl(0.11, 0.11, 0.12, pipeMat, x, 0.37, z + side * 0.35)

      roller.rotation.x = Math.PI / 2
    }

    const count = 38

    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2

      const x = 2.2 * Math.cos(a)
      const y = 0.38 + 0.38 * Math.sin(a)

      const pad = box(0.29, 0.115, 0.11, rubber, x, y, z + side * 0.37)

      pad.rotation.z = a + Math.PI / 2
    }

    box(3, 0.07, 0.045, yellow, 0, 0.66, z + side * 0.31)
  }

  // -------------------------------------------------
  // CHASSIS DECK
  // -------------------------------------------------

  box(4.3, 0.5, 2.35, darkSteel, 0, 0.95, 0)

  box(4.34, 0.09, 2.4, yellow, 0, 1.22, 0)

  // -------------------------------------------------
  // ENGINE COMPARTMENT
  // -------------------------------------------------

  box(2, 1.05, 1.85, steel, -1.12, 1.8, 0)

  box(2.04, 0.09, 1.89, yellow, -1.12, 2.34, 0)

  for (let i = 0; i < 7; i++) {
    box(0.035, 0.55, 1.35, darkSteel, -2.14, 1.8, -0.6 + i * 0.2)
  }

  cyl(0.085, 0.085, 0.95, darkSteel, -1.7, 2.78, 0.55)

  cyl(0.12, 0.12, 0.12, pipeMat, -1.7, 3.26, 0.55)

  // -------------------------------------------------
  // CABIN
  // -------------------------------------------------

  box(1.25, 1.25, 1.5, steel, 0.55, 1.95, 0)

  box(1.29, 0.1, 1.55, darkSteel, 0.55, 2.61, 0)

  box(0.055, 0.77, 1.2, glass, 1.19, 2.12, 0)

  for (const side of [-1, 1]) {
    box(0.72, 0.65, 0.045, glass, 0.55, 2.12, side * 0.765)

    box(0.78, 0.055, 0.06, yellow, 0.55, 2.48, side * 0.79)
  }

  // -------------------------------------------------
  // STEPS
  // -------------------------------------------------

  for (let i = 0; i < 3; i++) {
    box(0.5, 0.07, 0.45, darkSteel, 0.2 - i * 0.15, 1.12 - i * 0.18, 1.12)
  }

  // -------------------------------------------------
  // MAST
  // -------------------------------------------------

  const MAST_BASE = 1.35
  const MAST_TOP = 8.5

  box(1.5, 0.3, 1.5, darkSteel, 2.4, 1.2, 0)

  for (const z of [-0.5, 0.5]) {
    box(
      0.19,
      MAST_TOP - MAST_BASE,
      0.2,
      darkSteel,
      AXIS_X,
      (MAST_TOP + MAST_BASE) / 2,
      z
    )

    box(
      0.055,
      MAST_TOP - MAST_BASE - 0.25,
      0.055,
      yellow,
      AXIS_X + 0.115,
      (MAST_TOP + MAST_BASE) / 2,
      z
    )
  }

  for (let y = MAST_BASE + 0.35; y < MAST_TOP; y += 0.85) {
    box(0.12, 0.12, 1, steel, AXIS_X, y, 0)
  }

  for (let y = MAST_BASE + 0.45; y < MAST_TOP - 1; y += 1.7) {
    strut([AXIS_X, y, -0.48], [AXIS_X, y + 0.85, 0.48], 0.045, yellow)

    strut([AXIS_X, y + 0.85, -0.48], [AXIS_X, y, 0.48], 0.045, darkSteel)
  }

  box(0.85, 0.38, 1.3, yellow, AXIS_X, MAST_TOP + 0.12, 0)

  box(0.52, 0.28, 0.7, darkSteel, AXIS_X, MAST_TOP + 0.42, 0)

  // -------------------------------------------------
  // HYDRAULIC SUPPORTS
  // -------------------------------------------------

  strut([1.35, 1.35, 0.4], [2.55, 4.1, 0.4], 0.13, darkSteel)

  strut([1.38, 1.35, 0.4], [2.5, 4.05, 0.4], 0.07, pipeMat)

  strut([1.35, 1.35, -0.4], [2.55, 4.1, -0.4], 0.13, darkSteel)

  strut([1.38, 1.35, -0.4], [2.5, 4.05, -0.4], 0.07, pipeMat)

  // -------------------------------------------------
  // HYDRAULIC HOSES
  // -------------------------------------------------

  for (const z of [-0.66, 0.66]) {
    const points = [
      new THREE.Vector3(1.25, 2.4, z),
      new THREE.Vector3(1.75, 3, z),
      new THREE.Vector3(2, 4, z),
      new THREE.Vector3(2.35, 5.2, z),
      new THREE.Vector3(2.45, 6.5, z),
      new THREE.Vector3(2.7, 7.2, z),
    ]

    const curve = new THREE.CatmullRomCurve3(points)

    const hose = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 48, 0.035, 8, false),
      rubber
    )

    world.add(hose)
  }

  // -------------------------------------------------
  // MOVING DRILL HEAD
  // -------------------------------------------------

  const head = new THREE.Group()

  box(0.68, 0.95, 0.68, yellow, 0, 0, 0, head)

  box(0.74, 0.13, 0.74, darkSteel, 0, 0.48, 0, head)

  box(0.92, 0.12, 0.82, darkSteel, 0, -0.53, 0, head)

  cyl(0.29, 0.29, 0.68, darkSteel, 0, 0.78, 0, head)

  cyl(0.18, 0.18, 0.2, pipeMat, 0, 1.16, 0, head)

  for (const x of [-0.23, 0.23]) {
    for (const z of [-0.23, 0.23]) {
      cyl(0.035, 0.035, 0.025, pipeMat, x, 0.28, z, head, 12)
    }
  }

  world.add(head)

  // -------------------------------------------------
  // SPARE RODS
  // -------------------------------------------------

  for (let i = 0; i < 4; i++) {
    const rod = cyl(0.085, 0.085, 3.2, pipeMat, -0.95 + i * 0.21, 1.5, 1.5)

    rod.rotation.z = Math.PI / 2
  }

  // -------------------------------------------------
  // DRILL PIPE
  // -------------------------------------------------

  const pipe = new THREE.Group()

  cyl(0.09, 0.09, PIPE_LEN, pipeMat, 0, 0, 0, pipe, 20)

  for (let y = -PIPE_LEN / 2 + 0.5; y < PIPE_LEN / 2; y += 1.5) {
    cyl(0.125, 0.125, 0.14, darkSteel, 0, y, 0, pipe, 16)
  }

  const helix = new THREE.Mesh(
    new THREE.TubeGeometry(
      new HelixCurve(0.13, PIPE_LEN - 0.4, 15),
      220,
      0.022,
      6
    ),
    yellow
  )

  pipe.add(helix)

  const bit = cyl(0.01, 0.22, 0.5, steel, 0, -PIPE_LEN / 2 - 0.25, 0, pipe, 8)

  bit.name = 'bit'

  pipe.position.x = AXIS_X

  world.add(pipe)

  // -------------------------------------------------
  // GEOLOGICAL LAYERS
  // -------------------------------------------------

  const layerDefs = [
    { thickness: 0.8, color: 0x4a3c30 },
    { thickness: 1, color: 0x6b5b49 },
    { thickness: 1.3, color: 0x5a6672 },
    { thickness: 1.1, color: 0x234a78 },
  ]

  const strataMats = []
  const strataEdges = []

  let top = 0

  for (const def of layerDefs) {
    const mat = new THREE.MeshStandardMaterial({
      color: def.color,
      roughness: 0.9,
      metalness: 0.05,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    })

    const geometry = new THREE.CylinderGeometry(7, 7, def.thickness, 72)

    const mesh = new THREE.Mesh(geometry, mat)

    mesh.position.y = top - def.thickness / 2

    world.add(mesh)

    const edgeMat = new THREE.LineBasicMaterial({
      color: 0x9eabb9,
      transparent: true,
      opacity: 0,
    })

    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geometry, 30),
      edgeMat
    )

    edges.position.copy(mesh.position)

    world.add(edges)

    strataMats.push(mat)
    strataEdges.push(edgeMat)

    top -= def.thickness
  }

  // -------------------------------------------------
  // UNDERGROUND WATER LAYER
  // -------------------------------------------------

  const waterMat = new THREE.MeshBasicMaterial({
    color: 0x1347b8,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  })

  const aquifer = new THREE.Mesh(
    new THREE.CylinderGeometry(6.9, 6.9, 0.6, 72),
    waterMat
  )

  aquifer.position.y = -3.65

  world.add(aquifer)

  const columnGeometry = new THREE.CylinderGeometry(0.2, 0.2, 4, 20)

  columnGeometry.translate(0, 2, 0)

  const columnMat = new THREE.MeshBasicMaterial({
    color: 0x6fb0ff,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })

  const column = new THREE.Mesh(columnGeometry, columnMat)

  column.position.set(AXIS_X, BORE_BOTTOM, 0)

  column.scale.y = 0.001

  world.add(column)

  // -------------------------------------------------
  // WATER JET
  // -------------------------------------------------

  const waterJetMat = new THREE.MeshBasicMaterial({
    color: 0x65c7ff,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  })

  const waterJet = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.11, 0.75, 16),
    waterJetMat
  )

  world.add(waterJet)

  const splashMat = new THREE.MeshBasicMaterial({
    color: 0x2f8bff,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })

  const splash = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 16, 12),
    splashMat
  )

  world.add(splash)

  // -------------------------------------------------
  // PARTICLES
  // -------------------------------------------------

  const cuttings = makeParticles(0xb4a58f, 140, 0.07)

  const droplets = makeParticles(0x7fbaff, 180, 0.09)

  world.add(cuttings.points, droplets.points)

  // -------------------------------------------------
  // GSAP CONTROLLED STATE (unchanged, used by CinematicHero.jsx)
  // -------------------------------------------------

  const state = {
    px: 10,
    py: 4,
    pz: 12,

    lx: 1,
    ly: 3,
    lz: 0,

    rot: 0,
    depth: 0,
    strata: 0,
    water: 0,

    groundOpacity: 1,
  }

  const look = new THREE.Vector3()
  const tmp = new THREE.Vector3()

  const worldUp = new THREE.Vector3(0, 1, 0)
  const offset = new THREE.Vector3()

  let width = 1
  let height = 1

  // -------------------------------------------------
  // CAMERA
  // -------------------------------------------------

  function applyCamera() {
    const aspect = width / height

    const factor =
      aspect < 1 ? Math.min(1.9, 1.12 / Math.pow(aspect, 0.62)) : 1

    const localLook = tmp.set(state.lx, state.ly, state.lz)

    offset
      .set(state.px - state.lx, state.py - state.ly, state.pz - state.lz)
      .multiplyScalar(factor)

    look.copy(localLook).applyAxisAngle(worldUp, state.rot)

    camera.position.copy(look).add(offset)

    camera.lookAt(look)
  }

  // -------------------------------------------------
  // RESIZE
  // -------------------------------------------------

  function resize() {
    const rect =
      canvas.parentElement?.getBoundingClientRect() ??
      canvas.getBoundingClientRect()

    width = Math.max(1, Math.floor(rect.width))

    height = Math.max(1, Math.floor(rect.height))

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, width < 700 ? 1.5 : 1.75)
    )

    renderer.setSize(width, height, false)

    camera.aspect = width / height

    if (camera.aspect > 1.15) {
      camera.setViewOffset(width, height, -width * 0.14, 0, width, height)
    } else {
      camera.setViewOffset(width, height, 0, height * 0.14, width, height)
    }

    camera.updateProjectionMatrix()

    render()
  }

  // -------------------------------------------------
  // UPDATE
  // -------------------------------------------------

  function update(dt) {
    world.rotation.y = state.rot

    applyCamera()

    const headY = THREE.MathUtils.lerp(HEAD_TOP, HEAD_BOTTOM, state.depth)

    head.position.set(AXIS_X, headY, 0)

    pipe.position.y = headY - 0.55 - PIPE_LEN / 2

    if (!reducedMotion) {
      pipe.rotation.y +=
        dt * (state.depth > 0.001 && state.water < 0.5 ? 5 : 1.2)
    }

    groundMat.opacity = 1 - state.strata * 0.75

    grid.material.opacity = 0.2 * (1 - state.strata)

    landscape.terrainMaterial.opacity = 1 - state.strata

    strataMats.forEach((mat, index) => {
      mat.opacity = state.strata * 0.5 * (1 - state.water * 0.55)

      if (index === strataMats.length - 1) {
        mat.color.setHex(0x0e3a9e)

        mat.emissive.setHex(0x1e6bff)

        mat.emissiveIntensity = state.water * 0.9

        mat.opacity = Math.min(0.9, state.strata * 0.5 + state.water * 0.45)
      }
    })

    strataEdges.forEach((mat) => {
      mat.opacity = state.strata * 0.7
    })

    waterMat.opacity = state.water * 0.55

    columnMat.opacity = state.water * 0.95

    column.scale.y = Math.max(0.001, state.water)

    waterLight.intensity = state.water * 60

    const bitY = pipe.position.y - PIPE_LEN / 2 - 0.25

    const waterAmount = THREE.MathUtils.clamp(state.water, 0, 1)

    waterJet.position.set(AXIS_X, bitY - 0.38, 0)

    waterJet.scale.set(1, Math.max(0.001, waterAmount), 1)

    waterJetMat.opacity = waterAmount * 0.8

    splash.position.set(AXIS_X, bitY - 0.75, 0)

    splash.scale.setScalar(0.6 + waterAmount * 0.8)

    splashMat.opacity = waterAmount * 0.45

    if (!reducedMotion) {
      const drilling = state.depth > 0.02 && state.water < 0.2 ? 1 : 0

      cuttings.update(dt, drilling * 0.9, 3.2, 1.2)

      droplets.update(dt, state.water > 0.4 ? state.water : 0, 5.5, 0.9)
    }
  }

  // -------------------------------------------------
  // RENDER
  // -------------------------------------------------

  function render() {
    update(0)

    renderer.render(scene, camera)
  }

  // -------------------------------------------------
  // ANIMATION LOOP
  // -------------------------------------------------

  let raf = 0
  let running = false
  let last = 0

  function frame(now) {
    if (!running) return

    raf = requestAnimationFrame(frame)

    const dt = last ? Math.min((now - last) / 1000, 0.05) : 0

    last = now

    update(dt)

    renderer.render(scene, camera)
  }

  function start() {
    if (running) return

    running = true
    last = performance.now()

    raf = requestAnimationFrame(frame)
  }

  function stop() {
    running = false

    cancelAnimationFrame(raf)

    raf = 0
  }

  function setActive(active) {
    if (active) {
      start()
    } else {
      stop()
    }
  }

  // -------------------------------------------------
  // RESIZE OBSERVER
  // -------------------------------------------------

  const ro = new ResizeObserver(resize)

  ro.observe(canvas.parentElement ?? canvas)

  // -------------------------------------------------
  // WEBGL CONTEXT LOST
  // -------------------------------------------------

  const lost = (event) => {
    event.preventDefault()

    stop()

    onContextLost?.()
  }

  canvas.addEventListener('webglcontextlost', lost)

  resize()

  // -------------------------------------------------
  // DISPOSE
  // -------------------------------------------------

  function dispose() {
    stop()

    ro.disconnect()

    canvas.removeEventListener('webglcontextlost', lost)

    scene.traverse((object) => {
      if (object.geometry) {
        object.geometry.dispose()
      }

      const materials = Array.isArray(object.material)
        ? object.material
        : object.material
          ? [object.material]
          : []

      materials.forEach((material) => {
        material.dispose()
      })
    })

    padAlpha.dispose()

    envTexture.dispose()

    renderer.dispose()

    renderer.forceContextLoss()
  }

  // -------------------------------------------------
  // API (unchanged)
  // -------------------------------------------------

  return {
    state,
    setActive,
    resize,
    render,
    dispose,
  }
}