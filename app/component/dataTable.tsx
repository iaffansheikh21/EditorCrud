import React from 'react';
import axios from 'axios';

const DataTable = ({ data, setData, setEditingData } : any) => {
  const handleDelete = async (id : any) => {
    try {
      const response = await axios.delete('/api/deleteData', { data: { id } });
      if (response.status === 200) {
        setData(data.filter(row => row.data_id !== id));
      } 
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const handleEdit = (row : { data_id: string, title: string, description: string, imageString: string }) => {
    setEditingData({
      id: row.data_id,
      title: row.title,
      description: row.description,
      imageString: row.imageString,
    });
  };

  return (
    <div className="mt-10">
      <h2 className="text-lg font-medium text-gray-700">Fetched Data</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Description</th>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Image</th>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row : any) => (
            <tr key={row.data_id}>
              <td className="py-2 px-4 border-b border-gray-200">{row.data_id}</td>
              <td className="py-2 px-4 border-b border-gray-200">{row.title}</td>
              <td className="py-2 px-4 border-b border-gray-200">{row.description}</td>
              <td className="py-2 px-4 border-b border-gray-200">{row.imageString}</td>
              <td className="py-2 px-4 border-b border-gray-200">{new Date(row.created_date).toLocaleString()}</td>
              <td className="py-2 px-4 border-b border-gray-200">
                <button
                  onClick={() => handleEdit(row)}
                  className="py-1 px-3 bg-yellow-600 text-white rounded hover:bg-yellow-700 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(row.data_id)}
                  className="py-1 px-3 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
