export type CliComandsResultParams = {
  numeroNfe: string
  mva12: string
  mva4: string
  aliquotaInterna: string
}

export interface IcmsSt {
  result: (cliComandsResultParams: CliComandsResultParams) => string
}
