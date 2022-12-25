export const generateSearchParams = (
  data: Record<string, string | undefined>,
): string => {
  Object.keys(data).forEach(key => {
    if (data[key] === undefined || data[key]?.toString().trim() === '')
      delete data[key]
  })
  return new URLSearchParams(data as Record<string, string>).toString()
}
