export const asset = (name: string) => `${import.meta.env.BASE_URL}images/${name}`

export const formatNewsDate = (value: string) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }).format(
        date,
      )
}
