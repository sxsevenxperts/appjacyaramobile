import { useState, useCallback, useEffect } from 'react'
import { supabase } from '../services/supabaseClient'

interface UseDataOptions {
  autoFetch?: boolean
  onError?: (error: any) => void
}

export const useData = <T,>(
  table: string,
  query?: (query: any) => any,
  options: UseDataOptions = { autoFetch: true }
) => {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      let q = supabase.from(table).select('*')

      if (query) {
        q = query(q)
      }

      const { data: result, error: err } = await q

      if (err) throw err
      setData(result || [])
    } catch (err) {
      setError(err)
      options.onError?.(err)
    } finally {
      setLoading(false)
    }
  }, [table, query, options])

  useEffect(() => {
    if (options.autoFetch) {
      fetchData()
    }
  }, [fetchData, options.autoFetch])

  const refetch = useCallback(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch }
}

export const useInsert = <T,>(table: string) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any>(null)

  const insert = useCallback(
    async (values: T) => {
      try {
        setLoading(true)
        setError(null)

        const { data, error: err } = await supabase
          .from(table)
          .insert([values])
          .select()

        if (err) throw err
        return data
      } catch (err) {
        setError(err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [table]
  )

  return { insert, loading, error }
}

export const useUpdate = <T,>(table: string) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any>(null)

  const update = useCallback(
    async (id: number, values: Partial<T>) => {
      try {
        setLoading(true)
        setError(null)

        const { data, error: err } = await supabase
          .from(table)
          .update(values)
          .eq('id', id)
          .select()

        if (err) throw err
        return data
      } catch (err) {
        setError(err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [table]
  )

  return { update, loading, error }
}

export const useDelete = (table: string) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any>(null)

  const deleteRecord = useCallback(
    async (id: number) => {
      try {
        setLoading(true)
        setError(null)

        const { error: err } = await supabase.from(table).delete().eq('id', id)

        if (err) throw err
        return true
      } catch (err) {
        setError(err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [table]
  )

  return { deleteRecord, loading, error }
}
