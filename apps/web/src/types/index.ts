export type OSType = 'windows' | 'linux' | 'apple' | null

export type OSDATAType = Array<{
  name: string
  value: OSType
  icon: string
  color: string
}>  

export type FormData = {
  os: OSType
  hostLocation: string
  manifestLocation: string
  step: number
}