import { NextResponse } from 'next/server';
import { minioClient } from '../../lib/file-managment';

const bucketName = process.env.AWS_TENANT_BUCKET || '';

export async function GET() {
  try {
    const objectsList = [];
    const objectsStream = minioClient.listObjectsV2(bucketName, '', true);

    for await (const obj of objectsStream) {
      objectsList.push({
        name: obj.name,
        size: obj.size,
        lastModified: obj.lastModified,
      });
    }

    return NextResponse.json(objectsList);
  } catch (error) {
    console.error('Error fetching files from MinIO:', error);
    return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 });
  }
}
