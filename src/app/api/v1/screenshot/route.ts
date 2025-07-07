import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireApiKey } from '@/lib/auth';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer';

// Configuração para runtime do Node.js
export const config = {
  runtime: 'nodejs',
};

// Schema de validação para requisições da API
const screenshotSchema = z.object({
  url: z.string().url('URL inválida').optional(),
  html: z.string().min(1, 'HTML é obrigatório').optional(),
  css: z.string().optional().default(''),
  options: z.object({
    width: z.number().min(100).max(3840).optional().default(1920),
    height: z.number().min(100).max(2160).optional().default(1080),
    fullPage: z.boolean().optional().default(false),
    quality: z.number().min(0).max(100).optional().default(90),
    format: z.enum(['png', 'jpeg', 'webp']).optional().default('png'),
    deviceScaleFactor: z.number().min(1).max(3).optional().default(1),
    mobile: z.boolean().optional().default(false),
    timeout: z.number().min(1000).max(30000).optional().default(10000),
  }).optional().default({}),
}).refine(data => data.url || data.html, {
  message: 'URL ou HTML deve ser fornecido',
});

export async function POST(request: NextRequest) {
  // Validar API Key
  const authError = await requireApiKey(request);
  if (authError) {
    return authError;
  }

  let browser;
  
  try {
    const body = await request.json();
    
    // Validar dados de entrada
    const validatedData = screenshotSchema.parse(body);
    const { url, html, css, options } = validatedData;

    // Configurar Puppeteer para ambiente serverless
    const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV;
    
    if (isVercel) {
      // Configuração otimizada para Vercel
      try {
        // Primeira tentativa: usar Chromium se disponível
        browser = await puppeteer.launch({
          args: [
            ...chromium.args,
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--disable-extensions',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding',
            '--disable-ipc-flooding-protection',
            '--memory-pressure-off',
            '--max_old_space_size=4096',
          ],
          defaultViewport: {
            width: options.width,
            height: options.height,
            deviceScaleFactor: options.deviceScaleFactor,
            isMobile: options.mobile,
          },
          executablePath: await chromium.executablePath(),
          headless: true,
          timeout: options.timeout,
        });
      } catch (chromiumError) {
        console.log('Chromium falhou na Vercel, tentando Puppeteer padrão:', chromiumError);
        
        // Segunda tentativa: Puppeteer padrão
        try {
          browser = await puppeteer.launch({
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
            defaultViewport: {
              width: options.width,
              height: options.height,
              deviceScaleFactor: options.deviceScaleFactor,
              isMobile: options.mobile,
            },
            timeout: options.timeout,
          });
        } catch (puppeteerError) {
          console.error('Todos os métodos de screenshot falharam na Vercel:', puppeteerError);
          throw new Error('Screenshot não disponível na Vercel no momento.');
        }
      }
    } else {
      // Configuração para ambiente local (desenvolvimento)
      try {
        browser = await puppeteer.launch({
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--disable-gpu',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
          ],
          defaultViewport: {
            width: options.width,
            height: options.height,
            deviceScaleFactor: options.deviceScaleFactor,
            isMobile: options.mobile,
          },
          timeout: options.timeout,
        });
      } catch (error) {
        console.error('Erro ao inicializar Puppeteer local:', error);
        throw new Error('Não foi possível inicializar o navegador para geração de screenshot. Verifique se o Chrome está instalado.');
      }
    }

    const page = await browser.newPage();
    
    // Configurar timeout para navegação
    await page.setDefaultTimeout(options.timeout);
    await page.setDefaultNavigationTimeout(options.timeout);

    // Configurar user agent se for mobile
    if (options.mobile) {
      await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1');
    }

    let screenshotBuffer: Buffer;

    if (url) {
      // Capturar screenshot de URL
      await page.goto(url, { 
        waitUntil: 'networkidle0',
        timeout: options.timeout 
      });
      
      const screenshot = await page.screenshot({
        fullPage: options.fullPage,
        quality: options.format === 'jpeg' ? options.quality : undefined,
        type: options.format as any,
      });
      screenshotBuffer = Buffer.from(screenshot);
    } else if (html) {
      // Capturar screenshot de HTML customizado
      const fullHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Screenshot</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 0; 
                padding: 20px;
                color: #333;
                background: white;
              }
              * {
                box-sizing: border-box;
              }
              ${css}
            </style>
          </head>
          <body>
            ${html}
          </body>
        </html>
      `;

      await page.setContent(fullHtml, { 
        waitUntil: 'networkidle0',
        timeout: options.timeout 
      });
      
      const screenshot = await page.screenshot({
        fullPage: options.fullPage,
        quality: options.format === 'jpeg' ? options.quality : undefined,
        type: options.format as any,
      });
      screenshotBuffer = Buffer.from(screenshot);
    } else {
      throw new Error('URL ou HTML deve ser fornecido');
    }

    // Gerar nome do arquivo
    const timestamp = Date.now();
    const fileName = `screenshot_${timestamp}.${options.format}`;

    // Definir content type
    const contentTypes = {
      png: 'image/png',
      jpeg: 'image/jpeg',
      webp: 'image/webp',
    };

    // Retornar imagem
    return new NextResponse(screenshotBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': contentTypes[options.format],
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': screenshotBuffer.length.toString(),
        'X-Screenshot-ID': timestamp.toString(),
        'X-Generated-At': new Date().toISOString(),
        'X-Screenshot-Format': options.format,
        'X-Screenshot-Size': `${options.width}x${options.height}`,
      },
    });

  } catch (error) {
    console.error('Erro ao gerar screenshot:', error);
    
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
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Método GET para documentação da API
export async function GET() {
  return NextResponse.json({
    name: 'Screenshot API',
    description: 'Gera capturas de tela de URLs ou HTML customizado',
    version: '1.0.0',
    endpoints: {
      POST: {
        description: 'Gera uma captura de tela',
        parameters: {
          url: {
            type: 'string',
            description: 'URL para capturar (opcional se HTML for fornecido)',
            example: 'https://example.com'
          },
          html: {
            type: 'string',
            description: 'HTML customizado para capturar (opcional se URL for fornecida)',
            example: '<div><h1>Olá Mundo</h1></div>'
          },
          css: {
            type: 'string',
            description: 'CSS adicional para aplicar ao HTML',
            example: 'body { background: #f0f0f0; }'
          },
          options: {
            type: 'object',
            description: 'Opções de configuração da captura',
            properties: {
              width: { type: 'number', default: 1920, description: 'Largura da viewport' },
              height: { type: 'number', default: 1080, description: 'Altura da viewport' },
              fullPage: { type: 'boolean', default: false, description: 'Capturar página completa' },
              quality: { type: 'number', default: 90, description: 'Qualidade da imagem (1-100)' },
              format: { type: 'string', default: 'png', description: 'Formato da imagem (png, jpeg, webp)' },
              deviceScaleFactor: { type: 'number', default: 1, description: 'Fator de escala do dispositivo' },
              mobile: { type: 'boolean', default: false, description: 'Simular dispositivo móvel' },
              timeout: { type: 'number', default: 10000, description: 'Timeout em milissegundos' }
            }
          }
        },
        responses: {
          200: {
            description: 'Captura de tela gerada com sucesso',
            contentType: 'image/png | image/jpeg | image/webp'
          },
          400: { description: 'Dados de entrada inválidos' },
          401: { description: 'API Key inválida ou ausente' },
          500: { description: 'Erro interno do servidor' }
        }
      }
    },
    authentication: {
      type: 'API Key',
      header: 'X-API-Key',
      description: 'Chave de API necessária para autenticação'
    }
  });
} 