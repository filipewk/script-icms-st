import { XmlModel } from '../../models/xml'

export interface ReadXml {
  readXml: (cliUserCommand: string) => XmlModel
}
