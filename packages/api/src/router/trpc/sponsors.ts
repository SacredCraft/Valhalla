import { z } from 'zod'

import { createRouter, publicProcedure } from '../../trpc'

const sponsorsSchema = z.array(
  z.object({
    name: z.string(),
    url: z.string(),
  })
)

export const sponsorsRouter = createRouter({
  getSponsors: publicProcedure.output(sponsorsSchema).query(() => {
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
    return sponsors
  }),
})
