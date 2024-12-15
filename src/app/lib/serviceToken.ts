const API_URL_TOKEN = 'https://token.svc.prod.osaas.io/servicetoken';
const PAT_TOKEN = process.env.NEXT_PRIVATE_OSAAS_TOKEN;

let serviceToken: string | null = null;
let serviceActivated = false;
let tokenExpiry: number | null = null;

async function activateService(serviceId: string): Promise<void> {
  const serviceUrl = new URL(
    `https://catalog.svc.prod.osaas.io/mysubscriptions`
  );

  const response = await fetch(serviceUrl, {
    method: 'POST',
    headers: {
      'x-pat-jwt': `Bearer ${PAT_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ services: [serviceId] })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error activating service:', errorText);
    throw new Error('Failed to activate service');
  }

  console.log(`Service ${serviceId} activated successfully.`);
  serviceActivated = true; // Mark the service as activated
}

// Function to fetch a new service token
export async function fetchServiceToken(): Promise<string> {
  // CHANGE SO THAT IT CAN FETCH TOKENS FOR DIFFERENT SERVICES

  if (!serviceActivated) {
    // Ensure the service is activated before fetching the token
    await activateService('channel-engine');
  }
  const payload = {
    serviceId: 'channel-engine'
  };

  const response = await fetch(API_URL_TOKEN, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'x-pat-jwt': `Bearer ${PAT_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload),
    cache: 'no-store' // disable cache
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error fetching token:', errorText);
    throw new Error('Failed to retrieve token');
  }

  const data = await response.json();
  console.log(data.token);
  serviceToken = data.token; // Assuming the token is in `data.token`
  tokenExpiry = data.expiry * 1000;
  console.log('New token fetched:', serviceToken);
  return serviceToken as string;
}

// Function to ensure the service token is valid (fetch a new one if expired or doesn't exist)
export async function ensureValidServiceToken(): Promise<string> {
  if (!serviceToken || !tokenExpiry || Date.now() >= tokenExpiry) {
    await fetchServiceToken();
  }
  return serviceToken as string;
}
