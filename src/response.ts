export interface GetAccountsResponse {
  Accounts: {
    Account: AccountResponse[]
  }
}

export interface AccountResponse {
  Name: string[]
  Number: string[]
}

export interface ReportStatusResponse {
  Status: {
    Code: string[]
    Message: string[]
  }
}

export interface VendorsAndRegionsResponse {
  VendorsAndRegions: {
    Vendor: VendorWithRegionResponse[]
  }
}

export interface VendorWithRegionResponse {
  Number: string[]
  Region: RegionResponse[]
}

export interface RegionResponse {
  Code: string[]
  Reports: RegionReports[]
}

export interface RegionReports {
  Report: string[]
}

export interface VendorsResponse {
  Vendors: VendorResponse
}

export interface VendorResponse {
  Vendor: string[]
}
