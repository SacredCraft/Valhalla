import { Resource } from '@valhalla/core/schema/resource'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@valhalla/design-system/components/ui/card'
import { Skeleton } from '@valhalla/design-system/components/ui/skeleton'

type ResourcesItemProps = Resource

export const ResourcesGridItem = ({
  name,
  description,
  label,
}: ResourcesItemProps) => {
  return (
    <Card className="flex h-[112px] flex-col rounded-md border p-0">
      <CardHeader className="p-4 pb-2">
        <CardTitle>{label}</CardTitle>
        <CardDescription>{name}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

export const ResourcesGridItemSkeleton = () => {
  return <Skeleton className="h-[112px] w-full" />
}

export const ResourcesListItem = ({
  name,
  description,
  label,
}: ResourcesItemProps) => {
  return (
    <Card className="flex flex-col gap-1 rounded-md border p-0">
      <CardHeader className="flex-row items-center gap-4 space-y-0 p-3 pb-0">
        <CardTitle>{label}</CardTitle>
        <CardDescription>{name}</CardDescription>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

export const ResourcesListItemSkeleton = () => {
  return <Skeleton className="h-[70px]" />
}
