import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

// Разрешаем поддержку загрузки файлов через Supabase
export const config = {
  api: {
    bodyParser: false, // Отключаем стандартный парсер для multipart/form-data
  },
};

// API для создания мема
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const Busboy = require('busboy');
    const busboy = Busboy({ headers: req.headers });
    const fields: { [key: string]: string | string[] } = {};
    const fileFields: { [key: string]: any } = {};

    busboy.on('field', (name: any, value: any) => {
      // Сохраняем обычные поля формы
      fields[name] = value;
    });

    busboy.on('file', (name: any, file: any, filename: any, encoding: any, mimeType: any) => {
      // Сохраняем файлы
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

      // Создаем запись о меме в базе данных
      const { data: memData, error: memError } = await supabase
        .from('mems')
        .insert([{ text, title, image: fileName, author_id }])
        .select('*')
        .single();

      if (memError) {
        return res.status(500).json({ error: memError.message, state: "insert"  });
      }

      // Загружаем изображение в Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('memes')
        .upload(fileName, image.data, { contentType: 'image/jpeg' });

      if (uploadError) {
        return res.status(500).json({ error: uploadError.message, state: "upload" });
      }

      // Обработка тегов
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

    req.pipe(busboy); // Прокачиваем запрос через busboy
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
