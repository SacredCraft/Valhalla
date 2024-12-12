export default async function ResourcesPage({
  params,
}: {
  params: Promise<{ menu: string }>
}) {
  const menu = (await params).menu

  return <></>
}
