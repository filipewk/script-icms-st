import commander from 'commander'
import { makeGenerateGnre } from './src/main/factories/generate-gnre-factory'

(async () => {
  /**
   * node cli.js --help
   */
  commander
    .version('v1')
    .option('-a, --arquivo [value]', 'Digitar o nome do arquivo para leitura')
    .option('-d, --data [value]', 'Digitar a data do vencimento da GNRE')
    .option('-m12, --mva12 [value]', 'Digitar o valor da mva 12% ')
    .option('-m4, --mva4 [value]', 'Digitar o valor da mva 4%')
    .option('-al, --aliquota [value]', 'Digitar a aliquota interna do estado')
    .parse(process.argv)
  /**
   * node cli -a 487348 -d 31/12/2020
   */
  try {
    if (commander.arquivo) {
      const numeroNfe = commander.arquivo
      const dataVencimento = commander.data
      const mva12 = commander.mva12
      const mva4 = commander.mva4
      const aliquotaInterna = commander.aliquota
      const gnre = makeGenerateGnre()
      await gnre.generate({ numeroNfe, dataVencimento, mva12, mva4, aliquotaInterna })
      return
    }
  } catch (error) {
    console.log('Erro na leitura do XML')
  }
})()
