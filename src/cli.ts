import { makeResultOfIcmsSt } from './main/factories/result-icms-st-factory';
import commander from 'commander';
import generateGnreFactory from './main/factories/generate-gnre-factory';

async function generateGnre(options) {
  const app = generateGnreFactory();
  await app.generate(options);
}

function processIcmsSt(options) {
  const interfaceSt = makeResultOfIcmsSt();
  interfaceSt.result(options);
}

function parseOptions() {
  commander
    .version('v1')
    .option('-gnre, --gerargnre [value]', 'Colocar este comando para gerar gnre')
    .option('-a, --arquivo [value]', 'Digitar o nome do arquivo para leitura')
    .option('-d, --data [value]', 'Digitar a data do vencimento da GNRE')
    .option('-m12, --mva12 [value]', 'Digitar o valor da mva 12% ')
    .option('-m4, --mva4 [value]', 'Digitar o valor da mva 4%')
    .option('-al, --aliquota [value]', 'Digitar a aliquota interna do estado')
    .parse(process.argv);

  return {
    numeroNfe: commander.arquivo,
    dataVencimento: commander.data,
    mva12: commander.mva12 === true ? undefined : commander.mva12,
    mva4: commander.mva4 === true ? undefined : commander.mva4,
    aliquotaInterna: commander.aliquota === true ? undefined : commander.aliquota,
    gerargnre: commander.gerargnre,
  };
}

async function main() {
  try {
    const options = parseOptions();
    if (options.numeroNfe) {
      if (options.gerargnre) {
        await generateGnre(options);
      }
      processIcmsSt(options);
    }
  } catch (error) {
    console.error(error);
  }
}

main();
