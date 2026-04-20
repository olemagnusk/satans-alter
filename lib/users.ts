export type User = {
  email: string;
  password: string;
  nickname: string;
};

export const USERS: User[] = [
  { email: "andreas.muller.nilssen@gmail.com", password: "Pilsen666", nickname: "Pilsen" },
  { email: "denskaher@gmail.com", password: "Djen666", nickname: "Djen" },
  { email: "olemagnusk@gmail.com", password: "Krem666", nickname: "Krem" },
];

export function findUserByEmail(email: string): User | undefined {
  const normalized = email.trim().toLowerCase();
  return USERS.find((u) => u.email.toLowerCase() === normalized);
}
