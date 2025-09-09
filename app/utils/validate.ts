import { License, LicenseTypes } from '../types'

export const validateLicense = (license: License) => {
  switch (license.type) {
    case LicenseTypes.A_NOTE:
      return !!license.value
    case LicenseTypes.B_NOTE:
    case LicenseTypes.C_NOTE:
    case LicenseTypes.D_NOTE:
    case LicenseTypes.E_NOTE:
      return true
  }
}
