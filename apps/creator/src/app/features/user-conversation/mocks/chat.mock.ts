export interface ChatMessage {
  id: string;
  text: string;
  time: string;
  timestamp: Date; // Agregamos timestamp para manejar las fechas
  sent: boolean;
  userId: string;
}

export interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  lastSeen: string;
}

export const mockUser: ChatUser = {
  id: '1',
  name: 'Danny Hopkins',
  avatar: 'assets/avatars/user1.png',
  lastSeen: '1 FEB 12:00',
};

export const mockMessages: ChatMessage[] = [
  {
    id: '1',
    text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    time: '12:00',
    timestamp: new Date('2025-09-01T12:00:00'),
    sent: false,
    userId: '2',
  },
  {
    id: '2',
    text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    time: '12:01',
    timestamp: new Date('2025-09-01T12:01:00'),
    sent: true,
    userId: '1',
  },
  {
    id: '3',
    text: 'Lorem Ipsum.',
    time: '12:02',
    timestamp: new Date('2025-09-04T12:02:00'),
    sent: false,
    userId: '2',
  },
  {
    id: '4',
    text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    time: '08:12',
    timestamp: new Date('2025-09-05T08:12:00'),
    sent: true,
    userId: '1',
  },
];
