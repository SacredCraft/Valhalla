import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Control, useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@valhalla/design-system/components/ui/button'
import { Calendar } from '@valhalla/design-system/components/ui/calendar'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@valhalla/design-system/components/ui/form'
import { Input } from '@valhalla/design-system/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@valhalla/design-system/components/ui/popover'
import { cn } from '@valhalla/design-system/utils/cn'

export const banFormSchema = z.object({
  reason: z.string().optional(),
  expiresAt: z.date().optional(),
})

export const BanFormReason = ({
  control,
}: {
  control: Control<z.infer<typeof banFormSchema>>
}) => {
  return (
    <FormField
      control={control}
      name="reason"
      render={({ field }) => (
        <FormItem>
          <FormLabel>封禁原因</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
        </FormItem>
      )}
    />
  )
}

export const BanFormExpiresAt = ({
  control,
}: {
  control: Control<z.infer<typeof banFormSchema>>
}) => {
  return (
    <FormField
      control={control}
      name="expiresAt"
      render={({ field }) => (
        <FormItem>
          <FormLabel>封禁时间</FormLabel>
          <FormControl>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'flex w-full justify-start text-left font-normal',
                    !field.value && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 size-4" />
                  {field.value ? (
                    format(field.value, 'PPP', { locale: zhCN })
                  ) : (
                    <span>选择封禁时间</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </FormControl>
        </FormItem>
      )}
    />
  )
}

export const BanFormSubmit = ({ isPending }: { isPending: boolean }) => {
  return (
    <Button type="submit" disabled={isPending}>
      {isPending ? '封禁中...' : '封禁'}
    </Button>
  )
}

export const BanForm = ({
  children,
  handleBanSelected,
  setOpen,
}: {
  children: React.ReactNode
  handleBanSelected: (
    reason?: string,
    expiresAt?: Date,
    options?: {
      onSuccess?: () => void
      onError?: (error: Error) => void
    }
  ) => void
  setOpen: (open: boolean) => void
}) => {
  const form = useForm<z.infer<typeof banFormSchema>>({
    resolver: zodResolver(banFormSchema),
    defaultValues: {
      reason: '',
      expiresAt: new Date(),
    },
  })

  const onSubmit = (values: z.infer<typeof banFormSchema>) => {
    handleBanSelected(values.reason, values.expiresAt, {
      onSuccess: () => {
        setOpen(false)
        form.reset()
      },
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2"
      >
        <BanFormReason control={form.control} />
        <BanFormExpiresAt control={form.control} />
        {children}
      </form>
    </Form>
  )
}
