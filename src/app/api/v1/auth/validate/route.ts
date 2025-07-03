import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const apiKey = request.headers.get('X-API-Key');
    
    if (!apiKey) {
      return NextResponse.json(
        { 
          valid: false,
          error: 'API Key obrigatória',
          message: 'Inclua sua API Key no header "X-API-Key"'
        },
        { status: 401 }
      );
    }

    // Validar formato da API Key
    if (!apiKey.startsWith('nxr_') || apiKey.length !== 68) {
      return NextResponse.json(
        { 
          valid: false,
          error: 'API Key inválida',
          message: 'Formato de API Key inválido'
        },
        { status: 401 }
      );
    }

    // Buscar API Key no banco de dados
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

    if (!keyRecord) {
      return NextResponse.json(
        { 
          valid: false,
          error: 'API Key não encontrada',
          message: 'API Key não existe ou foi revogada'
        },
        { status: 401 }
      );
    }

    if (!keyRecord.isActive) {
      return NextResponse.json(
        { 
          valid: false,
          error: 'API Key inativa',
          message: 'Esta API Key foi desativada'
        },
        { status: 401 }
      );
    }

    // API Key válida
    return NextResponse.json(
      {
        valid: true,
        message: 'API Key válida',
        data: {
          email: keyRecord.email,
          createdAt: keyRecord.createdAt,
          lastUsed: keyRecord.lastUsed,
          usageCount: keyRecord.usageCount,
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Erro na validação da API Key:', error);
    
    return NextResponse.json(
      { 
        valid: false,
        error: 'Erro interno do servidor',
        message: 'Erro ao validar API Key'
      },
      { status: 500 }
    );
  }
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