import { XmlResults } from '../xml-to-json/read-xml-result'
import { XmlConverter } from '../../main/xml-to-json/xml-converter'

export const makeResultOfXml = (): XmlResults => {
  const convertedXml = new XmlConverter()
  return new XmlResults(convertedXml)
}
