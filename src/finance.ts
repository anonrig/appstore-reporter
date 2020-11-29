import RequestManager, { RequestManagerOptions } from './request-manager'
import { GetAccountsResponse, VendorsAndRegionsResponse, ReportStatusResponse } from './response'
import { FinanceReportQuery, Account, VendorRegions, FinanceTransaction } from './interfaces'
import { camelCase } from './helpers'

export default class FinanceReporter {
  private url: string = '/finance/v1'
  private request: RequestManager

  /**
   * @param options manager options.
   */
  constructor(options: RequestManagerOptions) {
    this.request = new RequestManager(options)
  }

  /**
   * Get all accounts associated with the access token.
   *
   * @returns Accounts
   */
  async getAccounts(): Promise<Account[]> {
    const {
      data: {
        Accounts: { Account }
      }
    } = await this.request.fetch<GetAccountsResponse>(this.url, { type: 'Finance.getAccounts' })
    return Account.map((a) => ({ name: a.Name[0], id: a.Number[0] }))
  }

  /**
   * Get validity of the financial systems.
   *
   * @returns True if financials are available.
   */
  async getStatus(): Promise<boolean> {
    const { data } = await this.request.fetch<ReportStatusResponse>(this.url, { type: 'Finance.getStatus' })
    return data.Status.Code[0] === '0'
  }

  /**
   * Returns the report for the given date.
   *
   * @param fields Query fields for the finance report.
   *
   * @returns Transactions for the date.
   */
  async getReport(fields: FinanceReportQuery): Promise<FinanceTransaction[]> {
    const params: string = ['vendorNumber', 'regionCode', 'reportType', 'fiscalYear', 'fiscalPeriod']
      .map((f) => (fields as any)[f])
      .join(',')

    const { data } = await this.request.stream<string>(this.url, { type: 'Finance.getReport', params })

    const report = data
      .split('\n')
      .filter((row) => row && row.length)
      .map((row) => row.split('\t').map((cell) => cell.trim() || null))

    console.log('header', report[0])
    const reportHeader = (report[0] as string[]).map((h) => camelCase(h))

    return report
      .slice(1)
      .map((value) => {
        const object: any = {}
        if (value && ['Total_Rows', 'Total_Amount', 'Total_Units'].includes((value as any)[0])) {
          return
        }
        value.forEach((el, index) => {
          object[reportHeader[index]] = el
        })

        return object
      })
      .filter((i) => !!i)
  }

  /**
   * @returns vendors and their corresponding regions.
   */
  async getVendorsAndRegions(): Promise<VendorRegions[]> {
    const {
      data: {
        VendorsAndRegions: { Vendor }
      }
    } = await this.request.fetch<VendorsAndRegionsResponse>(this.url, { type: 'Finance.getVendorsAndRegions' })
    return Vendor.map((v) => ({
      id: v.Number[0],
      regions: v.Region.map((r) => ({
        code: r.Code[0],
        types: r.Reports.map(({ Report }) => Report[0])
      }))
    }))
  }
}
