import { Extension, onAuthenticatePayload } from '@hocuspocus/server'
import ky from 'ky'

import { getBaseUrl } from '@valhalla/utils/url'

export class ValhallaAuth implements Extension {
  async onAuthenticate({ documentName, token }: onAuthenticatePayload) {
    const user = await ky
      .post(`${getBaseUrl()}/api/collaboration/auth`, {
        json: {
          documentName,
        },
        headers: {
          cookie: token,
        },
      })
      .text()
      .catch(() => {
        return null
      })

    if (!user) {
      throw new Error('Unauthorized')
    }

    return {}
  }
}
