import { NextResponse } from 'next/server';
import { fetchServiceToken } from '../../lib/serviceToken';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const tenant = process.env.AWS_TENANT_BUCKET;
const lambdaUrl = "https://${tenant}-svdt.birme-lambda.auto.prod.osaas.io/upload";  

export async function POST(req: Request) {
    try {
      const token = await fetchServiceToken();
  
      // Path to the file with the dynamic playlist
      const filePath = path.join(process.cwd(), 'src/components/webhooks', 'index.js');  
  
      // FormData to simulate file upload
      const form = new FormData();
      form.append('upload', fs.createReadStream(filePath)); 
  
      // Upload the file to the Lambda instance (zip file first?)
      const response = await fetch(lambdaUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,  
          ...form.getHeaders(),  
        },
        body: form as unknown as BodyInit,  
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error uploading playlist to Lambda:', errorText);
        return NextResponse.json({ error: 'Failed to upload playlist to Lambda' }, { status: response.status });
      }
  
      const result = await response.json();  
      console.log('Upload success:', result);
      return NextResponse.json(result);  
  
    } catch (error) {
      console.error('Error uploading playlist to Lambda:', error);
      return NextResponse.json({ error: 'Failed to upload playlist to Lambda' }, { status: 500 });
    }
  }