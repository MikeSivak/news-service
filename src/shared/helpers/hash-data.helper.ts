import { hash, genSalt } from 'bcrypt';

export const hashDataHelper = async (data: string) => {
  const salt = await genSalt(10);
  return await hash(data, salt);
};
