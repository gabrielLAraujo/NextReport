import { NextRequest, NextResponse } from 'next/server';
import { prisma } from './prisma';

// Middleware para validar API Key
export async function requireApiKey(request: NextRequest): Promise<NextResponse | null> {
  try {
    // Verificar se é uma requisição local do próprio projeto
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    const userAgent = request.headers.get('user-agent');
    const host = request.headers.get('host');
    const forwardedHost = request.headers.get('x-forwarded-host');
    
    // Obter URL da requisição
    const url = new URL(request.url);
    
    // Permitir requisições locais sem autenticação
    const isLocalRequest = 
      // Requisições do mesmo domínio (localhost ou domínio de produção)
      (origin && (origin.includes('localhost') || origin.includes('127.0.0.1') || origin.includes('nextreport.vercel.app'))) ||
      (referer && (referer.includes('localhost') || referer.includes('127.0.0.1') || referer.includes('nextreport.vercel.app'))) ||
      // Requisições internas do Next.js
      (userAgent && userAgent.includes('Next.js')) ||
      // Requisições sem origin (internas) ou do mesmo host
      (!origin && !referer) ||
      // Requisições do frontend da própria aplicação
      (host === 'nextreport.vercel.app') ||
      (forwardedHost === 'nextreport.vercel.app') ||
      // Requisições do próprio domínio
      (url.hostname === 'nextreport.vercel.app') ||
      (url.hostname === 'localhost') ||
      (url.hostname === '127.0.0.1');
    
    if (isLocalRequest) {
      console.log('🔓 Requisição local permitida sem API Key', {
        origin,
        referer,
        host,
        forwardedHost,
        hostname: url.hostname
      });
      return null;
    }
    
    console.log('🔒 Requisição externa detectada, verificando API Key', {
      origin,
      referer,
      host,
      forwardedHost,
      hostname: url.hostname
    });
    
    const apiKey = request.headers.get('X-API-Key') || request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!apiKey) {
      return NextResponse.json(
        { 
          error: 'API Key obrigatória',
          message: 'Inclua sua API Key no header "X-API-Key" ou "Authorization: Bearer <key>"',
          documentation: '/docs',
          debug: {
            origin,
            referer,
            host,
            forwardedHost,
            hostname: url.hostname
          }
        },
        { status: 401 }
      );
    }

    // Validar formato da API Key
    if (!apiKey.startsWith('nxr_') || apiKey.length !== 68) {
      return NextResponse.json(
        { 
          error: 'API Key inválida',
          message: 'Formato de API Key inválido',
          documentation: '/docs'
        },
        { status: 401 }
      );
    }

    // Buscar API Key no banco de dados
    const keyRecord = await prisma.apiKey.findUnique({
      where: { apiKey },
    });

    if (!keyRecord) {
      return NextResponse.json(
        { 
          error: 'API Key não encontrada',
          message: 'API Key não existe ou foi revogada',
          documentation: '/docs'
        },
        { status: 401 }
      );
    }

    if (!keyRecord.isActive) {
      return NextResponse.json(
        { 
          error: 'API Key inativa',
          message: 'Esta API Key foi desativada',
          documentation: '/docs'
        },
        { status: 401 }
      );
    }

    // Atualizar estatísticas de uso
    await prisma.apiKey.update({
      where: { apiKey },
      data: {
        lastUsed: new Date(),
        usageCount: {
          increment: 1,
        },
      },
    });

    console.log('🔑 API Key externa validada com sucesso');
    // API Key válida
    return null;

  } catch (error) {
    console.error('Erro na validação da API Key:', error);
    
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        message: 'Erro ao validar API Key'
      },
      { status: 500 }
    );
  }
}

// Função para obter informações da API Key
export async function getApiKeyInfo(apiKey: string) {
  try {
    const keyRecord = await prisma.apiKey.findUnique({
      where: { apiKey },
      select: {
        id: true,
        email: true,
        isActive: true,
        createdAt: true,
        lastUsed: true,
        usageCount: true,
      },
    });

    return keyRecord;
  } catch (error) {
    console.error('Erro ao obter informações da API Key:', error);
    return null;
  }
} 