"use client";

import { FormEvent, useEffect, useRef, useState } from 'react';
import UploadFilesFormUI from '../../components/video/upload-form';

export default function Test() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filesList, setFilesList] = useState<any[]>([]); 

  // fetch existing files in bucket
  useEffect(() => {
    fetchFilesList();
  }, []);

  const fetchFilesList = async () => {
    try {
      const response = await fetch('/api/getFiles');
      const files = await response.json();
      setFilesList(files);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  // main upload function
  const uploadToServer = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!fileInputRef.current || !fileInputRef.current.files) {
      throw new Error('No files selected');
    }
    const files = Object.values(fileInputRef.current.files);
    const filesInfo: any[] = files.map((file) => ({
      originalFileName: file.name,
      fileSize: file.size,
    }));

    const presignedUrls = await getPresignedUrls(filesInfo);
    await handleUpload(files, presignedUrls);

    setIsLoading(false);
    fetchFilesList(); // refresh file list after upload
  };

  const getPresignedUrls = async (files: any) => {
    const response = await fetch('/api/presignedUrl', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(files),
    });
    const result = await response.json();
    return result;
  };

  const uploadMinio = async (presignedUrl: any, file: File) => {
    return await fetch(presignedUrl.url, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type, 'Access-Control-Allow-Origin': '*' },
    });
  };

  const handleUpload = async (files: File[], presignedUrls: any[]) => {
    const uploadToS3Response = await Promise.all(
      presignedUrls.map((presignedUrl: any) => {
        const file = files.find(
          (file) => file.name === presignedUrl.originalFileName && file.size === presignedUrl.fileSize
        );
        if (!file) throw new Error('File not found');
        return uploadMinio(presignedUrl, file);
      })
    );

    if (uploadToS3Response.some((res) => res.status !== 200)) {
      alert('Upload failed');
      return;
    }
    alert('Upload successful');
  };

  return (
    <main className="flex flex-col items-center w-screen h-screen">
      <h1 className="text-3xl font-bold mb-4">File Upload & Display</h1>
      
      {/* Upload Form */}
      <UploadFilesFormUI isLoading={isLoading} fileInputRef={fileInputRef} uploadToServer={uploadToServer} />
      
      {/* Display Files List */}
      <div className="mt-8 w-3/4">
        <h2 className="text-2xl font-semibold">Files in Bucket:</h2>
        <ul className="mt-4">
          {filesList.map((file) => (
            <li key={file.name} className="mb-2">
              <span>{file.name}</span> - <span>{file.size} bytes</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
