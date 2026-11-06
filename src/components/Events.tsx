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
        const nextEvent = result.items.find(
          (event) => new Date(event.endAt).getTime() >= Date.now(),
        )
        if (result.isLive && (nextEvent || result.items[0])) {
          setCalendarDate(new Date((nextEvent || result.items[0]).startAt))
        }
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
  const range =
    view === 'Day'
      ? dayDate.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : view === 'Month'
        ? monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : view === 'Year'
          ? String(year)
          : `${days[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${days[6].toLocaleDateString('en-US', { day: 'numeric', year: 'numeric' })}`
  const hours = Array.from({ length: 9 }, (_, row) => row + 8)
  const selectView = (option: string) => setView(option)
  const moveCalendar = (direction: number) =>
    setCalendarDate((current) => {
      const next = new Date(current)
      if (view === 'Day') next.setDate(next.getDate() + direction)
      if (view === 'Week') next.setDate(next.getDate() + direction * 7)
      if (view === 'Month') next.setMonth(next.getMonth() + direction)
      if (view === 'Year') next.setFullYear(next.getFullYear() + direction)
      return next
    })
  const goToday = () => setCalendarDate(new Date(today))
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
    <section className="events-section page-width font-sans text-brand-ink">
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
            {['Day', 'Week', 'Month', 'Year'].map((option) => (
              <button
                key={option}
                className={view === option ? 'active' : ''}
                onClick={() => selectView(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <b>{range}</b>
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
        {view === 'Year' && (
          <div className="year-view grid">
            {Array.from({ length: 12 }, (_, month) => (
              <div className="mini-month" key={month}>
                <b>{new Date(year, month, 1).toLocaleDateString('en-US', { month: 'long' })}</b>
                <div>
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                    <small key={`${day}-${index}`}>{day}</small>
                  ))}
                  {Array.from({ length: new Date(year, month, 1).getDay() }, (_, index) => (
                    <i key={`blank-${index}`} />
                  ))}
                  {Array.from({ length: new Date(year, month + 1, 0).getDate() }, (_, index) => {
                    const date = index + 1
                    const isToday =
                      year === today.getFullYear() &&
                      month === today.getMonth() &&
                      date === today.getDate()
                    const hasEvent = parsedEvents.some(
                      (event) =>
                        event.startAt.getFullYear() === year &&
                        event.startAt.getMonth() === month &&
                        event.startAt.getDate() === date,
                    )
                    return (
                      <span
                        className={`${hasEvent ? 'has-event ' : ''}${isToday ? 'is-today' : ''}`}
                        key={index}
                      >
                        {date}
                      </span>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Events
