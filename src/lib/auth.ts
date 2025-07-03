import { NextRequest } from 'next/server';

// Chaves de API válidas (em produção, isso deveria vir de um banco de dados)
const VALID_API_KEYS = new Set([
  'nxr_demo_key_123456789',
  'nxr_prod_key_987654321',
  // Adicione mais chaves conforme necessário
]);

export function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key') || 
                 request.headers.get('authorization')?.replace('Bearer ', '');
  
  if (!apiKey) {
    return false;
  }
  
  return VALID_API_KEYS.has(apiKey);
}

export function getApiKeyFromRequest(request: NextRequest): string | null {
  return request.headers.get('x-api-key') || 
         request.headers.get('authorization')?.replace('Bearer ', '') || 
         null;
}

// Middleware para validar API Key
export function requireApiKey(request: NextRequest) {
  if (!validateApiKey(request)) {
    return new Response(
      JSON.stringify({ 
        error: 'API Key inválida ou ausente',
        message: 'Inclua uma API Key válida no header X-API-Key ou Authorization: Bearer <key>'
      }), 
      { 
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }
  return null;
} 