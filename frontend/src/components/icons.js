import { Drill, Pickaxe, Cylinder, Waves, Zap, Cable, Sprout, Wrench } from 'lucide-react'
const map = { Drill, Pickaxe, Cylinder, Waves, Zap, Cable, Sprout }
export const iconFor = (name) => map[name] ?? Wrench
