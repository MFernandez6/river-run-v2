export type BoardMember = {
  id: string;
  name: string;
  position: string;
  email: string;
  phone?: string | null;
  photoUrl?: string | null;
  createdAt: string;
};

export type Announcement = {
  id: string;
  title: string;
  content: string;
  dateLabel: string;
  type: string;
  createdAt: string;
};

