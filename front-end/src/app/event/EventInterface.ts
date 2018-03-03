import { Invitation } from './invitation';
import LocationInterface from './LocationInterface';
import Category from './CategoryInterface';

export interface EventInterface {
    _id: number;
    category_id: string;
    category: Category;
    event_name: string;
    user_id: string;
    description: string;
    image: string | File;
    start_timestamp: string;
    modified: string;
    end_timestamp: string;
    location: LocationInterface;
    count: number;
    aproved: boolean;
    invitations: Invitation[];
}
