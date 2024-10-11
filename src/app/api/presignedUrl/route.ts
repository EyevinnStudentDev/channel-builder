import type { NextApiRequest, NextApiResponse } from 'next'
import { createPresignedUrlToUpload } from '../../lib/file-managment'
import { nanoid } from 'nanoid'
import { NextRequest, NextResponse } from 'next/server';

const bucketName = process.env.AWS_TENANT_BUCKET || '';
const expiry = 60 * 60 // 24 hours

export async function POST(req: NextRequest, res: NextResponse) {
  // Parse the request body as JSON
  const body = await req.json();
  const files = body as any[];
  console.log('Files IN BACKEND:', files);

  if (!files?.length) {
    return NextResponse.json({ message: 'No files to upload' });
  }

  const presignedUrls = [] as any[];

  if (files?.length) {
    // use Promise.all to get all the presigned URLs in parallel
    await Promise.all(
      // loop through the files
      files.map(async (file) => {
        const fileName = `${nanoid(5)}-${file?.originalFileName}`;

        // get presigned URL using s3/minio SDK
        const url = await createPresignedUrlToUpload({
          bucketName,
          fileName,
          expiry,
        });

        // add presigned URL to the list
        presignedUrls.push({
          fileNameInBucket: fileName,
          originalFileName: file.originalFileName,
          fileSize: file.fileSize,
          url,
        });
      })
    );
  }

  console.log('Presigned URLs:', presignedUrls);
  return NextResponse.json(presignedUrls);
}
