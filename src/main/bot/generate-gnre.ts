import { ChromeGnre, CliComandsParams } from '../../domain/usecases/gnre/generate-gnre'
import { ResultIcmsSt } from '../calculate/result-icms-st'
import { xPathContents, links } from '../configs/contents'
import { ReadXml } from '../../domain/usecases/xml/read-xml'
import { Builder, By } from 'selenium-webdriver'

const driver = new Builder()
  .forBrowser('chrome')
  .build()

export class GenerateGnre implements ChromeGnre {
  constructor (
    private readonly convertedJson: ReadXml,
    private readonly resultSt: ResultIcmsSt
  ) {}

  async generate (cliComandsParams: CliComandsParams): Promise<void> {
    try {
      const { mva12, mva4, aliquotaInterna, numeroNfe, dataVencimento } = cliComandsParams
      const { nIe, nNFe, chaveNfe } = this.convertedJson.readXml(numeroNfe)
      const dateWithNoBar = dataVencimento.replace('/', '')
      const totalWithNoComma = this.resultSt.result({
        mva12,
        mva4,
        aliquotaInterna,
        numeroNfe
      }).replace('.', '')

      const documentInitialised = async () =>
        await driver.executeScript('return document.readyState;')

      await driver.get(links.gnreUrl)
      await driver.findElement(By.xpath(xPathContents.dropdownGnre))
        .sendKeys('100099,10009-9 ICMS - SUBST.TRIBUTÁRIA POR OPERAÇÃO')
      await driver.findElement(By.xpath(xPathContents.inscricaoEstadual))
        .sendKeys(nIe.toString())
      await driver.findElement(By.xpath(xPathContents.buttonConsultar))
        .click()

      // new page
      await driver.wait(async () => documentInitialised(), 10000)
      await driver.findElement(By.xpath(xPathContents.numeroDoc))
        .sendKeys(nNFe.toString())
      await driver.findElement(By.xpath(xPathContents.totalSt))
        .sendKeys(totalWithNoComma)
      await driver.findElement(By.xpath(xPathContents.dataVencimentoGnre))
        .sendKeys(dateWithNoBar)
      await driver.findElement(By.xpath(xPathContents.dropdownDiaVencimento))
        .sendKeys(dateWithNoBar.slice(0, 2))
      await driver.findElement(By.xpath(xPathContents.buttonNext))
        .click()

      // get new tab
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
        await driver.findElement(By.xpath(xPathContents.observacoes))
          .sendKeys(`ICMS ST s/ NOTA FISCAL DE COMPRA,\nChave NFE: ${chaveNfe.replace('NFe', '')}`)
        await driver.findElement(By.xpath(xPathContents.buttonNext))
          .click()
      }

      await driver.sleep(3000)
      const getWindow = await driver.getAllWindowHandles()
      await driver.switchTo().window(getWindow[3])
      const iframe = await driver.findElement(By.xpath(xPathContents.frameToPrint))
      await driver.switchTo().frame(iframe)
      await driver.findElement(By.xpath(xPathContents.buttonPrint))
        .click()
      await driver.sleep(300000)
    } catch (error) {
      console.log(error)
    }
  }
}
