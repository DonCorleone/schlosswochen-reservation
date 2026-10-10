export interface EventOption {
  id: number;
  title: string;
  dateRange: string;
  description: string;
  places: number;
  demand: string;
  image: string;
  month: 'July' | 'August';
  activity: 'alpine' | 'lakeside';
}

export const EVENTS: EventOption[] = [
  {
    id: 1,
    title: 'Alpine Adventure — Week 1',
    dateRange: '5 July – 9 July 2027',
    description: 'Mountain trails, fresh air & new friendships',
    places: 24,
    demand: 'High demand',
    image: 'images/alpine-week.png',
    month: 'July',
    activity: 'alpine',
  },
  {
    id: 2,
    title: 'Alpine Adventure — Week 2',
    dateRange: '12 July – 16 July 2027',
    description: 'Mountain trails, fresh air & new friendships',
    places: 24,
    demand: 'High demand',
    image: 'images/alpine-week.png',
    month: 'July',
    activity: 'alpine',
  },
  {
    id: 3,
    title: 'Alpine Adventure — Week 3',
    dateRange: '19 July – 23 July 2027',
    description: 'Mountain trails, fresh air & new friendships',
    places: 24,
    demand: 'High demand',
    image: 'images/alpine-week.png',
    month: 'July',
    activity: 'alpine',
  },
  {
    id: 4,
    title: 'Lakeside Camp',
    dateRange: '2 August – 6 August 2027',
    description: 'Lakeside cabins, kayaking & slow summer days',
    places: 18,
    demand: 'High demand',
    image: 'images/lakeside-camp.png',
    month: 'August',
    activity: 'lakeside',
  },
];
