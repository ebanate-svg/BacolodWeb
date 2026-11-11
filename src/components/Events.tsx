import { useEffect, useMemo, useState } from 'react'
import { type CalendarEventItem } from '../data'
import { loadCalendarEvents } from '../firebase'
import Title from './Title'

const tones = ['blue', 'orange', 'pink'] as const
const sameCalendarDate = (left: Date, right: Date) =>
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth() &&
  left.getDate() === right.getDate()
const formatTime = (date: Date) =>
  date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
const monthNames = Array.from({ length: 12 }, (_, month) =>
  new Date(2000, month, 1).toLocaleDateString('en-US', { month: 'long' }),
)

function Events() {
  const [events, setEvents] = useState<CalendarEventItem[]>([])
  const [calendarDate, setCalendarDate] = useState(() => new Date())
  const [view, setView] = useState('Week')
  const parsedEvents = useMemo(
    () =>
      events
        .map((event, index) => {
          const startAt = new Date(event.startAt)
          const endAt = new Date(event.endAt || event.startAt)
          const start = event.isAllDay ? 8 : startAt.getHours() + startAt.getMinutes() / 60
          const duration = Math.max(0.5, (endAt.getTime() - startAt.getTime()) / 3_600_000)
          return {
            ...event,
            startAt,
            endAt,
            start,
            duration,
            tone: tones[index % tones.length],
            time: event.isAllDay ? 'All day' : `${formatTime(startAt)} – ${formatTime(endAt)}`,
          }
        })
        .filter((event) => !Number.isNaN(event.startAt.getTime())),
    [events],
  )

  useEffect(() => {
    let active = true
    async function fetchEvents() {
      const result = await loadCalendarEvents([])
      if (active) {
        setEvents(result.items)
      }
    }
    void fetchEvents()
    return () => {
      active = false
    }
  }, [])

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const isSameDate = (date: Date) => sameCalendarDate(date, today)
  const weekStart = new Date(calendarDate)
  weekStart.setDate(calendarDate.getDate() - calendarDate.getDay())
  weekStart.setHours(0, 0, 0, 0)
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart)
    date.setDate(weekStart.getDate() + index)
    return date
  })
  const dayDate = new Date(calendarDate)
  const monthDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1)
  const year = calendarDate.getFullYear()
  const availableYears = useMemo(() => {
    const currentYear = new Date().getFullYear()
    const eventYears = parsedEvents.map((event) => event.startAt.getFullYear())
    const firstYear = Math.min(currentYear - 2, ...eventYears)
    const lastYear = Math.max(currentYear + 5, ...eventYears)
    return Array.from({ length: lastYear - firstYear + 1 }, (_, index) => firstYear + index)
  }, [parsedEvents])
  const hours = Array.from({ length: 9 }, (_, row) => row + 8)
  const selectView = (option: string) => setView(option)
  const moveCalendar = (direction: number) =>
    setCalendarDate((current) => {
      const next = new Date(current)
      if (view === 'Day') next.setDate(next.getDate() + direction)
      if (view === 'Week') next.setDate(next.getDate() + direction * 7)
      if (view === 'Month') next.setMonth(next.getMonth() + direction)
      return next
    })
  const goToday = () => setCalendarDate(new Date(today))
  const selectMonth = (month: number) =>
    setCalendarDate((current) => new Date(current.getFullYear(), month, 1))
  const selectYear = (selectedYear: number) =>
    setCalendarDate((current) => new Date(selectedYear, current.getMonth(), 1))
  const monthLeading = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1).getDay()
  const monthDays = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate()
  const monthCells = Array.from({ length: 42 }, (_, index) => index - monthLeading + 1)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 7)
  const dayEvents = parsedEvents.filter((event) => sameCalendarDate(event.startAt, calendarDate))
  const weekEvents = parsedEvents.filter(
    (event) => event.startAt >= weekStart && event.startAt < weekEnd,
  )
  const monthEvents = parsedEvents.filter(
    (event) =>
      event.startAt.getFullYear() === calendarDate.getFullYear() &&
      event.startAt.getMonth() === calendarDate.getMonth(),
  )
  return (
    <section className="events-section page-width font-sans text-brand-ink" id="upcoming-events">
      <Title
        title="Upcoming Events"
        description="Stay updated with the latest happenings and activities around Bacolod."
      />
      <div className="weekly-calendar overflow-hidden rounded-2xl bg-white">
        <div className="week-toolbar grid items-center">
          <div className="week-navigation flex items-center">
            <button aria-label={`Previous ${view.toLowerCase()}`} onClick={() => moveCalendar(-1)}>
              ‹
            </button>
            <button className="today-button" onClick={goToday}>
              Today
            </button>
            <button aria-label={`Next ${view.toLowerCase()}`} onClick={() => moveCalendar(1)}>
              ›
            </button>
          </div>
          <div
            className="calendar-views flex items-center justify-center"
            aria-label="Calendar view"
          >
            {['Day', 'Week', 'Month'].map((option) => (
              <button
                key={option}
                className={view === option ? 'active' : ''}
                onClick={() => selectView(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="calendar-date-selectors" aria-label="Choose calendar month and year">
            <select
              value={calendarDate.getMonth()}
              onChange={(event) => selectMonth(Number(event.target.value))}
              aria-label="Month"
            >
              {monthNames.map((month, index) => (
                <option value={index} key={month}>
                  {month}
                </option>
              ))}
            </select>
            <select
              value={year}
              onChange={(event) => selectYear(Number(event.target.value))}
              aria-label="Year"
            >
              {availableYears.map((option) => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
        {view === 'Week' && (
          <div className="week-scroll overflow-auto">
            <div className="week-grid grid">
              <div className="week-corner" />
              {days.map((day) => (
                <div
                  className={`week-day ${isSameDate(day) ? 'is-today' : ''}`}
                  key={day.toISOString()}
                >
                  <small>
                    {day.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
                  </small>
                  <strong>{day.getDate()}</strong>
                </div>
              ))}
              {hours.map((hour, row) => (
                <div className="week-row" style={{ gridRow: `${row * 2 + 2} / span 2` }} key={hour}>
                  <span>
                    {hour > 12 ? hour - 12 : hour}
                    {hour >= 12 ? 'pm' : 'am'}
                  </span>
                </div>
              ))}
              {weekEvents
                .filter((event) => event.start >= 8 && event.start < 17)
                .map((event) => (
                  <div
                    key={event.id}
                    className={`week-event ${event.tone}`}
                    style={{
                      gridColumn: event.startAt.getDay() + 2,
                      gridRow: `${Math.round((event.start - 8) * 2) + 2} / span ${Math.max(1, Math.round(event.duration * 2))}`,
                    }}
                  >
                    <small>{event.time}</small>
                    <b>{event.title}</b>
                  </div>
                ))}
            </div>
          </div>
        )}
        {view === 'Day' && (
          <div className={`day-view ${isSameDate(dayDate) ? 'is-today' : ''}`}>
            {hours.map((hour) => (
              <div className="day-hour" key={hour}>
                <span>
                  {hour > 12 ? hour - 12 : hour}
                  {hour >= 12 ? 'pm' : 'am'}
                </span>
                <div>
                  {dayEvents
                    .filter((event) => Math.floor(event.start) === hour)
                    .map((event) => (
                      <article className={`calendar-list-event ${event.tone}`} key={event.id}>
                        <small>{event.time}</small>
                        <b>{event.title}</b>
                      </article>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {view === 'Month' && (
          <div className="month-view overflow-hidden">
            <div className="month-weekdays grid grid-cols-7 text-center">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <b key={day}>{day}</b>
              ))}
            </div>
            <div className="month-grid-view grid grid-cols-7">
              {monthCells.map((date, index) => {
                const cellDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), date)
                return (
                  <div
                    className={`${date < 1 || date > monthDays ? 'outside ' : ''}${date > 0 && date <= monthDays && isSameDate(cellDate) ? 'is-today' : ''}`}
                    key={index}
                  >
                    <span>{date > 0 && date <= monthDays ? date : ''}</span>
                    {monthEvents
                      .filter((event) => event.startAt.getDate() === date)
                      .slice(0, 2)
                      .map((event) => (
                        <small className={event.tone} key={event.id}>
                          {event.title}
                        </small>
                      ))}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Events
