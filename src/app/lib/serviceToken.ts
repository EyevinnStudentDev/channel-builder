import { Context } from '@osaas/client-core';

let serviceToken: string | null = null;
let tokenExpiry: number | null = null;

// Function to fetch a new service token
export async function fetchServiceToken(serviceName: string): Promise<string> {
  const ctx = new Context();
  const serivceAccessToken = await ctx.getServiceAccessToken(
    serviceName
  );

  if (!serivceAccessToken) {
    const errorText = await serivceAccessToken;
    console.error('Error fetching token:', errorText);
    throw new Error('Failed to retrieve token');
  }

  console.log('New token fetched:', serivceAccessToken);
  /*
  const data = await serivceAccessToken.json();
  console.log(data.token)
  serviceToken = data.token; // Assuming the token is in `data.token`
  tokenExpiry =  data.expiry*1000
  console.log('New token fetched:', serviceToken);
  */
  return serivceAccessToken as string;
}

// Function to ensure the service token is valid (fetch a new one if expired or doesn't exist)
export async function ensureValidServiceToken(serviceName: string): Promise<string> {
  if (!serviceToken || !tokenExpiry || Date.now() >= tokenExpiry) {
    await fetchServiceToken(serviceName);
  }
  return serviceToken as string;
}
