import { z } from 'zod'

import { pub } from '../orpc'

const sponsorsSchema = z.array(
  z.object({
    name: z.string(),
    url: z.string(),
  })
)

const sponsors = [
  {
    name: 'Google',
    url: 'https://google.com',
  },
  {
    name: 'Vercel',
    url: 'https://vercel.com',
  },
  {
    name: 'Tencent',
    url: 'https://tencent.com',
  },
  {
    name: 'Alibaba',
    url: 'https://alibaba.com',
  },
  {
    name: 'Stripe',
    url: 'https://stripe.com',
  },
  {
    name: 'Meta',
    url: 'https://meta.com',
  },
  {
    name: 'Amazon',
    url: 'https://amazon.com',
  },
  {
    name: 'Apple',
    url: 'https://apple.com',
  },
]

export const getSponsors = pub
  .route({
    method: 'GET',
    path: '/',
    summary: '获取赞助商列表',
  })
  .output(sponsorsSchema)
  .handler(() => {
    return sponsors
  })

export const sponsorsRouter = pub.tags('Sponsors').prefix('/sponsors').router({
  getSponsors,
})
