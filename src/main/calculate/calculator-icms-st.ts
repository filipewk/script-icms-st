import {
  CalculateBaseIcmsSt,
  CalculateIcmsSt,
  CalculateRateio,
  convertToBrlNumber,
  HandleAliquotaInterna,
  HandleMva
} from '../../domain/usecases/calculate/calculator-icms-st'

export class IcmsStCalculator implements
CalculateBaseIcmsSt,
CalculateIcmsSt,
CalculateRateio,
convertToBrlNumber,
HandleAliquotaInterna,
HandleMva {
  calculateBaseIcmsSt (valorBaseCalculoIcms: number, valorIpi: number, mva: number): number {
    const saldoProduto = valorBaseCalculoIcms + valorIpi
    const mvaCalculada = saldoProduto * (mva / 100)
    return Number((saldoProduto + mvaCalculada).toFixed(2))
  }

  calculateIcmsSt (valorBaseCalculoIcms: number, valorIcms: number, aliquotaInternaEstado: number): number {
    return Number((valorBaseCalculoIcms * (aliquotaInternaEstado / 100) - valorIcms).toFixed(2))
  }

  calculateRateio (amount: number, totalIcmsSt: number): number {
    return Number((totalIcmsSt / amount).toFixed(2))
  }

  handleMva (cliComandMva12Percent: string = '84.35', cliComandMva4Percent: string = '101.11'): any {
    const mva12 = Number(cliComandMva12Percent)
    const mva4 = Number(cliComandMva4Percent)
    return {
      mva12,
      mva4
    }
  }

  handleAliquotaInterna (cliComandAliquotaInterna: string = '18'): number {
    const aliquotaInterna = Number(cliComandAliquotaInterna)
    return aliquotaInterna
  }

  convertToBrlNumber (value: number): string {
    return value
      .toString()
      .replace('.', ',')
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
  }
}
