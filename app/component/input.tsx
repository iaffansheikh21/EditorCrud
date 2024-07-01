"use client"
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import DataTable from './dataTable';

// Dynamically import ReactQuill to prevent SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const EditorForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [data, setData] = useState([]);
  const [editingData, setEditingData] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (upload) => {
        setImage(upload.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const imageString = image ? image : '';
    const payload = { title, description, imageString };

    try {
      if (editingData) {
        const response = await axios.put('/api/updateData', { id: editingData.id, ...payload });
        if (response.status === 200) {
          setData(data.map(item => (item.id === editingData.id ? response.data.updatedData : item)));
          setEditingData(null);
          alert('Data updated successfully');
        }
      } else {
        const response = await axios.post('/api/saveData', payload);
        if (response.status === 200) {
          setData([...data, response.data]);
          alert('Data submitted successfully');
        }
      }
      setTitle('');
      setDescription('');
      setImage(null);
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Failed to save data');
    }
  };

  const handleGetData = async () => {
    try {
      const response = await axios.get('/api/getData');
      if (response.status === 200) {
        setData(response.data);
        alert('Data fetched successfully');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to fetch data');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <ReactQuill
            value={description}
            onChange={setDescription}
            className="mt-1 block w-full h-40 p-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {editingData ? 'Update' : 'Submit'}
          </button>
          <button
            type="button"
            onClick={handleGetData}
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Get Data
          </button>
        </div>
      </form>

      {data.length > 0 && <DataTable data={data} setData={setData} setEditingData={setEditingData} />}
    </div>
  );
};

export default EditorForm;
