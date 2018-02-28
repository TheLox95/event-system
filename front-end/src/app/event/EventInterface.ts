import LocationInterface from './LocationInterface';

export interface EventInterface {
    category_id: string;
    event_name: string;
    user_id: string;
    description: string;
    image: string;
    start_date: string;
    end_date: string;
    modified: string;
    start_time: string;
    end_time: string;
    location: LocationInterface;
    count: number;
    aproved: boolean;
}
