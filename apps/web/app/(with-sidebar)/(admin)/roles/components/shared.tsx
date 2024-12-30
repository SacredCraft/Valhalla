import { Control } from 'react-hook-form'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@valhalla/design-system/components/ui/form'
import { Label } from '@valhalla/design-system/components/ui/label'
import {
  RadioGroup,
  RadioGroupItem,
} from '@valhalla/design-system/components/ui/radio-group'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const RoleItem = ({ control }: { control: Control<any> }) => {
  return (
    <FormField
      control={control}
      name="role"
      render={({ field }) => (
        <FormItem>
          <FormLabel>角色</FormLabel>
          <FormControl>
            <RadioGroup
              className="gap-2"
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <div className="relative flex w-full items-start gap-2 rounded-lg border border-input p-4 shadow-sm shadow-black/5 has-[[data-state=checked]]:border-ring">
                <RadioGroupItem
                  value="admin"
                  className="order-1 after:absolute after:inset-0"
                />
                <div className="grid grow gap-2">
                  <Label htmlFor="radio-08-r1">
                    管理员{' '}
                    <span className="text-xs font-normal leading-[inherit] text-muted-foreground">
                      (站点)
                    </span>
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    将授予该用户整个平台的管理员身份
                  </p>
                </div>
              </div>

              <div className="relative flex w-full items-start gap-2 rounded-lg border border-input p-4 shadow-sm shadow-black/5 has-[[data-state=checked]]:border-ring">
                <RadioGroupItem
                  value="user"
                  className="order-1 after:absolute after:inset-0"
                />
                <div className="grid grow gap-2">
                  <Label htmlFor="radio-08-r2">
                    用户{' '}
                    <span className="text-xs font-normal leading-[inherit] text-muted-foreground">
                      (站点)
                    </span>
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    将授予该用户普通用户权限
                  </p>
                </div>
              </div>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
