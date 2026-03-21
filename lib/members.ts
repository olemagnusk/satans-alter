export type Member = {
  dbName: string;
  nickname: string;
  initial: string;
};

export const MEMBERS: Member[] = [
  { dbName: "Andreas", nickname: "Pilsen", initial: "P" },
  { dbName: "Dennis", nickname: "Djen", initial: "D" },
  { dbName: "Magnus", nickname: "Krem", initial: "K" },
];

export const MEMBER_NICKNAMES = MEMBERS.map((m) => m.nickname);

const ALIASES: Record<string, string> = {
  Pils: "Pilsen",
};

export function displayName(dbName: string): string {
  if (ALIASES[dbName]) return ALIASES[dbName];
  const member = MEMBERS.find((m) => m.dbName === dbName);
  return member ? member.nickname : dbName;
}

export function toDbName(nickname: string): string {
  const member = MEMBERS.find((m) => m.nickname === nickname);
  return member ? member.dbName : nickname;
}
