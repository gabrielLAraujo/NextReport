import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireApiKey } from '@/lib/auth';
import * as XLSX from 'xlsx';
// Removido puppeteer - agora usando apenas geração de documentos
import Handlebars from 'handlebars';

// Schema de validação para requisições da API
const generateReportSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  format: z.enum(['pdf', 'xlsx', 'xls'], {
    errorMap: () => ({ message: 'Formato deve ser: pdf, xlsx ou xls' })
  }),
  data: z.record(z.any()),
  template: z.object({
    html: z.string().min(1, 'Template HTML é obrigatório'),
    css: z.string().optional().default(''),
  }),
  options: z.object({
    pageSize: z.enum(['A4', 'A3', 'Letter']).optional().default('A4'),
    orientation: z.enum(['portrait', 'landscape']).optional().default('portrait'),
    margins: z.object({
      top: z.string().optional().default('1cm'),
      right: z.string().optional().default('1cm'),
      bottom: z.string().optional().default('1cm'),
      left: z.string().optional().default('1cm'),
    }).optional().default({}),
  }).optional().default({}),
});

export async function POST(request: NextRequest) {
  // Validar API Key
  const authError = await requireApiKey(request);
  if (authError) {
    return authError;
  }

  try {
    const body = await request.json();
    
    // Validar dados de entrada
    const validatedData = generateReportSchema.parse(body);
    const { title, format, data, template, options } = validatedData;

    // Gerar relatório baseado no formato
    let buffer: Buffer;
    let contentType: string;
    let fileName: string;

    const reportId = Date.now().toString();

    switch (format) {
      case 'pdf':
        buffer = await generatePDF(data, template, options, title);
        contentType = 'application/pdf';
        fileName = `${title.replace(/[^a-zA-Z0-9]/g, '_')}_${reportId}.pdf`;
        break;
      
      case 'xlsx':
      case 'xls':
        buffer = await generateExcel(data, format, title);
        contentType = format === 'xlsx' 
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : 'application/vnd.ms-excel';
        fileName = `${title.replace(/[^a-zA-Z0-9]/g, '_')}_${reportId}.${format}`;
        break;
      
      default:
        throw new Error('Formato não suportado');
    }

    // Retornar arquivo
    return new NextResponse(buffer as any, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': buffer.length.toString(),
        'X-Report-ID': reportId,
        'X-Generated-At': new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    
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
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

// Configurar Handlebars com helpers personalizados
function setupHandlebars() {
  // Helper para formatação de moeda brasileira
  Handlebars.registerHelper('currency', function(value: any) {
    const num = parseFloat(String(value).replace(/[^\d.-]/g, '')) || 0;
    return new Handlebars.SafeString(`R$ ${num.toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`);
  });

  // Helper para formatação de números
  Handlebars.registerHelper('number', function(value: any) {
    const num = parseFloat(String(value).replace(/[^\d.-]/g, '')) || 0;
    return new Handlebars.SafeString(num.toLocaleString('pt-BR'));
  });

  // Helper para formatação de data
  Handlebars.registerHelper('date', function(value: any, format?: string) {
    if (!value) return '';
    
    let date: Date;
    if (typeof value === 'string') {
      date = new Date(value);
    } else if (value instanceof Date) {
      date = value;
    } else {
      return value;
    }

    if (isNaN(date.getTime())) return value;

    const formatType = format || 'dd/MM/yyyy';
    
    switch (formatType) {
      case 'dd/MM/yyyy':
        return new Handlebars.SafeString(date.toLocaleDateString('pt-BR'));
      case 'dd/MM/yyyy HH:mm':
        return new Handlebars.SafeString(date.toLocaleString('pt-BR'));
      case 'long':
        return new Handlebars.SafeString(date.toLocaleDateString('pt-BR', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }));
      default:
        return new Handlebars.SafeString(date.toLocaleDateString('pt-BR'));
    }
  });

  // Helper para formatação de porcentagem
  Handlebars.registerHelper('percentage', function(value: any, decimals: number = 2) {
    const num = parseFloat(String(value).replace(/[^\d.-]/g, '')) || 0;
    return new Handlebars.SafeString(`${(num * 100).toFixed(decimals)}%`);
  });

  // Helper para texto em maiúsculo
  Handlebars.registerHelper('upper', function(value: any) {
    return new Handlebars.SafeString(String(value || '').toUpperCase());
  });

  // Helper para texto em minúsculo
  Handlebars.registerHelper('lower', function(value: any) {
    return new Handlebars.SafeString(String(value || '').toLowerCase());
  });

  // Helper para capitalizar primeira letra
  Handlebars.registerHelper('capitalize', function(value: any) {
    const str = String(value || '');
    return new Handlebars.SafeString(str.charAt(0).toUpperCase() + str.slice(1).toLowerCase());
  });

  // Helper para truncar texto
  Handlebars.registerHelper('truncate', function(value: any, length: number = 50) {
    const str = String(value || '');
    if (str.length <= length) return new Handlebars.SafeString(str);
    return new Handlebars.SafeString(str.substring(0, length) + '...');
  });

  // Helper para operações matemáticas
  Handlebars.registerHelper('math', function(lvalue: any, operator: string, rvalue: any) {
    const left = parseFloat(lvalue) || 0;
    const right = parseFloat(rvalue) || 0;
    
    switch (operator) {
      case '+': return left + right;
      case '-': return left - right;
      case '*': return left * right;
      case '/': return right !== 0 ? left / right : 0;
      case '%': return right !== 0 ? left % right : 0;
      default: return 0;
    }
  });

  // Helper para comparações
  Handlebars.registerHelper('compare', function(this: any, lvalue: any, operator: string, rvalue: any, options: any) {
    let result = false;
    
    switch (operator) {
      case '==': result = lvalue == rvalue; break;
      case '===': result = lvalue === rvalue; break;
      case '!=': result = lvalue != rvalue; break;
      case '!==': result = lvalue !== rvalue; break;
      case '<': result = lvalue < rvalue; break;
      case '>': result = lvalue > rvalue; break;
      case '<=': result = lvalue <= rvalue; break;
      case '>=': result = lvalue >= rvalue; break;
      default: result = false;
    }
    
    return result ? options.fn(this) : options.inverse(this);
  });

  // Helper para loop com índice
  Handlebars.registerHelper('eachWithIndex', function(array: any[], options: any) {
    if (!Array.isArray(array)) return '';
    
    let result = '';
    for (let i = 0; i < array.length; i++) {
      result += options.fn({
        ...array[i],
        index: i,
        first: i === 0,
        last: i === array.length - 1,
        even: i % 2 === 0,
        odd: i % 2 === 1
      });
    }
    return new Handlebars.SafeString(result);
  });

  // Helper para formatação de telefone brasileiro
  Handlebars.registerHelper('phone', function(value: any) {
    const phone = String(value || '').replace(/\D/g, '');
    if (phone.length === 11) {
      return new Handlebars.SafeString(`(${phone.substring(0, 2)}) ${phone.substring(2, 7)}-${phone.substring(7)}`);
    } else if (phone.length === 10) {
      return new Handlebars.SafeString(`(${phone.substring(0, 2)}) ${phone.substring(2, 6)}-${phone.substring(6)}`);
    }
    return new Handlebars.SafeString(phone);
  });

  // Helper para formatação de CPF
  Handlebars.registerHelper('cpf', function(value: any) {
    const cpf = String(value || '').replace(/\D/g, '');
    if (cpf.length === 11) {
      return new Handlebars.SafeString(`${cpf.substring(0, 3)}.${cpf.substring(3, 6)}.${cpf.substring(6, 9)}-${cpf.substring(9)}`);
    }
    return new Handlebars.SafeString(cpf);
  });

  // Helper para formatação de CNPJ
  Handlebars.registerHelper('cnpj', function(value: any) {
    const cnpj = String(value || '').replace(/\D/g, '');
    if (cnpj.length === 14) {
      return new Handlebars.SafeString(`${cnpj.substring(0, 2)}.${cnpj.substring(2, 5)}.${cnpj.substring(5, 8)}/${cnpj.substring(8, 12)}-${cnpj.substring(12)}`);
    }
    return new Handlebars.SafeString(cnpj);
  });

  // Helper para formatação de CEP
  Handlebars.registerHelper('cep', function(value: any) {
    const cep = String(value || '').replace(/\D/g, '');
    if (cep.length === 8) {
      return new Handlebars.SafeString(`${cep.substring(0, 5)}-${cep.substring(5)}`);
    }
    return new Handlebars.SafeString(cep);
  });

  // Helper para somar valores de array
  Handlebars.registerHelper('sum', function(array: any[], property?: string) {
    if (!Array.isArray(array)) return 0;
    
    return array.reduce((sum, item) => {
      const value = property ? item[property] : item;
      const num = parseFloat(String(value).replace(/[^\d.-]/g, '')) || 0;
      return sum + num;
    }, 0);
  });

  // Helper para média de valores
  Handlebars.registerHelper('average', function(array: any[], property?: string) {
    if (!Array.isArray(array) || array.length === 0) return 0;
    
    const sum = array.reduce((sum, item) => {
      const value = property ? item[property] : item;
      const num = parseFloat(String(value).replace(/[^\d.-]/g, '')) || 0;
      return sum + num;
    }, 0);
    
    return sum / array.length;
  });

  // Helper para contagem
  Handlebars.registerHelper('count', function(array: any[]) {
    return Array.isArray(array) ? array.length : 0;
  });

  // Helper para debug (útil para desenvolvimento)
  Handlebars.registerHelper('debug', function(value: any) {
    console.log('Handlebars Debug:', value);
    return '';
  });
}

// Função para processar template com Handlebars
function processTemplate(htmlContent: string, data: any): string {
  try {
    // Configurar Handlebars na primeira execução
    setupHandlebars();
    
    // Compilar template
    const template = Handlebars.compile(htmlContent);
    
    // Processar com dados
    return template(data);
  } catch (error) {
    console.error('Erro ao processar template:', error);
    return `<div style="color: red; padding: 20px; border: 1px solid red;">
      <h3>Erro no Template</h3>
      <p>${error instanceof Error ? error.message : 'Erro desconhecido'}</p>
      <p>Verifique a sintaxe do seu template Handlebars.</p>
    </div>`;
  }
}

// Função para gerar PDF
// Função para gerar PDF usando Puppeteer + Browserless
async function generatePDFWithBrowserless(
  fullHtml: string,
  options: any,
  browserlessToken: string
): Promise<Buffer> {
  // Importar puppeteer-core dinamicamente
  const puppeteer = await import('puppeteer-core');
  
  let browser;
  try {
    // Conectar ao Browserless via WebSocket (nova URL)
    browser = await puppeteer.default.connect({
      browserWSEndpoint: `wss://production-sfo.browserless.io?token=${browserlessToken}`,
    });

    const page = await browser.newPage();
    
    // Configurar viewport
    await page.setViewport({ 
      width: 1920, 
      height: 1080 
    });

    // Definir o conteúdo HTML
    await page.setContent(fullHtml, {
      waitUntil: 'domcontentloaded',
      timeout: 15000,
    });

    // Aguardar um tempo para garantir o carregamento
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Gerar PDF com opções
    const pdfBuffer = await page.pdf({
      format: (options.pageSize || 'A4') as any,
      landscape: options.orientation === 'landscape',
      margin: {
        top: options.margins?.top || '1cm',
        right: options.margins?.right || '1cm',
        bottom: options.margins?.bottom || '1cm',
        left: options.margins?.left || '1cm',
      },
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: false,
      scale: 1,
    });

    console.log('PDF gerado com sucesso via Puppeteer + Browserless:', pdfBuffer.length, 'bytes');
    return Buffer.from(pdfBuffer);

  } catch (error) {
    console.error('Erro ao gerar PDF via Puppeteer + Browserless:', error);
    throw new Error(`Erro ao gerar PDF: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Função para gerar PDF local básico (sem Browserless)
async function generatePDFLocal(
  fullHtml: string,
  options: any,
  title: string
): Promise<Buffer> {
  console.log('Gerando PDF local básico...');
  
  // Usar jsPDF para gerar um PDF básico com as informações principais
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({
    orientation: options.orientation === 'landscape' ? 'l' : 'p',
    unit: 'mm',
    format: options.pageSize?.toLowerCase() || 'a4'
  });

  // Adicionar título
  doc.setFontSize(20);
  doc.text(title, 20, 30);
  
  // Adicionar data de geração
  doc.setFontSize(12);
  const dataGeracao = new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  doc.text(`Gerado em: ${dataGeracao}`, 20, 45);

  // Adicionar aviso sobre limitações
  doc.setFontSize(10);
  doc.text('⚠️  PDF gerado em modo básico (sem token Browserless)', 20, 60);
  doc.text('Para PDFs completos com renderização HTML/CSS:', 20, 70);
  doc.text('Configure BROWSERLESS_TOKEN (veja ENVIRONMENT.md)', 20, 80);

  // Extrair texto básico do HTML (remover tags)
  const textoSimples = fullHtml
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 2000); // Limitar tamanho

  doc.setFontSize(9);
  const linhas = doc.splitTextToSize(textoSimples, 170);
  doc.text(linhas, 20, 100);

  // Adicionar rodapé
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(`Página ${i} de ${totalPages} - NextReport (Modo Básico)`, 20, 280);
  }

  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  console.log('PDF local básico gerado:', pdfBuffer.length, 'bytes');
  
  return pdfBuffer;
}

// Função para gerar PDF usando API fetch (fallback)
async function generatePDFWithFetch(
  fullHtml: string,
  options: any,
  browserlessToken: string
): Promise<Buffer> {
  const payload = {
    html: fullHtml,
    options: {
      format: options.pageSize || 'A4',
      landscape: options.orientation === 'landscape',
      margin: {
        top: options.margins?.top || '1cm',
        right: options.margins?.right || '1cm',
        bottom: options.margins?.bottom || '1cm',
        left: options.margins?.left || '1cm',
      },
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: false,
      scale: 1,
    },
    gotoOptions: {
      waitUntil: 'domcontentloaded',
      timeout: 15000,
    },
  };

  console.log('Gerando PDF via Browserless API...');
  
  const browserlessUrl = `https://production-sfo.browserless.io/pdf?token=${browserlessToken}`;
  
  const response = await fetch(browserlessUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Erro do Browserless API:', response.status, errorText);
    throw new Error(`Erro ao gerar PDF: ${response.status} - ${errorText}`);
  }

  const pdfBuffer = await response.arrayBuffer();
  console.log('PDF gerado com sucesso via Browserless API:', pdfBuffer.byteLength, 'bytes');
  
  return Buffer.from(pdfBuffer);
}

async function generatePDF(
  data: Record<string, any>,
  template: { html: string; css: string },
  options: any,
  title: string
): Promise<Buffer> {
  const browserlessToken = process.env.BROWSERLESS_TOKEN;
  
  // Processar template
  const processedHtml = processTemplate(template.html, data);
  
  // HTML completo com CSS otimizado para PDF
  const fullHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          @page {
            size: ${options.pageSize || 'A4'};
            margin: ${options.margins?.top || '1cm'} ${options.margins?.right || '1cm'} ${options.margins?.bottom || '1cm'} ${options.margins?.left || '1cm'};
          }
          
          body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 0;
            color: #333;
            line-height: 1.4;
            font-size: 12px;
          }
          
          h1 { 
            color: #2c3e50; 
            font-size: 24px; 
            margin-bottom: 20px;
            page-break-after: avoid;
          }
          
          h2 { 
            color: #34495e; 
            font-size: 18px; 
            margin-top: 25px;
            margin-bottom: 15px;
            page-break-after: avoid;
          }
          
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 15px 0;
            page-break-inside: avoid;
          }
          
          th, td { 
            border: 1px solid #ddd; 
            padding: 8px; 
            text-align: left;
            font-size: 11px;
          }
          
          th { 
            background-color: #f8f9fa; 
            font-weight: bold;
          }
          
          .page-break { 
            page-break-before: always; 
          }
          
          .no-break { 
            page-break-inside: avoid; 
          }
          
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #3498db;
            padding-bottom: 20px;
          }
          
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 10px;
            color: #666;
          }
          
          ${template.css}
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${title}</h1>
          <p>Gerado em: ${new Date().toLocaleString('pt-BR', {
            timeZone: 'America/Sao_Paulo',
            day: '2-digit',
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
        </div>
        
        ${processedHtml}
        
        <div class="footer">
          <p>Relatório gerado automaticamente pelo NextReport</p>
        </div>
      </body>
    </html>
  `;

  // Se não tiver token, tentar geração local básica
  if (!browserlessToken) {
    console.warn('BROWSERLESS_TOKEN não configurado, tentando geração local...');
    return await generatePDFLocal(fullHtml, options, title);
  }

  // Tentar usar Puppeteer primeiro, com fallback para API fetch, e depois modo local
  try {
    console.log('Tentando gerar PDF via Puppeteer + Browserless...');
    return await generatePDFWithBrowserless(fullHtml, options, browserlessToken);
  } catch (error) {
    console.warn('Erro com Puppeteer, tentando API fetch:', error);
    try {
      return await generatePDFWithFetch(fullHtml, options, browserlessToken);
    } catch (fetchError) {
      console.warn('Erro com API fetch, tentando modo local básico:', fetchError);
      try {
        return await generatePDFLocal(fullHtml, options, title);
      } catch (localError) {
        console.error('Erro com todas as implementações:', localError);
        throw new Error(`Erro ao gerar PDF: ${localError instanceof Error ? localError.message : 'Erro desconhecido'}`);
      }
    }
  }
}

// Função para gerar Excel
async function generateExcel(
  data: Record<string, any>,
  format: 'xlsx' | 'xls',
  title: string
): Promise<Buffer> {
  const wb = XLSX.utils.book_new();

  // Criar planilha principal mais organizada
  const mainSheetData = [];
  
  // Cabeçalho principal com design melhorado
  mainSheetData.push([title.toUpperCase()]);
  mainSheetData.push(['']);
  mainSheetData.push(['📊 RELATÓRIO DETALHADO']);
  mainSheetData.push(['Gerado em:', new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })]);
  mainSheetData.push(['']);

  // Separar dados por tipo
  const simpleData: [string, any][] = [];
  const arrayData: [string, any[]][] = [];
  const objectData: [string, any][] = [];

  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      arrayData.push([key, value]);
    } else if (typeof value === 'object' && value !== null) {
      objectData.push([key, value]);
    } else {
      simpleData.push([key, value]);
    }
  });

  // Seção de informações gerais melhorada
  if (simpleData.length > 0) {
    mainSheetData.push(['📋 INFORMAÇÕES GERAIS']);
    mainSheetData.push(['']);
    mainSheetData.push(['Campo', 'Valor', 'Tipo']);
    simpleData.forEach(([key, value]) => {
      mainSheetData.push([
        formatFieldName(key), 
        formatValue(value),
        getDataType(value)
      ]);
    });
    mainSheetData.push(['']);
    
    // Adicionar estatísticas básicas
    const numericValues = simpleData.filter(([_, value]) => !isNaN(Number(value))).map(([_, value]) => Number(value));
    if (numericValues.length > 0) {
      mainSheetData.push(['📊 ESTATÍSTICAS NUMÉRICAS']);
      mainSheetData.push(['']);
      mainSheetData.push(['Métrica', 'Valor']);
      mainSheetData.push(['Total de campos numéricos', numericValues.length]);
      mainSheetData.push(['Soma total', numericValues.reduce((a, b) => a + b, 0).toFixed(2)]);
      mainSheetData.push(['Média', (numericValues.reduce((a, b) => a + b, 0) / numericValues.length).toFixed(2)]);
      mainSheetData.push(['Valor máximo', Math.max(...numericValues).toFixed(2)]);
      mainSheetData.push(['Valor mínimo', Math.min(...numericValues).toFixed(2)]);
      mainSheetData.push(['']);
    }
  }

  // Seção de dados estruturados melhorada
  if (objectData.length > 0) {
    mainSheetData.push(['🏗️ DADOS ESTRUTURADOS']);
    mainSheetData.push(['']);
    objectData.forEach(([key, obj]) => {
      mainSheetData.push([`📁 ${formatFieldName(key)}`]);
      mainSheetData.push(['Propriedade', 'Valor', 'Tipo']);
      Object.entries(obj).forEach(([subKey, subValue]) => {
        mainSheetData.push([
          formatFieldName(subKey), 
          formatValue(subValue),
          getDataType(subValue)
        ]);
      });
      mainSheetData.push(['']);
    });
  }

  // Resumo de arrays melhorado
  if (arrayData.length > 0) {
    mainSheetData.push(['📋 RESUMO DE LISTAS']);
    mainSheetData.push(['']);
    mainSheetData.push(['Lista', 'Quantidade', 'Tipo de Dados', 'Amostra']);
    arrayData.forEach(([key, arr]) => {
      const sample = arr.length > 0 ? 
        (typeof arr[0] === 'object' ? 
          Object.keys(arr[0]).join(', ') : 
          String(arr[0])) : 'Vazio';
      mainSheetData.push([
        formatFieldName(key), 
        arr.length,
        arr.length > 0 ? getDataType(arr[0]) : 'Indefinido',
        sample
      ]);
    });
    mainSheetData.push(['']);
  }

  // Criar planilha principal com formatação
  const mainSheet = XLSX.utils.aoa_to_sheet(mainSheetData);
  
  // Aplicar formatação avançada à planilha principal
  formatSheetAdvanced(mainSheet, mainSheetData);
  XLSX.utils.book_append_sheet(wb, mainSheet, '📊 Resumo Executivo');

  // Criar planilhas separadas para cada array
  arrayData.forEach(([key, arr]) => {
    if (arr.length === 0) return;

    const sheetName = formatFieldName(key).substring(0, 31);
    
    if (typeof arr[0] === 'object' && arr[0] !== null) {
      // Array de objetos - criar tabela estruturada
      const headers = Object.keys(arr[0]);
      const formattedHeaders = headers.map(h => formatFieldName(h));
      
      const sheetData = [
        [formatFieldName(key)],
        [],
        formattedHeaders
      ];
      
      arr.forEach((item: any) => {
        const row = headers.map(header => formatValue(item[header]));
        sheetData.push(row);
      });

      // Adicionar linha de totais se houver campos numéricos
      const numericColumns = headers.filter(header => 
        arr.some((item: any) => typeof item[header] === 'number')
      );
      
      if (numericColumns.length > 0) {
        sheetData.push([]);
        const totalRow = headers.map(header => {
          if (numericColumns.includes(header)) {
            const sum = arr.reduce((acc: number, item: any) => {
              const val = parseFloat(String(item[header]).replace(/[^\d.-]/g, '')) || 0;
              return acc + val;
            }, 0);
            return `Total: ${sum.toLocaleString('pt-BR')}`;
          }
          return header === headers[0] ? 'TOTAIS:' : '';
        });
        sheetData.push(totalRow);
      }

      const sheet = XLSX.utils.aoa_to_sheet(sheetData);
      formatSheet(sheet, sheetData);
      XLSX.utils.book_append_sheet(wb, sheet, sheetName);
      
    } else {
      // Array simples - criar lista
      const sheetData = [
        [formatFieldName(key)],
        [],
        ['#', 'Item']
      ];
      
             arr.forEach((item: any, index: number) => {
         sheetData.push([(index + 1).toString(), formatValue(item)]);
       });

      const sheet = XLSX.utils.aoa_to_sheet(sheetData);
      formatSheet(sheet, sheetData);
      XLSX.utils.book_append_sheet(wb, sheet, sheetName);
    }
  });

  const buffer = XLSX.write(wb, { 
    bookType: format as any,
    type: 'buffer',
    compression: true 
  });

  return Buffer.from(buffer);
}

// Função para determinar o tipo de dados
function getDataType(value: any): string {
  if (value === null || value === undefined) return 'Nulo';
  if (typeof value === 'boolean') return 'Booleano';
  if (typeof value === 'number') return 'Número';
  if (typeof value === 'string') {
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) return 'Data';
    if (/^\d+(\.\d+)?$/.test(value)) return 'Número (texto)';
    if (value.includes('@')) return 'Email';
    if (value.length > 100) return 'Texto longo';
    return 'Texto';
  }
  if (Array.isArray(value)) return `Array (${value.length} itens)`;
  if (typeof value === 'object') return 'Objeto';
  return 'Desconhecido';
}

// Função auxiliar para formatar nomes de campos
function formatFieldName(name: string): string {
  return name
    .replace(/([A-Z])/g, ' $1') // Separar camelCase
    .replace(/[_-]/g, ' ') // Substituir _ e - por espaços
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim();
}

// Função auxiliar para formatar valores
function formatValue(value: any): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'boolean') return value ? 'Sim' : 'Não';
  if (typeof value === 'number') {
    // Se parece ser um valor monetário (tem decimais ou é grande)
    if (value % 1 !== 0 || value > 1000) {
      return value.toLocaleString('pt-BR', { 
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 
      });
    }
    return value.toLocaleString('pt-BR');
  }
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

// Função de formatação avançada para planilhas
function formatSheetAdvanced(sheet: any, data: any[][]) {
  const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1');
  
  // Definir larguras das colunas de forma mais inteligente
  const colWidths = [];
  for (let col = range.s.c; col <= range.e.c; col++) {
    let maxWidth = 12;
    for (let row = range.s.r; row <= range.e.r; row++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
      const cell = sheet[cellAddress];
      if (cell && cell.v) {
        const cellLength = String(cell.v).length;
        maxWidth = Math.max(maxWidth, cellLength + 4);
      }
    }
    colWidths.push({ wch: Math.min(maxWidth, 60) });
  }
  sheet['!cols'] = colWidths;

  // Aplicar formatação às células com design moderno
  for (let row = range.s.r; row <= range.e.r; row++) {
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
      const cell = sheet[cellAddress];
      
      if (cell) {
        const cellValue = String(cell.v || '');
        
        // Título principal
        if (row === 0) {
          cell.s = {
            font: { bold: true, size: 16, color: { rgb: 'FFFFFF' } },
            fill: { fgColor: { rgb: '1F4E79' } },
            alignment: { horizontal: 'center', vertical: 'center' }
          };
        }
        // Subtítulo com emoji
        else if (cellValue.includes('📊 RELATÓRIO')) {
          cell.s = {
            font: { bold: true, size: 14, color: { rgb: '1F4E79' } },
            fill: { fgColor: { rgb: 'E7F3FF' } },
            alignment: { horizontal: 'center' }
          };
        }
        // Seções principais (com emojis)
        else if (cellValue.includes('📋') || cellValue.includes('🏗️') || cellValue.includes('📊')) {
          cell.s = {
            font: { bold: true, size: 12, color: { rgb: 'FFFFFF' } },
            fill: { fgColor: { rgb: '2E8B57' } },
            alignment: { horizontal: 'left', vertical: 'center' }
          };
        }
        // Cabeçalhos de tabela
        else if ((cellValue === 'Campo' || cellValue === 'Lista' || cellValue === 'Propriedade' || cellValue === 'Métrica') && col === 0) {
          cell.s = {
            font: { bold: true, color: { rgb: '1F4E79' } },
            fill: { fgColor: { rgb: 'B4D7FF' } },
            alignment: { horizontal: 'center' },
            border: {
              top: { style: 'medium', color: { rgb: '1F4E79' } },
              bottom: { style: 'medium', color: { rgb: '1F4E79' } },
              left: { style: 'thin', color: { rgb: '1F4E79' } },
              right: { style: 'thin', color: { rgb: '1F4E79' } }
            }
          };
        }
        // Outras células de cabeçalho
        else if (data[row] && data[row][0] && 
                 (data[row][0] === 'Campo' || data[row][0] === 'Lista' || data[row][0] === 'Propriedade' || data[row][0] === 'Métrica')) {
          cell.s = {
            font: { bold: true, color: { rgb: '1F4E79' } },
            fill: { fgColor: { rgb: 'B4D7FF' } },
            alignment: { horizontal: 'center' },
            border: {
              top: { style: 'medium', color: { rgb: '1F4E79' } },
              bottom: { style: 'medium', color: { rgb: '1F4E79' } },
              left: { style: 'thin', color: { rgb: '1F4E79' } },
              right: { style: 'thin', color: { rgb: '1F4E79' } }
            }
          };
        }
        // Dados com formatação alternada
        else if (row > 0 && cellValue !== '' && !cellValue.includes('📁')) {
          const isEvenRow = row % 2 === 0;
          cell.s = {
            fill: { fgColor: { rgb: isEvenRow ? 'F8F9FA' : 'FFFFFF' } },
            border: {
              top: { style: 'thin', color: { rgb: 'E0E0E0' } },
              bottom: { style: 'thin', color: { rgb: 'E0E0E0' } },
              left: { style: 'thin', color: { rgb: 'E0E0E0' } },
              right: { style: 'thin', color: { rgb: 'E0E0E0' } }
            },
            alignment: { vertical: 'center' }
          };
          
          // Formatação especial para números
          if (!isNaN(Number(cellValue)) && cellValue !== '') {
            cell.s.alignment = { horizontal: 'right', vertical: 'center' };
            cell.s.numFmt = '#,##0.00';
          }
        }
        // Subseções com pasta
        else if (cellValue.includes('📁')) {
          cell.s = {
            font: { bold: true, italic: true, color: { rgb: '4A90E2' } },
            fill: { fgColor: { rgb: 'F0F8FF' } },
            alignment: { horizontal: 'left' }
          };
        }
      }
    }
  }
}

// Função auxiliar para aplicar formatação às planilhas
function formatSheet(sheet: any, data: any[][]) {
  const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1');
  
  // Definir larguras das colunas
  const colWidths: any[] = [];
  for (let col = 0; col <= range.e.c; col++) {
    let maxWidth = 10;
    for (let row = 0; row <= range.e.r; row++) {
      const cellValue = data[row] && data[row][col] ? String(data[row][col]) : '';
      maxWidth = Math.max(maxWidth, cellValue.length);
    }
    colWidths.push({ width: Math.min(maxWidth + 2, 50) });
  }
  sheet['!cols'] = colWidths;

  // Aplicar formatação a células específicas
  for (let row = 0; row <= range.e.r; row++) {
    for (let col = 0; col <= range.e.c; col++) {
      const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
      if (!sheet[cellRef]) continue;
      
      // Primeira linha (título) - negrito e maior
      if (row === 0) {
        sheet[cellRef].s = {
          font: { bold: true, size: 14 },
          alignment: { horizontal: 'center' }
        };
      }
      // Cabeçalhos de seção - negrito
      else if (data[row] && data[row][col] && 
               (String(data[row][col]).includes('INFORMAÇÕES') || 
                String(data[row][col]).includes('DADOS') ||
                String(data[row][col]).includes('RESUMO') ||
                String(data[row][col]).includes('TOTAIS'))) {
        sheet[cellRef].s = {
          font: { bold: true },
          fill: { fgColor: { rgb: 'E6E6FA' } }
        };
      }
      // Cabeçalhos de tabela
      else if (row > 0 && data[row-1] && data[row-1][0] === '' && 
               data[row] && data[row].every(cell => cell !== '')) {
        sheet[cellRef].s = {
          font: { bold: true },
          fill: { fgColor: { rgb: 'F0F0F0' } },
          border: {
            bottom: { style: 'thin', color: { rgb: '000000' } }
          }
        };
      }
    }
  }
} 