import RequestManager, { RequestManagerOptions } from './request-manager'
import { GetAccountsResponse, VendorsResponse, ReportStatusResponse } from './response'
import { SalesReportQuery, SaleTransaction, Account } from './interfaces'
import { camelCase } from './helpers'

export default class SalesReporter {
  private url: string = '/sales/v1'
  private request: RequestManager

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
    } = await this.request.fetch<GetAccountsResponse>(this.url, { type: 'Sales.getAccounts' })
    return Account.map((a) => ({ name: a.Name[0], id: a.Number[0] }))
  }

  /**
   * Get validity of the sales systems.
   *
   * @returns True if sales are available.
   */
  async getStatus(): Promise<boolean> {
    const { data } = await this.request.fetch<ReportStatusResponse>(this.url, { type: 'Sales.getStatus' })
    return data.Status.Code[0] === '0'
  }

  /**
   * Returns the report for the given date.
   *
   * @param fields Query fields for the sales report.
   *
   * @returns Transactions for the date.
   */
  async getReport(fields: SalesReportQuery): Promise<SaleTransaction[]> {
    const params: string = ['vendorNumber', 'reportType', 'reportSubType', 'dateType', 'date', 'reportVersion']
      .map((f) => (fields as any)[f])
      .join(',')

    const { data } = await this.request.stream<string>(this.url, { type: 'Sales.getReport', params })

    const report = data
      .split('\n')
      .filter((row) => row && row.length)
      .map((row) => row.split('\t').map((cell) => cell.trim() || null))

    const reportHeader = (report[0] as string[]).map((h) => camelCase(h))

    return report.slice(1).map((value) => {
      const object: any = {}

      value.forEach((el, index) => {
        object[reportHeader[index]] = el
      })

      return object
    })
  }

  /**
   * Get vendors.
   * @returns vendor ids.
   */
  async getVendors(): Promise<string[]> {
    const {
      data: {
        Vendors: { Vendor }
      }
    } = await this.request.fetch<VendorsResponse>(this.url, { type: 'Sales.getVendors' })
    return Vendor
  }
}
