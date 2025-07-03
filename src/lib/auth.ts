import { NextRequest, NextResponse } from 'next/server';
import { prisma } from './prisma';

// Middleware para validar API Key
export async function requireApiKey(request: NextRequest): Promise<NextResponse | null> {
  try {
    const apiKey = request.headers.get('X-API-Key');
    
    if (!apiKey) {
      return NextResponse.json(
        { 
          error: 'API Key obrigatória',
          message: 'Inclua sua API Key no header "X-API-Key"',
          documentation: '/docs'
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