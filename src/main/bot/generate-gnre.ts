import { Builder, By } from 'selenium-webdriver'
import { ChromeGnre, CliComandsParams } from '../../domain/usecases/gnre/generate-gnre'
import { ResultIcmsSt } from '../calculate/result-icms-st'
import { ReadXml } from '../../domain/usecases/xml/read-xml'
const driver = new Builder().forBrowser('chrome').build()

export class GenerateGnre implements ChromeGnre {
  constructor (
    private readonly convertedJson: ReadXml,
    private readonly resultSt: ResultIcmsSt
  ) {}

  async generate (cliComandsParams: CliComandsParams): Promise<void> {
    try {
      const documentInitialised = async () =>
        await driver.executeScript('return document.readyState;')

      await driver.get('https://www.arinternet.pr.gov.br/portalsefa/_d_gnre1.asp')
      await driver.findElement(By.xpath("//select[@name='eCodigo']")).sendKeys('100099,10009-9 ICMS - SUBST.TRIBUTÁRIA POR OPERAÇÃO')
      await driver.findElement(By.xpath("//input[@name='eInscricao']")).sendKeys(this.convertedJson.readXml(cliComandsParams.numeroNfe).nIe.toString())
      await driver.findElement(By.xpath("//input[@value='Consultar']")).click()

      // selenium open new page
      const dateWithNoBar = cliComandsParams.dataVencimento.replace('/', '')
      const { mva12, mva4, aliquotaInterna, numeroNfe } = cliComandsParams
      const totalWithNoComma = this.resultSt.result({ mva12, mva4, aliquotaInterna, numeroNfe }).replace('.', '')
      await driver.wait(async () => documentInitialised(), 10000)
      await driver.findElement(By.xpath("//input[@name='eNumDoc']")).sendKeys(this.convertedJson.readXml(cliComandsParams.numeroNfe).nNFe.toString())
      await driver.findElement(By.xpath("//input[@name='Campo06']")).sendKeys(totalWithNoComma)
      await driver.findElement(By.xpath("//input[@name='DtVencimento']")).sendKeys(dateWithNoBar)
      await driver.findElement(By.xpath("//select[@name='eDiaDtCalculo']")).sendKeys(dateWithNoBar.slice(0, 2))
      await driver.findElement(By.xpath("//input[@name='b1']")).click()

      // handle new tab
      const tab = await driver.wait(
        async () => (await driver.getAllWindowHandles()).length === 2,
        10000
      )

      if (tab) {
        const originalWindow = await driver.getWindowHandle()
        const windows = await driver.getAllWindowHandles()
        windows.forEach(async handle => {
          if (handle !== originalWindow) {
            await driver.switchTo().window(handle)
          }
        })
        await driver.findElement(By.xpath("//textarea[@name='Campo23']"))
          .sendKeys(`ICMS ST s/ NOTA FISCAL DE COMPRA,\nChave NFE: ${this.convertedJson.readXml(cliComandsParams.numeroNfe).chaveNfe.replace('NFe', '')}`)
        await driver.findElement(By.xpath("//input[@name='b1']")).click()
      }

      await driver.sleep(3000)
      const getWindow = await driver.getAllWindowHandles()
      await driver.switchTo().window(getWindow[3])
      const iframe = await driver.findElement(By.xpath("//frame[@name='header']"))
      await driver.switchTo().frame(iframe)
      await driver.findElement(By.xpath("//input[@value=' Imprimir ']")).click()
      await driver.sleep(300000)
    } catch (error) {
      console.log(error)
    }
  }
}
