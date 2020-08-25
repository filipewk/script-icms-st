import { XmlParseJson } from '../../domain/usecases/xml/xml-string-to-json'
import { XmlModel } from '../../domain/models/xml'
import { ReadXml } from '../../domain/usecases/xml/read-xml'

export class XmlResults implements ReadXml {
  constructor (
    private readonly parser: XmlParseJson
  ) {}

  readXml (cliUserCommand: string): XmlModel {
    try {
      const convertedJson: any = this.parser.parse(cliUserCommand)
      const XmlProducts = convertedJson.nfeProc.NFe[0].infNFe[0].det
      const nNFe = convertedJson.nfeProc.NFe[0].infNFe[0].ide[0].nNF
      const nIe = convertedJson.nfeProc.NFe[0].infNFe[0].dest[0].IE
      const chaveNfe = convertedJson.nfeProc.NFe[0].infNFe[0].ATTR.Id
      return {
        XmlProducts,
        nNFe,
        nIe,
        chaveNfe
      }
    } catch (error) {
      console.log('Erro na leitura dos itens do XML!')
    }
  }
}
