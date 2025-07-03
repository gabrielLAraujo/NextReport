import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Schema de validação para geração de API Key
const generateKeySchema = z.object({
  email: z.string().email('Email inválido').toLowerCase(),
});

// Função para validar se o email é real (validação básica)
function isValidEmailDomain(email: string): boolean {
  const domain = email.split('@')[1];
  
  // Lista de domínios temporários/descartáveis comuns
  const disposableEmailDomains = [
    '10minutemail.com',
    'tempmail.org',
    'guerrillamail.com',
    'mailinator.com',
    'temp-mail.org',
    'throwaway.email',
    'yopmail.com',
    'maildrop.cc',
    'getnada.com',
    'trashmail.com',
  ];

  // Verificar se não é um domínio descartável
  if (disposableEmailDomains.includes(domain)) {
    return false;
  }

  // Verificar se o domínio tem pelo menos um ponto
  if (!domain.includes('.')) {
    return false;
  }

  // Verificar se o domínio não é muito curto
  if (domain.length < 4) {
    return false;
  }

  return true;
}

// Função para gerar API Key segura
function generateApiKey(): string {
  const prefix = 'nxr_'; // NextReport prefix
  const randomBytes = crypto.randomBytes(32);
  const apiKey = prefix + randomBytes.toString('hex');
  return apiKey;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar dados de entrada
    const validatedData = generateKeySchema.parse(body);
    const { email } = validatedData;

    // Validar se o email é real
    if (!isValidEmailDomain(email)) {
      return NextResponse.json(
        { 
          error: 'Email inválido ou de domínio não permitido',
          message: 'Por favor, use um email válido de um provedor confiável'
        },
        { status: 400 }
      );
    }

    // Verificar se já existe uma API Key para este email
    const existingKey = await prisma.apiKey.findUnique({
      where: { email },
    });

    if (existingKey) {
      if (existingKey.isActive) {
        return NextResponse.json(
          { 
            error: 'API Key já existe',
            message: 'Já existe uma API Key ativa para este email',
            apiKey: existingKey.apiKey,
            createdAt: existingKey.createdAt,
          },
          { status: 200 }
        );
      } else {
        // Reativar a API Key existente
        const updatedKey = await prisma.apiKey.update({
          where: { email },
          data: { 
            isActive: true,
            updatedAt: new Date(),
          },
        });

        return NextResponse.json(
          {
            success: true,
            message: 'API Key reativada com sucesso',
            apiKey: updatedKey.apiKey,
            email: updatedKey.email,
            createdAt: updatedKey.createdAt,
            reactivated: true,
          },
          { status: 200 }
        );
      }
    }

    // Gerar nova API Key
    const apiKey = generateApiKey();

    // Salvar no banco de dados
    const newApiKey = await prisma.apiKey.create({
      data: {
        email,
        apiKey,
        isActive: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'API Key gerada com sucesso',
        apiKey: newApiKey.apiKey,
        email: newApiKey.email,
        createdAt: newApiKey.createdAt,
        instructions: {
          usage: 'Inclua esta API Key no header "X-API-Key" das suas requisições',
          endpoint: '/api/v1/reports/generate',
          documentation: '/docs',
        },
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Erro ao gerar API Key:', error);
    
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
        message: 'Ocorreu um erro ao gerar a API Key'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 