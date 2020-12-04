export interface ReporterAuthentication {
  accessToken: string
}

export interface ReporterConfig {
  baseUrl?: string
  mode?: string
  version?: string
}

export interface Account {
  name: string
  id: string
}

export enum ReportDateType {
  daily = 'Daily',
  weekly = 'Weekly',
  monthly = 'Monthly',
  yearly = 'Yearly'
}

export enum FinancialReportType {
  financial = 'Financial'
}

export enum ReportType {
  sales = 'Sales',
  preOrder = 'Pre-Order',
  subscriber = 'Subscriber'
}

export enum ReportSubType {
  summary = 'Summary',
  detailed = 'Detailed'
}
export interface SalesReportQuery {
  vendorNumber: string
  reportType: ReportType
  reportSubType: ReportSubType
  dateType: ReportDateType // Daily, Weekly
  date: string // YYYYMMDD
  reportVersion: string // 1_2
}

export interface SaleTransaction {
  EventDate: string // YYYY-MM-DD
  AppName: string
  AppAppleID: string
  SubscriptionName?: string
  SubscriptionAppleID: string
  SubscriptionGroupID: string
  StandardSubscriptionDuration?: string
  PromotionalOfferName?: string
  PromotionalOfferID?: string
  SubscriptionOfferType?: string
  SubscriptionOfferDuration?: string
  MarketingOptInDuration?: string
  CustomerPrice?: string
  CustomerCurrency: string
  DeveloperProceeds: string
  ProceedsCurrency: string
  PreservedPricing?: string
  ProceedsReason?: string
  Client?: string
  Device: string
  Country: string
  SubscriberID: string
  SubscriberIDReset?: string
  Refund?: string
  PurchaseDate?: string
  Units?: string
}

export interface FinanceReportQuery {
  vendorNumber: string
  regionCode: string
  reportType: FinancialReportType
  fiscalYear: string
  fiscalPeriod: string
}

export interface VendorRegions {
  id: string
  regions: Region[]
}

export interface Region {
  code: string
  types: string[]
}

export interface FinanceTransaction {
  startDate: string
  endDate: string
  upc?: string
  isrcIsbn?: string
  vendorIdentifier: string
  quantity: string
  partnerShare: string
  extendedPartnerShare: string
  partnerShareCurrency: string
  salesOrReturn: string
  appleIdentifier: string
  artistShowDeveloperAuthor?: string
  title: string
  labelStudioNetworkDeveloperPublisher?: string
  grid?: string
  productTypeIdentifier: string
  isanOtherIdentifier?: string
  countryOfSale: string
  preOrderFlag?: string
  promoCode?: string
  customerPrice: string
  customerCurrency: string
}
