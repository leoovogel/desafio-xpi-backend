import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.client.createMany({
    data: [
      { name: 'Leonardo', email: 'leonardo@gmail.com', password: '$2b$10$B2bXfD5bLEBbyysht4lGU.Zouki5gJmU4mISQoQZ83ECQ3XIN/Qt2' },
      { name: 'Jose', email: 'jose@gmail.com', password: '$2b$10$eS5g40R9O6FrSDtor1sSq.97bptZnBC6c0BzdkB/6YnJjPrZ1qBFG' },
    ]
  });

  const clients = await prisma.client.findMany();

  clients.forEach(async (client) => {
    await prisma.account.create({
      data: { client_id: client.id } })
  })

  const accounts = await prisma.account.findMany();

  await prisma.asset.createMany({
    data: [
      { symbol: 'RRRP3', name: '3R PETROLEUM', available_quantity: 200372163, price: 29.43 },
      { symbol: 'ALPA4', name: 'ALPARGATAS', available_quantity: 201257220, price: 20.63 },
      { symbol: 'ABEV3', name: 'AMBEV S/A', available_quantity: 4380195841, price: 14.51 },
      { symbol: 'AMER3', name: 'AMERICANAS', available_quantity: 596875824, price: 15.93 },
      { symbol: 'ASAI3', name: 'ASSAI', available_quantity: 794531367, price: 15.65 },
      { symbol: 'AZUL4', name: 'AZUL', available_quantity: 327741172, price: 11.58 },
      { symbol: 'B3SA3', name: 'B3', available_quantity: 5987625321, price: 10.72 },
      { symbol: 'BPAN4', name: 'BANCO PAN', available_quantity: 341124068, price: 7.08 },
      { symbol: 'BBSE3', name: 'BBSEGURIDADE', available_quantity: 671629692, price: 27.88 },
      { symbol: 'BRML3', name: 'BR MALLS PAR', available_quantity: 828273884, price: 7.82 },
      { symbol: 'BBDC3', name: 'BRADESCO', available_quantity: 1516726535, price: 14.16 },
      { symbol: 'BBDC4', name: 'BRADESCO', available_quantity: 5160570290, price: 17.05 },
      { symbol: 'BRAP4', name: 'BRADESPAR', available_quantity: 251402249, price: 22.33 },
      { symbol: 'BBAS3', name: 'BRASIL', available_quantity: 1420530937, price: 34.67 },
      { symbol: 'BRKM5', name: 'BRASKEM', available_quantity: 264975728, price: 34.08 },
      { symbol: 'BRFS3', name: 'BRF SA', available_quantity: 1076512610, price: 16.07 },
      { symbol: 'BPAC11', name: 'BTGP BANCO', available_quantity: 1301655996, price: 22.47 },
      { symbol: 'CRFB3', name: 'CARREFOUR BR', available_quantity: 410988561, price: 16.93 },
      { symbol: 'CCRO3', name: 'CCR SA', available_quantity: 1115693556, price: 12.28 },
      { symbol: 'CMIG4', name: 'CEMIG', available_quantity: 1448479060, price: 10.65 },
      { symbol: 'CIEL3', name: 'CIELO', available_quantity: 1144359228, price: 4.08 },
      { symbol: 'COGN3', name: 'COGNA ON', available_quantity: 1828106676, price: 2.22 },
      { symbol: 'CPLE6', name: 'COPEL', available_quantity: 1563365506, price: 6.90 },
      { symbol: 'CSAN3', name: 'COSAN', available_quantity: 1171063698, price: 17.49 },
      { symbol: 'CPFE3', name: 'CPFL ENERGIA', available_quantity: 187732538, price: 32.14 },
      { symbol: 'CMIN3', name: 'CSNMINERACAO', available_quantity: 1120593365, price: 3.40 },
      { symbol: 'CVCB3', name: 'CVC BRASIL', available_quantity: 276543929, price: 6.76 },
      { symbol: 'CYRE3', name: 'CYRELA REALT', available_quantity: 281609283, price: 12.26 },
      { symbol: 'DXCO3', name: 'DEXCO', available_quantity: 295712871, price: 9.71 },
      { symbol: 'ECOR3', name: 'ECORODOVIAS', available_quantity: 339237914, price: 5.40 },
      { symbol: 'ELET3', name: 'ELETROBRAS', available_quantity: 985704248, price: 44.63 },
      { symbol: 'ELET6', name: 'ELETROBRAS', available_quantity: 242987127, price: 45.67 },
      { symbol: 'EMBR3', name: 'EMBRAER', available_quantity: 734588205, price: 11.87 },
      { symbol: 'ENBR3', name: 'ENERGIAS BR', available_quantity: 230931405, price: 21.29 },
      { symbol: 'ENGI11', name: 'ENERGISA', available_quantity: 248477689, price: 40.65 },
      { symbol: 'ENEV3', name: 'ENEVA', available_quantity: 1557479978, price: 14.35 },
      { symbol: 'EGIE3', name: 'ENGIE BRASIL', available_quantity: 255217329, price: 42.17 },
      { symbol: 'EQTL3', name: 'EQUATORIAL', available_quantity: 1100513485, price: 23.05 },
      { symbol: 'EZTC3', name: 'EZTEC', available_quantity: 101618236, price: 16.37 },
      { symbol: 'FLRY3', name: 'FLEURY', available_quantity: 303373882, price: 15.27 },
      { symbol: 'GGBR4', name: 'GERDAU', available_quantity: 1097534498, price: 23.81 },
      { symbol: 'GOAU4', name: 'GERDAU MET', available_quantity: 698275321, price: 9.94 },
      { symbol: 'GOLL4', name: 'GOL', available_quantity: 167095214, price: 7.97 },
      { symbol: 'NTCO3', name: 'GRUPO NATURA', available_quantity: 834914221, price: 15.84 },
      { symbol: 'SOMA3', name: 'GRUPO SOMA', available_quantity: 489316435, price: 9.77 },
      { symbol: 'HAPV3', name: 'HAPVIDA', available_quantity: 4454692382, price: 5.95 },
      { symbol: 'HYPE3', name: 'HYPERA', available_quantity: 410253528, price: 39.93 },
      { symbol: 'IGTI11', name: 'IGUATEMI SA', available_quantity: 180013980, price: 18.87 },
      { symbol: 'IRBR3', name: 'IRBBRASIL RE', available_quantity: 1255286531, price: 2.00 },
      { symbol: 'ITSA4', name: 'ITAUSA', available_quantity: 4736140654, price: 8.47 },
      { symbol: 'ITUB4', name: 'ITAUUNIBANCO', available_quantity: 4781077143, price: 23.26 },
      { symbol: 'JBSS3', name: 'JBS', available_quantity: 1290736673, price: 30.73 },
      { symbol: 'JHSF3', name: 'JHSF PART', available_quantity: 305915142, price: 5.60 },
      { symbol: 'KLBN11', name: 'KLABIN S/A', available_quantity: 812994397, price: 18.90 },
      { symbol: 'RENT3', name: 'LOCALIZA', available_quantity: 735708470, price: 55.42 },
      { symbol: 'LWSA3', name: 'LOCAWEB', available_quantity: 418965264, price: 6.74 },
      { symbol: 'LREN3', name: 'LOJAS RENNER', available_quantity: 977821540, price: 24.42 },
      { symbol: 'MGLU3', name: 'MAGAZ LUIZA', available_quantity: 2896234638, price: 2.86 },
      { symbol: 'MRFG3', name: 'MARFRIG', available_quantity: 348234011, price: 13.39 },
      { symbol: 'CASH3', name: 'MELIUZ', available_quantity: 548153725, price: 1.08 },
      { symbol: 'BEEF3', name: 'MINERVA', available_quantity: 260409710, price: 13.22 },
      { symbol: 'MRVE3', name: 'MRV', available_quantity: 294647234, price: 8.68 },
      { symbol: 'MULT3', name: 'MULTIPLAN', available_quantity: 272718548, price: 23.98 },
      { symbol: 'PCAR3', name: 'PACUCAR-CBD', available_quantity: 156946474, price: 16.90 },
      { symbol: 'PETR3', name: 'PETROBRAS', available_quantity: 2706334382, price: 31.93 },
      { symbol: 'PETR4', name: 'PETROBRAS', available_quantity: 4566442248, price: 29.33 },
      { symbol: 'PRIO3', name: 'PETRORIO', available_quantity: 839159130, price: 22.67 },
      { symbol: 'PETZ3', name: 'PETZ', available_quantity: 336154589, price: 9.87 },
      { symbol: 'POSI3', name: 'POSITIVO TEC', available_quantity: 78053723, price: 6.64 },
      { symbol: 'QUAL3', name: 'QUALICORP', available_quantity: 277027077, price: 10.43 },
      { symbol: 'RADL3', name: 'RAIADROGASIL', available_quantity: 1071076905, price: 20.03 },
      { symbol: 'RDOR3', name: 'REDE D OR', available_quantity: 772010260, price: 30.25 },
      { symbol: 'RAIL3', name: 'RUMO SA', available_quantity: 1216056103, price: 16.09 },
      { symbol: 'SBSP3', name: 'SABESP', available_quantity: 340001934, price: 43.55 },
      { symbol: 'SANB11', name: 'SANTANDER BR', available_quantity: 362703399, price: 27.53 },
      { symbol: 'CSNA3', name: 'SID NACIONAL', available_quantity: 642398790, price: 14.41 },
      { symbol: 'SLCE3', name: 'SLC AGRICOLA', available_quantity: 96270946, price: 42.35 },
      { symbol: 'SULA11', name: 'SUL AMERICA', available_quantity: 283167854, price: 22.10 },
      { symbol: 'SUZB3', name: 'SUZANO SA', available_quantity: 726779281, price: 46.91 },
      { symbol: 'TAEE11', name: 'TAESA', available_quantity: 218568234, price: 40.25 },
      { symbol: 'VIVT3', name: 'TELEF BRASIL', available_quantity: 413890875, price: 46.83 },
      { symbol: 'TIMS3', name: 'TIM', available_quantity: 808619532, price: 12.90 },
      { symbol: 'TOTS3', name: 'TOTVS', available_quantity: 519851955, price: 25.89 },
      { symbol: 'UGPA3', name: 'ULTRAPAR', available_quantity: 1086067887, price: 12.46 },
      { symbol: 'USIM5', name: 'USIMINAS', available_quantity: 514680651, price: 8.91 },
      { symbol: 'VALE3', name: 'VALE', available_quantity: 3768748489, price: 69.21 },
      { symbol: 'VIIA3', name: 'VIA', available_quantity: 1596295753, price: 2.51 },
      { symbol: 'VBBR3', name: 'VIBRA', available_quantity: 1131883365, price: 16.54 },
      { symbol: 'WEGE3', name: 'WEG', available_quantity: 1484859030, price: 25.84 },
      { symbol: 'YDUQ3', name: 'YDUQS PART', available_quantity: 300833122, price: 13.90 },
    ]
  });

  accounts.forEach(async (account) => {
    await prisma.transaction_history.createMany({
      data: [
        { account_id: account.id, value: 20000, transaction_type: 'DEPOSIT' },
        { account_id: account.id, value: 3000, transaction_type: 'DEPOSIT' },
        { account_id: account.id, value: 1000, transaction_type: 'WITHDRAWAL' },
      ]
    });
  })

}

main();
