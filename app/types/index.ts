export enum LicenseTypes {
  A_NOTE = 'A_NOTE',
  B_NOTE = 'B_NOTE',
  C_NOTE = 'C_NOTE',
  D_NOTE = 'D_NOTE',
  E_NOTE = 'E_NOTE',
}

export type LicenseIOPlatformSerialNumber = {
  type: LicenseTypes.A_NOTE
  value: string
}

export type LicenseSystemProfiler = {
  type: LicenseTypes.B_NOTE
  H: string
  P: string
  M: string
}

export type LicenseRAM = { memoryBytes: number; type: LicenseTypes.C_NOTE; pageSize: number }

export type LicenseCPU = {
  type: LicenseTypes.D_NOTE
  p: 'Apple Silicon' | 'Intel'
  b: 'Apple M4 Pro' | 'Intel'
  a: 'arm64' | 'x64'
  c: number
  t: number
  ib: boolean
}

export type IOPlatformUUID = {
  type: LicenseTypes.E_NOTE
  value: string
}

export type License =
  | LicenseIOPlatformSerialNumber
  | LicenseSystemProfiler
  | LicenseRAM
  | LicenseCPU
  | IOPlatformUUID
