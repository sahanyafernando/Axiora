// Simple wrapper for multiple SWR calls - can be extended later
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function useSWRMultiple(urls: string[]) {
  const results = urls.map(url => useSWR(url, fetcher))
  return results
}
