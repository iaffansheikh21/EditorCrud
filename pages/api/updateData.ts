// pages/api/updateData.js

import pool from "@/app/lib/db";

export default async function handler(req : any, res : any) {
  if (req.method === 'PUT') {
    const { id, title, description, imageString } = req.body;
    if (!id || !title || !description) {
      return res.status(400).json({ error: 'ID, title, and description are required' });
    }

    try {
      const client = await pool.connect();
      const result = await client.query(
        'UPDATE crud_data SET article_data = $1 WHERE data_id = $2 RETURNING *',
        [`${title},${description},${imageString}`, id]
      );
      client.release();

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Data not found' });
      }

      res.status(200).json({ message: 'Data updated successfully', updatedData: result.rows[0] });
    } catch (error) {
      res.status(500).json({ error: 'Database update error', details: (error as Error).message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
