import jwt from 'jsonwebtoken';

const users = [
  { id: 1, username: 'admin', password: '123456' } // Basit kullanıcı listesi
];

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const user = users.find(u => u.username === body.username && u.password === body.password);

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "Geçersiz kimlik bilgileri" });
  }

  const token = jwt.sign({ userId: user.id, username: user.username }, 'gizli-anahtar', { expiresIn: '1h' });

  return { token };
});
