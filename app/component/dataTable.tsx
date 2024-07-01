import React from 'react';
import axios from 'axios';

const DataTable = ({ data, setData, setEditingData }) => {
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete('/api/deleteData', { data: { id } });
      if (response.status === 200) {
        setData(data.filter(row => row.data_id !== id));
      }
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const handleEdit = (row) => {
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
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              {['ID', 'Title', 'Description', 'Image', 'Created Date', 'Actions'].map(header => (
                <th key={header} className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.data_id}>
                <td className="py-2 px-4 border-b border-gray-200">{row.data_id}</td>
                <td className="py-2 px-4 border-b border-gray-200">{row.title}</td>
                <td className="py-2 px-4 border-b border-gray-200">{row.description}</td>
                <td className="py-2 px-4 border-b border-gray-200">{row.imageString}</td>
                <td className="py-2 px-4 border-b border-gray-200">{new Date(row.created_date).toLocaleString()}</td>
                <td className="py-2 px-4 border-b border-gray-200">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(row)}
                      className="py-1 px-3 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(row.data_id)}
                      className="py-1 px-3 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
