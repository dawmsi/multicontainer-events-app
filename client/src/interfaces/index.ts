export interface Participant {
  id: string;
  fullName: string;
  email: string;
}

export interface EventItem {
  id?: string;
  title: string;
  description: string;
  organizer?: string;
  eventDate?: string;
  participants?: Participant[];
  participantsCount?: number;
}

export interface User {
  id?: string;
  fullName: string;
  email: string;
  hearFrom: string;
  dateOfBirth?: string;
}
