import { NextResponse } from 'next/server';

// Especificação OpenAPI manual (sem dependência externa)
const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'NextReport API',
    version: '1.0.0',
    description: 'Serviço de geração de relatórios em PDF, XLSX e XLS',
    contact: {
      name: 'NextReport',
      url: 'http://localhost:3001',
    },
  },
  servers: [
    {
      url: 'https://nextreport.vercel.app',
      description: 'Servidor de Produção',
    },
    {
      url: 'http://localhost:3001',
      description: 'Servidor de Desenvolvimento',
    },
  ],
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key',
        description: 'API Key para autenticação. Use: nxr_demo_key_123456789',
      },
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        description: 'Token Bearer para autenticação',
      },
    },
    schemas: {
      ReportRequest: {
        type: 'object',
        required: ['title', 'format', 'data', 'template'],
        properties: {
          title: {
            type: 'string',
            description: 'Título do relatório',
            example: 'Relatório de Vendas Janeiro 2024',
          },
          format: {
            type: 'string',
            enum: ['pdf', 'xlsx', 'xls'],
            description: 'Formato de saída do relatório',
            example: 'pdf',
          },
          data: {
            type: 'object',
            description: 'Dados JSON para preencher o template',
            example: {
              titulo: 'Vendas Janeiro 2024',
              total: 'R$ 15.000,00',
              itens: [
                { produto: 'Produto A', valor: 'R$ 5.000,00' },
                { produto: 'Produto B', valor: 'R$ 10.000,00' }
              ]
            },
          },
          template: {
            type: 'object',
            required: ['html'],
            properties: {
              html: {
                type: 'string',
                description: 'Template HTML com sintaxe {{variavel}}, {{#each}}, {{#if}}',
                example: '<h1>{{titulo}}</h1><p>Total: {{total}}</p>{{#each itens}}<div>{{produto}}: {{valor}}</div>{{/each}}',
              },
              css: {
                type: 'string',
                description: 'Estilos CSS para o template',
                example: 'h1 { color: blue; } p { font-size: 16px; }',
              },
            },
          },
          options: {
            type: 'object',
            description: 'Opções de formatação (apenas para PDF)',
            properties: {
              pageSize: {
                type: 'string',
                enum: ['A4', 'A3', 'Letter'],
                default: 'A4',
                description: 'Tamanho da página',
              },
              orientation: {
                type: 'string',
                enum: ['portrait', 'landscape'],
                default: 'portrait',
                description: 'Orientação da página',
              },
              margins: {
                type: 'object',
                properties: {
                  top: { type: 'string', default: '1cm' },
                  right: { type: 'string', default: '1cm' },
                  bottom: { type: 'string', default: '1cm' },
                  left: { type: 'string', default: '1cm' },
                },
              },
            },
          },
        },
      },
      ValidationError: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            example: 'Dados de entrada inválidos',
          },
          details: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: { type: 'string' },
                message: { type: 'string' },
              },
            },
          },
        },
      },
      AuthError: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            example: 'API Key inválida ou ausente',
          },
          message: {
            type: 'string',
            example: 'Inclua uma API Key válida no header X-API-Key ou Authorization: Bearer <key>',
          },
        },
      },
      ServerError: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            example: 'Erro interno do servidor',
          },
          message: {
            type: 'string',
            example: 'Erro ao processar a requisição',
          },
        },
      },
      AuthValidation: {
        type: 'object',
        properties: {
          valid: {
            type: 'boolean',
            example: true,
          },
          apiKey: {
            type: 'string',
            example: 'nxr_demo_k...',
          },
          message: {
            type: 'string',
            example: 'API Key válida',
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T10:30:00.000Z',
          },
        },
      },
    },
  },
  paths: {
    '/api/v1/reports/generate': {
      post: {
        tags: ['Reports'],
        summary: 'Gerar relatório',
        description: 'Gera relatórios em múltiplos formatos (PDF, XLSX, XLS) usando templates dinâmicos',
        security: [
          { ApiKeyAuth: [] },
          { BearerAuth: [] }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ReportRequest'
              },
              examples: {
                'PDF Example': {
                  summary: 'Exemplo de geração de PDF',
                  value: {
                    title: 'Relatório de Vendas',
                    format: 'pdf',
                    data: {
                      titulo: 'Vendas Janeiro 2024',
                      total: 'R$ 15.000,00',
                      mostrarTabela: true,
                      itens: [
                        { produto: 'Produto A', valor: 'R$ 5.000,00' },
                        { produto: 'Produto B', valor: 'R$ 10.000,00' }
                      ]
                    },
                    template: {
                      html: '<h1>{{titulo}}</h1><p>Total: {{total}}</p>{{#if mostrarTabela}}<table>{{#each itens}}<tr><td>{{produto}}</td><td>{{valor}}</td></tr>{{/each}}</table>{{/if}}',
                      css: 'h1 { color: blue; } table { border-collapse: collapse; } td { border: 1px solid #ccc; padding: 8px; }'
                    },
                    options: {
                      pageSize: 'A4',
                      orientation: 'portrait'
                    }
                  }
                },
                'Excel Example': {
                  summary: 'Exemplo de geração de Excel',
                  value: {
                    title: 'Relatório de Dados',
                    format: 'xlsx',
                    data: {
                      empresa: 'Minha Empresa',
                      periodo: 'Janeiro 2024',
                      vendas: [
                        { produto: 'A', quantidade: 10, valor: 1500.50 },
                        { produto: 'B', quantidade: 5, valor: 2300.75 }
                      ]
                    },
                    template: {
                      html: 'Template não usado para Excel'
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Arquivo gerado com sucesso',
            headers: {
              'Content-Type': {
                description: 'Tipo do arquivo gerado',
                schema: {
                  type: 'string',
                  example: 'application/pdf'
                }
              },
              'Content-Disposition': {
                description: 'Nome do arquivo para download',
                schema: {
                  type: 'string',
                  example: 'attachment; filename="relatorio.pdf"'
                }
              },
              'X-Report-ID': {
                description: 'ID único do relatório gerado',
                schema: {
                  type: 'string',
                  example: '1673123456789'
                }
              },
              'X-Generated-At': {
                description: 'Timestamp de geração',
                schema: {
                  type: 'string',
                  example: '2024-01-15T10:30:00.000Z'
                }
              }
            },
            content: {
              'application/pdf': {
                schema: {
                  type: 'string',
                  format: 'binary'
                }
              },
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
                schema: {
                  type: 'string',
                  format: 'binary'
                }
              },
              'application/vnd.ms-excel': {
                schema: {
                  type: 'string',
                  format: 'binary'
                }
              }
            }
          },
          '400': {
            description: 'Dados de entrada inválidos',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ValidationError'
                }
              }
            }
          },
          '401': {
            description: 'API Key inválida ou ausente',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AuthError'
                }
              }
            }
          },
          '500': {
            description: 'Erro interno do servidor',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ServerError'
                }
              }
            }
          }
        }
      }
    },
    '/api/v1/auth/validate': {
      get: {
        tags: ['Authentication'],
        summary: 'Validar API Key',
        description: 'Verifica se a API Key fornecida é válida',
        security: [
          { ApiKeyAuth: [] },
          { BearerAuth: [] }
        ],
        responses: {
          '200': {
            description: 'API Key válida',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AuthValidation'
                }
              }
            }
          },
          '401': {
            description: 'API Key inválida ou ausente',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AuthError'
                }
              }
            }
          }
        }
      }
    }
  },
  tags: [
    {
      name: 'Reports',
      description: 'Operações relacionadas à geração de relatórios'
    },
    {
      name: 'Authentication',
      description: 'Operações relacionadas à autenticação'
    }
  ]
};

export async function GET() {
  return NextResponse.json(swaggerSpec, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }
  });
} 