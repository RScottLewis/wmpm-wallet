import { toUpper } from 'ramda'

export default ({ rootUrl, apiUrl, get, post }) => {
  const getBtcTicker = () =>
    get({
      url: apiUrl,
      endPoint: '/ticker',
      data: { base: 'BTC',
              cors: 'true'
      }
    })

  const getBtcUnspents = (fromAddresses, confirmations = 0) =>
    post({
      url: rootUrl,
      endPoint: '/unspent',
      data: {
        active: fromAddresses.join('|'),
        confirmations: Math.max(confirmations, -1),
        format: 'json',
        cors: 'true'
      }
    })

  const getBtcFee = () =>
    get({
      url: apiUrl,
      endPoint: '/mempool/fees'
    })

  const pushBtcTx = txHex =>
    post({
      url: rootUrl,
      endPoint: '/pushtx',
      data: { tx: txHex, format: 'plain' }
    })

  const getBtcFiatAtTime = (amount, currency, time) =>
    get({
      url: apiUrl,
      endPoint: '/frombtc',
      data: {
        value: amount,
        currency: toUpper(currency),
        time,
        textual: false,
        nosavecurrency: true
      }
    })

  const getLatestBlock = () =>
    get({
      url: rootUrl,
      endPoint: '/latestblock' + '&cors=true'
    })

  const getRawTx = txHex =>
    get({
      url: rootUrl,
      endPoint: '/rawtx/' + txHex,
      data: {
        format: 'hex',
        cors: 'true'
      }
    })

  const getBalances = addresses =>
    post({
      url: rootUrl,
      endPoint: '/balance',
      data: {
        active: addresses.join('|'),
        format: 'json',
        cors: 'true'
      }
    })

  return {
    getBtcTicker,
    getBtcUnspents,
    getBtcFee,
    pushBtcTx,
    getBtcFiatAtTime,
    getLatestBlock,
    getRawTx,
    getBalances
  }
}
