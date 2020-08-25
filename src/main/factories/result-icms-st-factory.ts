import { makeResultOfXml } from './xml-result-factory'
import { ResultIcmsSt } from '../calculate/result-icms-st'
import { IcmsStCalculator } from '../calculate/calculator-icms-st'

export const makeResultOfIcmsSt = (): ResultIcmsSt => {
  const calculatorSt = new IcmsStCalculator()
  return new ResultIcmsSt(makeResultOfXml(), calculatorSt)
}
