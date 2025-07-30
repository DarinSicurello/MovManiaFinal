import React from 'react';

// Props for download UPDATED
interface DownloadJsonButtonProps {
  endpoint: string;           
  filename: string;           
  label?: string;             
}
// Download fucntion for the file name
export default function DownloadJsonButton({ endpoint, filename, label = 'Download JSON' }: DownloadJsonButtonProps) {
  const handleDownload = async () => {
    try {
      const res = await fetch(`http://localhost:3001/${endpoint}`);
      if (!res.ok) throw new Error('Failed to fetch JSON data');

      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading JSON:', err);
      alert('Failed to download file.');
    }
  };
// using Bootsrap 
  return (
    <button className="btn btn-outline-primary mt-3" onClick={handleDownload}>
      {label}
    </button>
  );
}
