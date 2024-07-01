import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/app/lib/db';
import cloudinary from 'cloudinary';

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { id, title, description, imageString } = req.body;

    try {
      const uploadResponse = await cloudinary.v2.uploader.upload(imageString);
      const imageUrl = uploadResponse.secure_url;

      const client = await pool.connect();
      const result = await client.query(
        'UPDATE crud_data SET title = $1, description = $2, image_url = $3 WHERE data_id = $4 RETURNING *',
        [title, description, imageUrl, id]
      );
      client.release();

      res.status(200).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error', details: (error as Error).message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
