import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireApiKey } from '@/lib/auth';

// Schema de validação para as opções de screenshot
const screenshotOptionsSchema = z.object({
  width: z.number().min(100).max(4000).optional().default(1280),
  height: z.number().min(100).max(4000).optional().default(720),
  fullPage: z.boolean().optional().default(false),
  format: z.enum(['png', 'jpeg', 'webp']).optional().default('png'),
  quality: z.number().min(1).max(100).optional().default(80),
  deviceScaleFactor: z.number().min(0.1).max(3).optional().default(1),
  mobile: z.boolean().optional().default(false),
  timeout: z.number().min(1000).max(60000).optional().default(30000),
});

// Schema de validação para a requisição
const screenshotRequestSchema = z.object({
  url: z.string().url().optional(),
  html: z.string().optional(),
  css: z.string().optional(),
  options: screenshotOptionsSchema.optional().default({}),
}).refine(data => data.url || data.html, {
  message: "É necessário fornecer 'url' ou 'html'",
});

type ScreenshotRequest = z.infer<typeof screenshotRequestSchema>;

// Função para fazer screenshot usando Browserless
async function takeScreenshotWithBrowserless(request: ScreenshotRequest): Promise<Buffer> {
  const browserlessToken = process.env.BROWSERLESS_TOKEN;
  
  if (!browserlessToken) {
    throw new Error('BROWSERLESS_TOKEN não configurado');
  }

  const { url, html, css, options } = request;
  
  // Preparar o payload para o Browserless
  const payload: any = {
    options: {
      fullPage: options.fullPage,
      type: options.format,
      quality: options.format === 'jpeg' ? options.quality : undefined,
      clip: options.fullPage ? undefined : {
        x: 0,
        y: 0,
        width: options.width,
        height: options.height,
      },
    },
    viewport: {
      width: options.width,
      height: options.height,
      deviceScaleFactor: options.deviceScaleFactor,
      isMobile: options.mobile,
    },
    waitFor: 1000, // Aguardar 1 segundo para garantir que a página carregou
  };

  // Se for URL, usar diretamente
  if (url) {
    payload.url = url;
  } 
  // Se for HTML customizado, usar o endpoint de content
  else if (html) {
    payload.html = html;
    if (css) {
      // Injetar CSS no HTML
      const htmlWithCss = html.includes('<head>') 
        ? html.replace('<head>', `<head><style>${css}</style>`)
        : `<style>${css}</style>${html}`;
      payload.html = htmlWithCss;
    }
  }

  // Fazer requisição para o Browserless (nova URL)
  const browserlessUrl = `https://production-sfo.browserless.io/screenshot?token=${browserlessToken}`;
  
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
    throw new Error(`Erro do Browserless: ${response.status} - ${errorText}`);
  }

  const imageBuffer = await response.arrayBuffer();
  return Buffer.from(imageBuffer);
}

// Função para fazer screenshot usando Puppeteer + Browserless
async function takeScreenshotLocal(request: ScreenshotRequest): Promise<Buffer> {
  const browserlessToken = process.env.BROWSERLESS_TOKEN;
  
  if (!browserlessToken) {
    throw new Error('BROWSERLESS_TOKEN não configurado');
  }

  const { url, html, css, options } = request;
  
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
      width: options.width,
      height: options.height,
      deviceScaleFactor: options.deviceScaleFactor,
      isMobile: options.mobile,
    });

    // Carregar conteúdo
    if (url) {
      await page.goto(url, {
        waitUntil: 'networkidle0',
        timeout: options.timeout,
      });
    } else if (html) {
      // Preparar HTML com CSS
      let fullHtml = html;
      if (css) {
        fullHtml = html.includes('<head>') 
          ? html.replace('<head>', `<head><style>${css}</style>`)
          : `<style>${css}</style>${html}`;
      }
      
      await page.setContent(fullHtml, {
        waitUntil: 'networkidle0',
        timeout: options.timeout,
      });
    }

    // Capturar screenshot
    const screenshotBuffer = await page.screenshot({
      type: options.format as any,
      quality: options.format === 'jpeg' ? options.quality : undefined,
      fullPage: options.fullPage,
      clip: options.fullPage ? undefined : {
        x: 0,
        y: 0,
        width: options.width,
        height: options.height,
      },
    });

    return Buffer.from(screenshotBuffer);

  } catch (error) {
    console.error('Erro ao gerar screenshot via Puppeteer:', error);
    throw new Error(`Erro ao gerar screenshot: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'API de Screenshot - NextReport',
    version: '1.0.0',
    endpoints: {
      POST: '/api/v1/screenshot',
    },
    description: 'Gera screenshots de URLs ou HTML customizado',
    parameters: {
      url: 'URL da página para capturar (opcional se html for fornecido)',
      html: 'HTML customizado para renderizar (opcional se url for fornecida)',
      css: 'CSS customizado para aplicar ao HTML (opcional)',
      options: {
        width: 'Largura da viewport (padrão: 1280)',
        height: 'Altura da viewport (padrão: 720)',
        fullPage: 'Capturar página inteira (padrão: false)',
        format: 'Formato da imagem: png, jpeg, webp (padrão: png)',
        quality: 'Qualidade da imagem para JPEG (1-100, padrão: 80)',
        deviceScaleFactor: 'Fator de escala do dispositivo (padrão: 1)',
        mobile: 'Simular dispositivo móvel (padrão: false)',
        timeout: 'Timeout em ms (padrão: 30000)',
      },
    },
    examples: {
      url_screenshot: {
        url: 'https://example.com',
        options: {
          width: 1920,
          height: 1080,
          fullPage: true,
          format: 'png',
        },
      },
      html_screenshot: {
        html: '<h1>Hello World</h1><p>Este é um teste</p>',
        css: 'body { font-family: Arial; background: #f0f0f0; }',
        options: {
          width: 800,
          height: 600,
          format: 'jpeg',
          quality: 90,
        },
      },
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    // Validar API Key
    const authError = await requireApiKey(request);
    if (authError) {
      return authError;
    }

    // Parse e validação do corpo da requisição
    const body = await request.json();
    const validatedData = screenshotRequestSchema.parse(body);

    console.log('Gerando screenshot:', {
      url: validatedData.url,
      hasHtml: !!validatedData.html,
      options: validatedData.options,
    });

    // Gerar screenshot
    const imageBuffer = process.env.NODE_ENV === 'development' && process.env.USE_LOCAL_PUPPETEER === 'true'
      ? await takeScreenshotLocal(validatedData)
      : await takeScreenshotWithBrowserless(validatedData);

    // Determinar content-type baseado no formato
    const contentType = `image/${validatedData.options.format}`;
    
    // Gerar nome do arquivo
    const timestamp = Date.now();
    const filename = `screenshot-${timestamp}.${validatedData.options.format}`;

    console.log('Screenshot gerado com sucesso:', {
      size: imageBuffer.length,
      format: validatedData.options.format,
      filename,
    });

    // Retornar a imagem
    return new NextResponse(imageBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': imageBuffer.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

  } catch (error) {
    console.error('Erro ao gerar screenshot:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Dados de entrada inválidos',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
} 