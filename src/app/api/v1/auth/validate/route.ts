import { NextRequest, NextResponse } from 'next/server';
import { requireApiKey, getApiKeyFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  // Validar API Key
  const authError = requireApiKey(request);
  if (authError) {
    return authError;
  }

  const apiKey = getApiKeyFromRequest(request);
  
  return NextResponse.json({
    valid: true,
    apiKey: apiKey?.substring(0, 10) + '...',
    message: 'API Key válida',
    timestamp: new Date().toISOString(),
  });
}

export async function OPTIONS(_request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-API-Key, Authorization',
    },
  });
} 