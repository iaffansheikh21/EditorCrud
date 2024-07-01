// pages/api/saveData.js

import pool from "@/app/lib/db";

export default async function handler(req : any, res : any) {
  if (req.method === 'POST') {
    const { title, description, imageString } = req.body;
    const articleData = `${title},${description},${imageString}`;

    try {
      const client = await pool.connect();
      const result = await client.query(
        'INSERT INTO crud_data (article_data) VALUES ($1) RETURNING data_id',
        [articleData]
      );
      client.release();
      res.status(200).json({ message: 'Data saved successfully', dataId: result.rows[0].data_id });
    } catch (error) {
      res.status(500).json({ error: 'Database insertion error', details: (error as Error).message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
