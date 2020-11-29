import SalesReporter from './sales'
import FinanceReporter from './finance'
import { ReporterConfig, ReporterAuthentication } from './interfaces'

export default class Reporter {
  private config: ReporterConfig = {
    baseUrl: 'https://reportingitc-reporter.apple.com/reportservice',
    mode: 'Robot.XML',
    version: '1.0'
  }
  public sales: SalesReporter
  public finances: FinanceReporter

  constructor(auth: ReporterAuthentication) {
    const params = { auth, config: this.config }
    this.sales = new SalesReporter(params)
    this.finances = new FinanceReporter(params)
  }
}
