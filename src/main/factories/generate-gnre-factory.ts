import { GenerateGnre } from '../bot/generate-gnre'
import { makeResultOfXml } from './xml-result-factory'
import { makeResultOfIcmsSt } from './result-icms-st-factory'

export default (): GenerateGnre => {
  return new GenerateGnre(makeResultOfXml(), makeResultOfIcmsSt())
}
