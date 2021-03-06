import { EventInterface } from './EventInterface';
import User from '../user/User';
export class Invitation {
  constructor(public user: User, public event: EventInterface, public is_going: IsGoingState, public _id?: string) {}
}

export enum IsGoingState {
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  UNRESPONDED = 'unresponded',
}
