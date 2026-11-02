
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

const PIPE_LEN = 7
const AXIS_X = 2.8
const HEAD_TOP = 7.2
const HEAD_BOTTOM = 3.6
const BORE_BOTTOM = -3.8

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
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

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

export function createDrillScene(
  canvas,
  { reducedMotion = false, onContextLost } = {}
) {
  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  })

  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.15
  renderer.setClearColor(0x000000, 0)

  const scene = new THREE.Scene()
  scene.fog = new THREE.Fog(0x080d15, 24, 60)

  // Environment
  const pmrem = new THREE.PMREMGenerator(renderer)
  const room = new RoomEnvironment()
  const envTexture = pmrem.fromScene(room, 0.04).texture

  scene.environment = envTexture
  scene.environmentIntensity = 0.8
  room.dispose()
  pmrem.dispose()

  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 120)

  // Lights
  scene.add(new THREE.HemisphereLight(0xe5efff, 0x252019, 1.15))

  const key = new THREE.DirectionalLight(0xffe6ae, 3)
  key.position.set(7, 12, 9)
  scene.add(key)

  const fill = new THREE.DirectionalLight(0xc7d9ed, 1.3)
  fill.position.set(-8, 6, 6)
  scene.add(fill)

  const rim = new THREE.DirectionalLight(0x6b9dff, 2)
  rim.position.set(-8, 7, -8)
  scene.add(rim)

  const waterLight = new THREE.PointLight(0x2f8bff, 0, 14, 1.6)
  waterLight.position.set(AXIS_X, BORE_BOTTOM, 0)
  scene.add(waterLight)

  // Materials
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

  const world = new THREE.Group()
  scene.add(world)

  // Geometry helpers
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

  // Ground and grid
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x111820,
    roughness: 0.92,
    metalness: 0.08,
    transparent: true,
    opacity: 1,
  })

  const ground = new THREE.Mesh(new THREE.CircleGeometry(9, 72), groundMat)
  ground.rotation.x = -Math.PI / 2
  ground.position.y = -0.04
  world.add(ground)

  const grid = new THREE.GridHelper(18, 36, 0x78652d, 0x343a40)
  grid.position.y = 0.005
  grid.material.transparent = true
  grid.material.opacity = 0.2
  world.add(grid)

  // Track chassis
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

      const hub = cyl(
        0.11,
        0.11,
        0.2,
        yellow,
        x,
        0.38,
        z + side * 0.4
      )
      hub.rotation.x = Math.PI / 2
    }

    for (const x of [-1.35, -0.45, 0.45, 1.35]) {
      const roller = cyl(
        0.11, 0.11, 0.12, pipeMat,
        x, 0.37, z + side * 0.35
      )
      roller.rotation.x = Math.PI / 2
    }

    const count = 38
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2
      const x = 2.2 * Math.cos(a)
      const y = 0.38 + 0.38 * Math.sin(a)

      const pad = box(
        0.29, 0.115, 0.11, rubber,
        x, y, z + side * 0.37
      )
      pad.rotation.z = a + Math.PI / 2
    }

    box(3, 0.07, 0.045, yellow, 0, 0.66, z + side * 0.31)
  }

  // Chassis deck
  box(4.3, 0.5, 2.35, darkSteel, 0, 0.95, 0)
  box(4.34, 0.09, 2.4, yellow, 0, 1.22, 0)

  // Engine compartment
  box(2, 1.05, 1.85, steel, -1.12, 1.8, 0)
  box(2.04, 0.09, 1.89, yellow, -1.12, 2.34, 0)

  for (let i = 0; i < 7; i++) {
    box(0.035, 0.55, 1.35, darkSteel, -2.14, 1.8, -0.6 + i * 0.2)
  }

  // Exhaust
  cyl(0.085, 0.085, 0.95, darkSteel, -1.7, 2.78, 0.55)
  cyl(0.12, 0.12, 0.12, pipeMat, -1.7, 3.26, 0.55)

  // Cabin
  box(1.25, 1.25, 1.5, steel, 0.55, 1.95, 0)
  box(1.29, 0.1, 1.55, darkSteel, 0.55, 2.61, 0)
  box(0.055, 0.77, 1.2, glass, 1.19, 2.12, 0)

  for (const side of [-1, 1]) {
    box(0.72, 0.65, 0.045, glass, 0.55, 2.12, side * 0.765)
    box(0.78, 0.055, 0.06, yellow, 0.55, 2.48, side * 0.79)
  }

  // Steps
  for (let i = 0; i < 3; i++) {
    box(0.5, 0.07, 0.45, darkSteel, 0.2 - i * 0.15, 1.12 - i * 0.18, 1.12)
  }

  // Mast
  const MAST_BASE = 1.35
  const MAST_TOP = 8.5

  box(1.5, 0.3, 1.5, darkSteel, 2.4, 1.2, 0)

  for (const z of [-0.5, 0.5]) {
    box(0.19, MAST_TOP - MAST_BASE, 0.2, darkSteel,
      AXIS_X, (MAST_TOP + MAST_BASE) / 2, z)

    box(0.055, MAST_TOP - MAST_BASE - 0.25, 0.055, yellow,
      AXIS_X + 0.115, (MAST_TOP + MAST_BASE) / 2, z)
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

  // Hydraulic supports
  strut([1.35, 1.35, 0.4], [2.55, 4.1, 0.4], 0.13, darkSteel)
  strut([1.38, 1.35, 0.4], [2.5, 4.05, 0.4], 0.07, pipeMat)
  strut([1.35, 1.35, -0.4], [2.55, 4.1, -0.4], 0.13, darkSteel)
  strut([1.38, 1.35, -0.4], [2.5, 4.05, -0.4], 0.07, pipeMat)

  // Hydraulic hoses
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

  // Moving drill head
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

  // Spare rods
  for (let i = 0; i < 4; i++) {
    const rod = cyl(0.085, 0.085, 3.2, pipeMat, -0.95 + i * 0.21, 1.5, 1.5)
    rod.rotation.z = Math.PI / 2
  }

  // Drill pipe
  const pipe = new THREE.Group()

  cyl(0.09, 0.09, PIPE_LEN, pipeMat, 0, 0, 0, pipe, 20)

  for (let y = -PIPE_LEN / 2 + 0.5; y < PIPE_LEN / 2; y += 1.5) {
    cyl(0.125, 0.125, 0.14, darkSteel, 0, y, 0, pipe, 16)
  }

  const helix = new THREE.Mesh(
    new THREE.TubeGeometry(new HelixCurve(0.13, PIPE_LEN - 0.4, 15), 220, 0.022, 6),
    yellow
  )
  pipe.add(helix)

  const bit = cyl(0.01, 0.22, 0.5, steel, 0, -PIPE_LEN / 2 - 0.25, 0, pipe, 8)
  bit.name = 'bit'

  pipe.position.x = AXIS_X
  world.add(pipe)

  // Geological layers
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

    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geometry, 30), edgeMat)
    edges.position.copy(mesh.position)
    world.add(edges)

    strataMats.push(mat)
    strataEdges.push(edgeMat)
    top -= def.thickness
  }

  // Underground water layer
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

  // Water jet from the drill bit
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

  // Particles
  const cuttings = makeParticles(0xb4a58f, 140, 0.07)
  const droplets = makeParticles(0x7fbaff, 180, 0.09)
  world.add(cuttings.points, droplets.points)

  // GSAP-controlled state
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

  function applyCamera() {
    const aspect = width / height
    const factor = aspect < 1
      ? Math.min(1.9, 1.12 / Math.pow(aspect, 0.62))
      : 1

    const localLook = tmp.set(state.lx, state.ly, state.lz)

    offset.set(
      state.px - state.lx,
      state.py - state.ly,
      state.pz - state.lz
    ).multiplyScalar(factor)

    look.copy(localLook).applyAxisAngle(worldUp, state.rot)
    camera.position.copy(look).add(offset)
    camera.lookAt(look)
  }

  function resize() {
    const rect = canvas.parentElement?.getBoundingClientRect() ?? canvas.getBoundingClientRect()

    width = Math.max(1, Math.floor(rect.width))
    height = Math.max(1, Math.floor(rect.height))

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, width < 700 ? 1.5 : 1.75))
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

  function update(dt) {
    world.rotation.y = state.rot
    applyCamera()

    const headY = THREE.MathUtils.lerp(HEAD_TOP, HEAD_BOTTOM, state.depth)
    head.position.set(AXIS_X, headY, 0)

    pipe.position.y = headY - 0.55 - PIPE_LEN / 2

    if (!reducedMotion) {
      pipe.rotation.y += dt * (state.depth > 0.001 && state.water < 0.5 ? 5 : 1.2)
    }

    groundMat.opacity = 1 - state.strata * 0.75
    grid.material.opacity = 0.2 * (1 - state.strata)

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

    // Position the water jet at the bottom of the moving drill pipe.
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

  function render() {
    update(0)
    renderer.render(scene, camera)
  }

  // Render loop
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
    if (active) start()
    else stop()
  }

  const ro = new ResizeObserver(resize)
  ro.observe(canvas.parentElement ?? canvas)

  const lost = (event) => {
    event.preventDefault()
    stop()
    onContextLost?.()
  }

  canvas.addEventListener('webglcontextlost', lost)
  resize()

  function dispose() {
    stop()
    ro.disconnect()
    canvas.removeEventListener('webglcontextlost', lost)

    scene.traverse((object) => {
      if (object.geometry) object.geometry.dispose()

      const materials = Array.isArray(object.material)
        ? object.material
        : object.material
          ? [object.material]
          : []

      materials.forEach((material) => material.dispose())
    })

    envTexture.dispose()
    renderer.dispose()
    renderer.forceContextLoss()
  }

  return {
    state,
    setActive,
    resize,
    render,
    dispose,
  }
}
