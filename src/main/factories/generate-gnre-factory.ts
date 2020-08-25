import { GenerateGnre } from '../selenium/generate-gnre'
import { makeResultOfXml } from './xml-result-factory'
import { makeResultOfIcmsSt } from './result-icms-st-factory'

export const makeGenerateGnre = (): GenerateGnre => {
  return new GenerateGnre(makeResultOfXml(), makeResultOfIcmsSt())
}
