import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Schema para validação de email na busca
const searchKeySchema = z.object({
  email: z.string().email('Email inválido').toLowerCase(),
});

// GET - Buscar API Key por email
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { 
          error: 'Email é obrigatório',
          message: 'Informe o email para buscar a API Key'
        },
        { status: 400 }
      );
    }

    // Validar email
    const validatedData = searchKeySchema.parse({ email });

    // Buscar API Key
    const apiKey = await prisma.apiKey.findUnique({
      where: { email: validatedData.email },
      select: {
        id: true,
        email: true,
        apiKey: true,
        isActive: true,
        createdAt: true,
        lastUsed: true,
        usageCount: true,
      },
    });

    if (!apiKey) {
      return NextResponse.json(
        { 
          error: 'API Key não encontrada',
          message: 'Não existe uma API Key para este email'
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: apiKey,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Erro ao buscar API Key:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Email inválido',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          }))
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        message: 'Ocorreu um erro ao buscar a API Key'
      },
      { status: 500 }
    );
  }
}

// DELETE - Desativar API Key
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar dados de entrada
    const validatedData = searchKeySchema.parse(body);
    const { email } = validatedData;

    // Buscar e desativar API Key
    const apiKey = await prisma.apiKey.findUnique({
      where: { email },
    });

    if (!apiKey) {
      return NextResponse.json(
        { 
          error: 'API Key não encontrada',
          message: 'Não existe uma API Key para este email'
        },
        { status: 404 }
      );
    }

    // Desativar API Key
    const updatedKey = await prisma.apiKey.update({
      where: { email },
      data: { 
        isActive: false,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'API Key desativada com sucesso',
        email: updatedKey.email,
        deactivatedAt: updatedKey.updatedAt,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Erro ao desativar API Key:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Dados de entrada inválidos',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          }))
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        message: 'Ocorreu um erro ao desativar a API Key'
      },
      { status: 500 }
    );
  }
} 