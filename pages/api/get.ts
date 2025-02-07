import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { page = '1', pageSize = '10' } = req.query;
    const limit = parseInt(pageSize as string);
    const offset = (parseInt(page as string) - 1) * limit;

    const { data, error } = await supabase
      .from('mems')
      .select(`id, text, image, title, likes, created_at, 
               author:users(nickname, id), moderated,
               tags:mems_tags(tag_id)`) 
      .order('id', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const memsWithImageUrls = data.map(mem => ({
      ...mem,
      image: `${process.env.SUPABASE_URL}/storage/v1/object/public/memes/${mem.image}`
    }));

    return res.json({ data: memsWithImageUrls });
}
