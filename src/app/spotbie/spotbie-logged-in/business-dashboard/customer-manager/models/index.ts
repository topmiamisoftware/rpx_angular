import {User} from '../../../../../models/user';

export interface RecentGuest {
  dollar_value_sum;
  balance: number;
  user: User & { total_spent_sum: number };
  updated_at: string;
}

export interface SmsGroup {
  body: string;
  user_list?: User[];
  created_at: string;
  total: number;
  total_sent: number;
}
