import { XmlToString } from '../../domain/usecases/xml/xml-convert-to-string'
import { XmlParseJson } from '../../domain/usecases/xml/xml-string-to-json'
import xml2js from 'xml2js'
import fs from 'fs'

export class XmlConverter implements XmlToString, XmlParseJson {
  read (xmlToRead: string): string {
    try {
      const xml_string = fs.readFileSync(`./src/data/xml/${xmlToRead}.xml`, 'utf8')
      return xml_string
    } catch (err) {
      if (err.code !== 'ENOENT') throw err
      console.log(`
          ERROR!
          Verifique se digitou no terminal exatamente o mesmo nome do XML 
          tente rodar novamente o comando: \n
          node cli -a "nome do arquivo" `)
    }
  }

  parse (xmlToParse: string): any {
    const parser = new xml2js.Parser({ attrkey: 'ATTR' })
    let convertedJson: any
    parser.parseString(this.read(xmlToParse), (err: null, res: any) => {
      convertedJson = res
    })
    return convertedJson
  }
}
