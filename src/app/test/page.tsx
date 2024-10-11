"use client";

import { FormEvent, useRef, useState } from 'react';
import { fetchServiceToken } from '../lib/serviceToken';
import { Url } from 'next/dist/shared/lib/router/router';
import UploadFilesFormUI from '../../components/video/upload-form';

export default function Test() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  // main upload function
  const uploadToServer = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // get File[] from FileList
    if (!fileInputRef.current || !fileInputRef.current.files) {
      throw new Error('No files selected');
    }
    const files = Object.values(fileInputRef.current.files);
    // validate files
    const filesInfo: any[] = files.map((file) => ({
      originalFileName: file.name,
      fileSize: file.size,
    }));
 
    const presignedUrls = await getPresignedUrls(filesInfo);
 
    // upload files to s3 endpoint directly and save file info to db
    await handleUpload(files, presignedUrls);
 
    setIsLoading(false);
  }
  // get presigned url
  const getPresignedUrls = async (files: any) => {
      console.log("Files:", files);
      const response = await fetch('/api/presignedUrl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(files),
      })
      const result = await response.json();
      console.log("Presigned URL Response:", result);
      
      return result;
  }

  // upload to minio
  const uploadMinio = async (presignedUrl: any, file: File) => {
      const response = await fetch(presignedUrl.url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
          'Access-Control-Allow-Origin': '*',
        },
      })
      return response
  }

  // upload handler
  const handleUpload = async (files: File[], presignedUrls: any[]) => {
      const uploadToS3Response = await Promise.all(
        presignedUrls.map((presignedUrl: any) => {
          const file = files.find(
            (file) => file.name === presignedUrl.originalFileName && file.size === presignedUrl.fileSize
          )
          if (!file) {
            throw new Error('File not found')
          }
          return uploadMinio(presignedUrl, file)
        })
      )
      
      if (uploadToS3Response.some((res) => res.status !== 200)) {
        alert('Upload failed')
        return
      }
      alert('Upload successful')
    }
    return (
        <main className="flex justify-center items-center w-screen h-screen">
            <h1 className="text-3xl font-bold mb-4">TESTING</h1>
            <UploadFilesFormUI
              isLoading={isLoading}
              fileInputRef={fileInputRef}
              uploadToServer={uploadToServer}
            />
        </main>
        
    );
}
