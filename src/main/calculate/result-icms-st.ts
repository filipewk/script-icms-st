import { IcmsStCalculator } from './calculator-icms-st'
import { IcmsSt, CliComandsResultParams } from '../../domain/usecases/calculate/result-icms-st'
import { ReadXml } from '../../domain/usecases/xml/read-xml'

export class ResultIcmsSt implements IcmsSt {
  constructor(
    private readonly convertedJson: ReadXml,
    private readonly calculatorSt: IcmsStCalculator
  ) { }

  result(cliComandsResultParams: CliComandsResultParams): string {
    const {
      XmlProducts,
      nNFe
    } = this.convertedJson.readXml(cliComandsResultParams.numeroNfe)

    const totalIcmsSt = []

    for (const key in XmlProducts) {
      const CFOP = XmlProducts[key].prod[0].CFOP
        .toString()
        .slice(0, -1)

      if (CFOP === '610') {
        const interfaceResult = []
        let mva: number
        let vIPI: number
        let vICMS: number
        let vBCICMS: number
        let aliquotaICMS: number

        const amountOfProduct = parseInt(XmlProducts[key].prod[0].qCom)
        const productCode = XmlProducts[key].prod[0].cProd
        const productDescription = XmlProducts[key].prod[0].xProd
        const aliquotaInternaICMS = this.calculatorSt.handleAliquotaInterna(cliComandsResultParams.aliquotaInterna)

        try {
          const itemIpi = parseFloat(XmlProducts[key].imposto[0].IPI[0].IPITrib[0].vIPI)
          if (itemIpi) {
            vIPI = itemIpi
          }
        } catch (error) {
          vIPI = 0
        }

        try {
          aliquotaICMS = parseFloat(XmlProducts[key].imposto[0].ICMS[0].ICMS00[0].pICMS)
          vBCICMS = parseFloat(XmlProducts[key].imposto[0].ICMS[0].ICMS00[0].vBC)
          const itemIcms = parseFloat(XmlProducts[key].imposto[0].ICMS[0].ICMS00[0].vICMS)
          if (itemIcms) {
            vICMS = itemIcms
          }
        } catch (error) {
          vBCICMS = parseFloat(XmlProducts[key].prod[0].vProd)
          vICMS = (parseFloat(XmlProducts[key].prod[0].vProd) * 0.12)
          aliquotaICMS = 12
        }

        if (aliquotaICMS === 12) {
          mva = parseFloat(this.calculatorSt.handleMva(cliComandsResultParams.mva12, cliComandsResultParams.mva4).mva12)
        }
        if (aliquotaICMS === 4) {
          mva = parseFloat(this.calculatorSt.handleMva(cliComandsResultParams.mva12, cliComandsResultParams.mva4).mva4)
        }

        const baseCalculoIcms = this.calculatorSt.calculateBaseIcmsSt(vBCICMS, vIPI, mva)
        const valorIcmsSt = this.calculatorSt.calculateIcmsSt(baseCalculoIcms, vICMS, aliquotaInternaICMS)
        const valorRateio = this.calculatorSt.calculateRateio(amountOfProduct, valorIcmsSt)

        interfaceResult.push(
          { Codigo: productCode },
          { Descricao: productDescription },
          { Quantidade: amountOfProduct },
          { BASE_CALCULO_ST: `R$ ${this.calculatorSt.convertToBrlNumber(baseCalculoIcms)}` },
          { ICMS_ST: `R$ ${this.calculatorSt.convertToBrlNumber(valorIcmsSt)}` },
          { Rateio: `R$ ${this.calculatorSt.convertToBrlNumber(valorRateio)} por unidade` }
        )
        totalIcmsSt.push(valorIcmsSt)
        console.log('\n---------------------------------------------------------\n')
        console.log(interfaceResult)
      }
    }

    const totalSt = totalIcmsSt.reduce((ac, valorAtual) => ac + valorAtual, 0).toFixed(2)

    console.log('---------------------------------------------------------')
    console.log(`SOMA DO TOTAL ICMS ST DE TODOS PRODUTOS:
            R$ ${this.calculatorSt.convertToBrlNumber(totalSt)} `)
    console.log(`
            Numero NFE: ${nNFe}
            script by Filipe
            filipewk@gmail.com
            `)
    return totalSt
  }
}
