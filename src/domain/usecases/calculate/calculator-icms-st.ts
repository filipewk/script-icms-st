export interface CalculateIcmsSt {
  calculateIcmsSt: (valorBaseCalculoIcms: number, valorIcms: number, aliquotaInternaEstado: number) => number
}

export interface CalculateBaseIcmsSt {
  calculateBaseIcmsSt: (valorBaseCalculoIcms: number, valorIpi: number, mva: number) => number
}

export interface CalculateRateio {
  calculateRateio: (amount: number, totalIcmsSt: number) => number
}

export interface HandleMva {
  handleMva: (cliComandMva12Percent: string, cliComandMva4Percent: string) => any
}

export interface HandleAliquotaInterna {
  handleAliquotaInterna: (cliComandAliquotaInterna: string) => number
}

export interface convertToBrlNumber {
  convertToBrlNumber: (value: number) => string
}
