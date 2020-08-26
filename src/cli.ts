import commander from 'commander'
import { makeResultOfIcmsSt } from './main/factories/result-icms-st-factory'

(async () => {
  /**
   * node cli.js --help
   */
  commander
    .version('v1')
    .option('-gnre, --gerargnre [value]', 'Colocar este comando para gerar gnre')
    .option('-a, --arquivo [value]', 'Digitar o nome do arquivo para leitura')
    .option('-d, --data [value]', 'Digitar a data do vencimento da GNRE')
    .option('-m12, --mva12 [value]', 'Digitar o valor da mva 12% ')
    .option('-m4, --mva4 [value]', 'Digitar o valor da mva 4%')
    .option('-al, --aliquota [value]', 'Digitar a aliquota interna do estado')
    .parse(process.argv)
  /**
   * node cli -gnre -d 31/12/2020 -a 487348
   */
  try {
    if (commander.arquivo) {
      const numeroNfe = commander.arquivo
      const dataVencimento = commander.data
      const mva12 = commander.mva12
      const mva4 = commander.mva4
      const aliquotaInterna = commander.aliquota
      if (commander.gerargnre) {
        const app = (await import('./main/factories/generate-gnre-factory')).default()
        await app.generate({ numeroNfe, dataVencimento, mva12, mva4, aliquotaInterna })
      }
      const interfaceSt = makeResultOfIcmsSt()
      interfaceSt.result({ numeroNfe, mva12, mva4, aliquotaInterna })
    }
  } catch (error) {
    console.log(error)
  }
})()
