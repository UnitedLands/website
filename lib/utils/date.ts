import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'
import isBetween from 'dayjs/plugin/isBetween'

const date = dayjs
date.extend(relativeTime)
date.extend(duration)
date.extend(isBetween)

export default date
