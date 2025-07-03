import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireApiKey } from '@/lib/auth';
import * as XLSX from 'xlsx';
import puppeteer from 'puppeteer';

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
  const authError = requireApiKey(request);
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

// Função para processar template
function processTemplate(htmlContent: string, data: any): string {
  let processedHtml = htmlContent;

  // Substituir variáveis simples
  Object.keys(data).forEach((key) => {
    if (typeof data[key] !== 'object' || data[key] === null) {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      processedHtml = processedHtml.replace(regex, String(data[key] || ''));
    }
  });

  // Processar loops
  const eachRegex = /{{#each\s+(\w+)}}([\s\S]*?){{\/each}}/g;
  processedHtml = processedHtml.replace(eachRegex, (match, arrayName, template) => {
    const array = data[arrayName];
    if (!Array.isArray(array)) return '';

    return array.map((item, index) => {
      let itemTemplate = template;
      Object.keys(item).forEach((key) => {
        const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
        itemTemplate = itemTemplate.replace(regex, String(item[key]));
      });
      itemTemplate = itemTemplate.replace(/{{@index}}/g, String(index));
      return itemTemplate;
    }).join('');
  });

  // Processar condicionais
  const ifRegex = /{{#if\s+(\w+)}}([\s\S]*?){{\/if}}/g;
  processedHtml = processedHtml.replace(ifRegex, (match, condition, content) => {
    return data[condition] ? content : '';
  });

  return processedHtml;
}

// Função para gerar PDF
async function generatePDF(
  data: Record<string, any>,
  template: { html: string; css: string },
  options: any,
  title: string
): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor'
    ],
  });

  try {
    const page = await browser.newPage();
    
    // Processar template
    const processedHtml = processTemplate(template.html, data);
    
    // HTML completo com CSS
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${title}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 20px;
              color: #333;
            }
            ${template.css}
          </style>
        </head>
        <body>
          ${processedHtml}
        </body>
      </html>
    `;

    await page.setContent(fullHtml, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: options.pageSize as any,
      landscape: options.orientation === 'landscape',
      margin: {
        top: options.margins?.top || '1cm',
        right: options.margins?.right || '1cm',
        bottom: options.margins?.bottom || '1cm',
        left: options.margins?.left || '1cm',
      },
      printBackground: true,
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
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
  
  // Cabeçalho principal
  mainSheetData.push([title]);
  mainSheetData.push(['Relatório gerado em:', new Date().toLocaleString('pt-BR')]);
  mainSheetData.push([]);

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

  // Adicionar dados simples na planilha principal
  if (simpleData.length > 0) {
    mainSheetData.push(['INFORMAÇÕES GERAIS']);
    mainSheetData.push(['Campo', 'Valor']);
    simpleData.forEach(([key, value]) => {
      mainSheetData.push([formatFieldName(key), formatValue(value)]);
    });
    mainSheetData.push([]);
  }

  // Adicionar objetos simples na planilha principal
  if (objectData.length > 0) {
    mainSheetData.push(['DADOS ESTRUTURADOS']);
    objectData.forEach(([key, obj]) => {
      mainSheetData.push([formatFieldName(key)]);
      Object.entries(obj).forEach(([subKey, subValue]) => {
        mainSheetData.push(['  ' + formatFieldName(subKey), formatValue(subValue)]);
      });
      mainSheetData.push([]);
    });
  }

  // Resumo de arrays
  if (arrayData.length > 0) {
    mainSheetData.push(['RESUMO DE LISTAS']);
    mainSheetData.push(['Lista', 'Quantidade de Itens']);
    arrayData.forEach(([key, arr]) => {
             mainSheetData.push([formatFieldName(key), arr.length.toString()]);
    });
  }

  // Criar planilha principal com formatação
  const mainSheet = XLSX.utils.aoa_to_sheet(mainSheetData);
  
  // Aplicar formatação à planilha principal
  formatSheet(mainSheet, mainSheetData);
  XLSX.utils.book_append_sheet(wb, mainSheet, 'Resumo');

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