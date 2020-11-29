import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { parseStringPromise } from 'xml2js'
import zlib from 'zlib'
import streamToPromise from 'stream-to-promise'
import { ReporterAuthentication, ReporterConfig } from './interfaces'

export default class RequestManager {
  private instance: AxiosInstance
  private options: RequestManagerOptions

  constructor(options: RequestManagerOptions) {
    this.options = options
    this.instance = axios.create({
      baseURL: options.config.baseUrl,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      }
    })

    this.instance.interceptors.response.use(async (response) => {
      if (response.headers['content-encoding'] === 'agzip') {
        response.data = (await streamToPromise(response.data.pipe(zlib.createGunzip()))).toString('utf8')
      } else {
        response.data = await parseStringPromise(response.data)
      }
      return response
    })
  }

  fetch<T>(path: string, fields: RequestManagerFetchFields, isProperty: boolean = true): Promise<AxiosResponse<T>> {
    return this.instance.post(`${path}?jsonRequest=${this.prepareFetch(fields, isProperty)}`)
  }

  stream<T>(path: string, fields: RequestManagerFetchFields, isProperty: boolean = true): Promise<AxiosResponse<T>> {
    return this.instance.post(`${path}?jsonRequest=${this.prepareFetch(fields, isProperty)}`, null, {
      responseType: 'stream'
    })
  }

  private prepareFetch({ type, params }: RequestManagerFetchFields, isProperty: boolean): string {
    const { auth, config } = this.options
    const propertyKey = isProperty ? `p=Reporter.properties` : null
    const fields = [propertyKey, type, params].filter((l) => !!l).join(', ')
    const payload = {
      accesstoken: auth.accessToken,
      mode: config.mode,
      version: config.version,
      queryInput: `[${fields}]`
    }
    return JSON.stringify(payload)
  }
}

export interface RequestManagerOptions {
  auth: ReporterAuthentication
  config: ReporterConfig
}

export interface RequestManagerDefaultParams {
  userid: string
  version: string
  mode: string
  queryInput: string
}

export interface RequestManagerFetchFields {
  type: string
  params?: string
}
