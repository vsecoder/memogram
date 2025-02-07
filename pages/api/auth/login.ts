import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('id, nickname, email, password_hash')
      .eq('email', email)
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to register user' });
    }

    if (!user) {
      return res.status(500).json({ error: 'Failed to retrieve user after registration' });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, nickname: user.nickname },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.status(200).json({ message: 'Login successful', jwt: token, user });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
