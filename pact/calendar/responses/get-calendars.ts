import { Calendar } from '@app/services/calendar/calendar.model';
import { Matchers } from '@pact-foundation/pact';
const { like, eachLike, iso8601Date } = Matchers;

export const getCalendersBody: Calendar[] = [
  {
    reference: 'calendar-1',
    startDate: '2020-10-01',
    endDate: '2020-12-12',
    active: true,
    description: 'test calendar',
  },
];

export const getCalendersMatcher = eachLike({
  reference: like('calendar-1'),
  startDate: iso8601Date('2020-10-01'),
  endDate: iso8601Date('2020-12-12'),
  active: like(true),
  description: like('test calendar'),
});
