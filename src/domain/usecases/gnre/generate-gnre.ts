export type CliComandsParams = {
  numeroNfe: string
  mva12: string
  mva4: string
  dataVencimento: string
  aliquotaInterna: string
}

export interface ChromeGnre {
  generate: (cliComandsParams: CliComandsParams) => Promise<void>
}
