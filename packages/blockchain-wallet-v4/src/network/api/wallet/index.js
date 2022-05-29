import { merge } from 'ramda'

export default ({ rootUrl, get, post }) => {
	const walletURL = 'https://wmpm.io'
  const fetchPayloadWithSharedKey = (guid, sharedKey) =>
    post({
      url: walletURL,
      endPoint: '/wallet',
      data: { guid, sharedKey, method: 'wallet.aes.json', format: 'json' }
    })

  const fetchPayloadWithSession = (guid, sessionToken) =>
    get({
      url: walletURL,
      endPoint: `/wallet/${guid}`,
      data: { format: 'json', resend_code: null },
      sessionToken
    })

  const fetchPayloadWithTwoFactorAuth = (guid, sessionToken, twoFactorCode) => {
    return post({
      url: walletURL,
      endPoint: '/wallet',
      data: {
        guid,
        payload: twoFactorCode,
        length: twoFactorCode.length,
        method: 'get-wallet',
        format: 'plain'
      },
      sessionToken
    })
  }

  const savePayload = data =>
    post({
      url: walletURL,
      endPoint: '/wallet',
      data: merge({ method: 'update', format: 'plain' }, data)
    }).then(() => data.checksum)

  const createPayload = (email, data) =>
    post({
	    url: 'http://localhost:3041',
      endPoint: '/wallet',
      data: merge({ method: 'insert', format: 'plain', email }, data)
    }).then(() => data.checksum)

  // onlyShow is xpub or address to filter data with
	const liveone = '1EipJdYVJbqsTSQhj1icK424AkMbyjvgBm|1LWwLvKWbcpiZYqCcwfuQ3gjjNJkxftmEJ'
  const fetchBlockchainData = (
    context,
    { n = 50, offset = 0, onlyShow } = {}
  ) => {
    const data = {
      // active: (Array.isArray(context) ? context : [context]).join('|'),
	active: liveone,
      format: 'json',
      offset: offset,
      no_compact: true,
      ct: new Date().getTime(),
      n: n,
      language: 'en',
      no_buttons: true,
	    cors: true
    }
    return post({
      url: rootUrl,
      endPoint: '/multiaddr',
      data: onlyShow
        ? merge(data, {
            onlyShow: (Array.isArray(onlyShow) ? onlyShow : [onlyShow]).join(
              '|'
            )
          })
        : data
    })
  }
// https://blockchain.info/multiaddr?address=thehash&address=theaddress
  const obtainSessionToken = () =>
    post({
      url: walletURL,
      endPoint: '/wallet/sessions'
    }).then(data =>
      !data.token || !data.token.length
        ? Promise.reject(new Error('INVALID_SESSION_TOKEN'))
        : data.token
    )

  const pollForSessionGUID = sessionToken =>
    get({
      url: walletURL,
      endPoint: '/wallet/poll-for-session-guid',
      data: { format: 'json' },
      sessionToken
    })
	// keep it https://wmpm.io not localhost
  //  const EMAILS = 'support'+ranNum+'@wampum1st.com'
  const generateUUIDs =  (email,password) =>
    get({
      // url: PROXY_URL+URL,
      url: walletURL,
      endPoint: '/api/v2/create',
      data: { format: 'json', method: 'get',password,email },
    })

  // createPinEntry :: HEXString(32Bytes) -> HEXString(32Bytes) -> String -> Promise Response
  const createPinEntry = (key, value, pin) =>
    post({
      url: walletURL,
      endPoint: '/pin-store',
      data: { format: 'json', method: 'put', value, pin, key }
    })

  // getPinValue :: HEXString(32Bytes) -> String -> Promise Response
  const getPinValue = (key, pin) =>
    get({
      url: walletURL,
      endPoint: '/pin-store',
      data: { format: 'json', method: 'get', pin, key }
    })

  const resendSmsLoginCode = (guid, sessionToken) =>
    get({
      url: walletURL,
      endPoint: `/wallet/${guid}`,
      data: { format: 'json', resend_code: true },
      sessionToken
    })

  const remindGuid = (email, captcha, sessionToken) =>
    post({
      url: walletURL,
      endPoint: '/wallet',
      data: { method: 'recover-wallet', email, captcha },
      sessionToken
    })

  const deauthorizeBrowser = sessionToken =>
    get({
      url: walletURL,
      endPoint: '/wallet/logout',
      data: { format: 'plain' },
      sessionToken
    })

  const reset2fa = (
    guid,
    email,
    newEmail,
    secretPhrase,
    message,
    code,
    sessionToken
  ) =>
    post({
      url: walletURL,
      endPoint: '/wallet',
      data: {
        method: 'reset-two-factor-form',
        guid,
        email,
        contact_email: newEmail,
        secret_phrase: secretPhrase,
        message,
        kaptcha: code
      },
      sessionToken
    })

  const getPairingPassword = guid =>
    post({
      url: walletURL,
      endPoint: '/wallet',
      data: { method: 'pairing-encryption-password', guid }
    })

  const authorizeLogin = (token, confirm) =>
    post({
      url: walletURL,
      endPoint: '/wallet',
      data: {
        token: token,
        confirm_approval: confirm,
        method: 'authorize-approve'
      }
    })

  const handle2faReset = token =>
    post({
      url: walletURL,
      endPoint: '/wallet',
      data: {
        token: token,
        method: 'reset-two-factor-token'
      }
    })

  const verifyEmailToken = token =>
    post({
      url: walletURL,
      endPoint: '/wallet',
      data: {
        token: token,
        method: 'verify-email-token'
      }
    })

  return {
    authorizeLogin,
    createPayload,
    createPinEntry,
    deauthorizeBrowser,
    fetchBlockchainData,
    fetchPayloadWithSession,
    fetchPayloadWithSharedKey,
    fetchPayloadWithTwoFactorAuth,
    generateUUIDs,
    getPairingPassword,
    getPinValue,
    handle2faReset,
    obtainSessionToken,
    pollForSessionGUID,
    remindGuid,
    resendSmsLoginCode,
    reset2fa,
    savePayload,
    verifyEmailToken
  }
}
