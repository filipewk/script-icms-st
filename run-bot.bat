SET /P numeroNfe= Digite o numero da Nfe: 
SET /P mva12= Digite a aliquota da mva a 12 se deixar em branco ficara por padrao 84,35: 
SET /P mva4= Digite a aliquota da mva a 4 se deixar em branco ficara por padrao 101,11:
SET /P aliquotaInterna= Digite a aliquota interna do estado, se deixar em branco ficara por padrao 18:
SET /P dataVencimento= Digite a data de vencimento da GNRE: 

node dist/cli  -gnre -a %numeroNfe% -d %dataVencimento% -m12 %mva12% -m4 %mva4% -al %aliquotaInterna%