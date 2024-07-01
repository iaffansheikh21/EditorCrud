// pages/api/getData.js

import pool from '@/app/lib/db';
import { htmlToText } from 'html-to-text';

export default async function handler(req : any, res : any) {
  if (req.method === 'GET') {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM editorcrud');
      client.release();

      const formattedData = result.rows.map(row => {
        const [title, description, imageString] = row.article_data.split(',');
        return {
          ...row,
          title: htmlToText(title),
          description: htmlToText(description),
          imageString,
        };
      });

      res.status(200).json(formattedData);
    } catch (error) {
      res.status(500).json({ error: 'Database fetch error', details: (error as Error).message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
