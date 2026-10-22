import { useState } from 'react'
import Title from './Title'

const calendarEvents = [
  { day: 1, date: 22, start: 8, duration: 1, title: 'MassKara Festival 2025', tone: 'blue' },
  {
    day: 3,
    date: 24,
    start: 10.5,
    duration: 1,
    time: '11:00 - 12:00',
    title: 'Bacolod Food & Flavors Expo',
    tone: 'blue',
  },
  {
    day: 5,
    date: 26,
    start: 13.5,
    duration: 1,
    time: '2:00 - 3:00',
    title: 'Sunset Beats by the Bay',
    tone: 'orange',
  },
  {
    day: 2,
    date: 23,
    start: 15.5,
    duration: 1,
    time: '4:00 - 5:00',
    title: 'Panaad sa Negros Festival',
    tone: 'pink',
  },
  {
    day: 5,
    date: 26,
    start: 15.5,
    duration: 1,
    time: '4:00 - 5:00',
    title: 'Sounds of the City: Bacolod',
    tone: 'pink',
  },
]

function Events() {
  const [calendarDate, setCalendarDate] = useState(() => new Date(2025, 8, 21))
  const [view, setView] = useState('Week')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const isSameDate = (date: Date) =>
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
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
  const isEventMonth = calendarDate.getFullYear() === 2025 && calendarDate.getMonth() === 8
  const dayEvents = isEventMonth
    ? calendarEvents.filter((event) => event.date === calendarDate.getDate())
    : []
  const isEventWeek =
    weekStart.getFullYear() === 2025 && weekStart.getMonth() === 8 && weekStart.getDate() === 21
  return (
    <section className="events-section page-width">
      <Title
        title="Upcoming Events"
        description="Stay updated with the latest happenings and activities around Bacolod."
      />
      <div className="weekly-calendar">
        <div className="week-toolbar">
          <div className="week-navigation">
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
          <div className="calendar-views" aria-label="Calendar view">
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
          <div className="week-scroll">
            <div className="week-grid">
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
              {isEventWeek &&
                calendarEvents.map((event) => (
                  <div
                    key={`${event.day}-${event.title}`}
                    className={`week-event ${event.tone}`}
                    style={{
                      gridColumn: event.day + 2,
                      gridRow: `${Math.round((event.start - 8) * 2) + 2} / span ${event.duration * 2}`,
                    }}
                  >
                    {event.time && <small>{event.time}</small>}
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
                      <article className={`calendar-list-event ${event.tone}`} key={event.title}>
                        <small>{event.time || `${hour}:00`}</small>
                        <b>{event.title}</b>
                      </article>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {view === 'Month' && (
          <div className="month-view">
            <div className="month-weekdays">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <b key={day}>{day}</b>
              ))}
            </div>
            <div className="month-grid-view">
              {monthCells.map((date, index) => {
                const cellDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), date)
                return (
                  <div
                    className={`${date < 1 || date > monthDays ? 'outside ' : ''}${date > 0 && date <= monthDays && isSameDate(cellDate) ? 'is-today' : ''}`}
                    key={index}
                  >
                    <span>{date > 0 && date <= monthDays ? date : ''}</span>
                    {isEventMonth &&
                      calendarEvents
                        .filter((event) => event.date === date)
                        .slice(0, 2)
                        .map((event) => (
                          <small className={event.tone} key={event.title}>
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
          <div className="year-view">
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
                    const hasEvent =
                      year === 2025 &&
                      month === 8 &&
                      calendarEvents.some((event) => event.date === date)
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
