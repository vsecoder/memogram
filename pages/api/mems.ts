import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const Busboy = require('busboy');
    const busboy = Busboy({ headers: req.headers });
    const fields: { [key: string]: string | string[] } = {};
    const fileFields: { [key: string]: any } = {};

    busboy.on('field', (name: any, value: any) => {
      fields[name] = value;
    });

    busboy.on('file', (name: any, file: any, filename: any, encoding: any, mimeType: any) => {
      const fileData: any[] = [];
      file.on('data', (data: any) => {
        fileData.push(data);
      });
      file.on('end', () => {
        fileFields[name] = { filename, mimeType, data: Buffer.concat(fileData) };
      });
    });

    busboy.on('finish', async () => {
      const { text, title, author_id, tags } = fields;
      const { image } = fileFields;

      if (!text || !title || !author_id || !image) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const fileName = `${Date.now()}-${author_id}.jpg`;

      const { data: memData, error: memError } = await supabase
        .from('mems')
        .insert([{ text, title, image: fileName, author_id }])
        .select('*')
        .single();

      if (memError) {
        return res.status(500).json({ error: memError.message, state: "insert"  });
      }

      const { error: uploadError } = await supabase.storage
        .from('memes')
        .upload(fileName, image.data, { contentType: 'image/jpeg' });

      if (uploadError) {
        return res.status(500).json({ error: uploadError.message, state: "upload" });
      }

      if (tags && tags.length > 0) {
        const tagsArray = typeof tags === 'string' ? tags.split(',') : tags;
        const tagsData = tagsArray.map((tag: any) => ({ mem_id: memData.id, tag_id: tag }));
        const { error: tagsError } = await supabase
          .from('mems_tags')
          .insert(tagsData);

        if (tagsError) {
          return res.status(500).json({ error: tagsError.message, state: "mems_tags"  });
        }
      }

      return res.status(201).json(memData);
    });

    req.pipe(busboy);
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
