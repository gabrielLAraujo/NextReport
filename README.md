# 📊 NextReport - Report Generator

**NextReport** is a complete report generation service that allows creating PDF, XLSX and XLS documents through customizable HTML templates and JSON data.

## 🚀 **Live Demo**

🔗 **[https://nextreport.vercel.app](https://nextreport.vercel.app)**

## ✨ **Key Features**

- 📝 **HTML Templates**: Create custom templates with Handlebars-like syntax
- 📊 **Multiple Formats**: Generate reports in PDF, XLSX and XLS
- 🔍 **Real-time Preview**: See the result before generating
- 🎨 **Custom CSS**: Style your reports as desired
- 🔐 **External API**: Use as a service through API Keys
- 📖 **Complete Documentation**: Visual interface and Swagger UI
- ⚡ **Fast Processing**: Optimized document generation

## 🛠️ **Technologies Used**

- **Next.js 15** - React Framework
- **TypeScript** - Static typing
- **Tailwind CSS** - Styling
- **Puppeteer** - PDF generation
- **XLSX** - Excel spreadsheet generation
- **Prisma** - Database ORM
- **Zod** - Data validation
- **Vercel** - Deployment and hosting

## 📋 **How to Use**

### Web Interface
1. Access [https://nextreport.vercel.app](https://nextreport.vercel.app)
2. Enter your HTML template in the left area
3. Add JSON data
4. See real-time preview
5. Click **PDF**, **XLSX** or **XLS** to generate

### External API
```bash
curl -X POST https://nextreport.vercel.app/api/v1/reports/generate \
  -H "Content-Type: application/json" \
  -H "X-API-Key: nxr_demo_key_123456789" \
  -d '{
    "title": "My Report",
    "format": "pdf",
    "data": {"name": "John", "age": 30},
    "template": "<h1>Hello {{name}}, you are {{age}} years old!</h1>",
    "styles": "h1 { color: blue; }"
  }'
```

## 🔧 **Local Installation**

```bash
# Clone the repository
git clone https://github.com/your-username/nextreport.git
cd nextreport

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local

# Run the project
npm run dev
```

## 📚 **Documentation**

- **[Complete Documentation](https://nextreport.vercel.app/docs)** - Complete usage guide
- **[Swagger UI](https://nextreport.vercel.app/swagger)** - Interactive API interface

## 🔐 **Authentication**

To use the API, you need an API Key:

```bash
# Demo key
X-API-Key: nxr_demo_key_123456789

# Or via Authorization header
Authorization: Bearer nxr_demo_key_123456789
```

## 📄 **Template Syntax**

```html
<!-- Simple variables -->
<h1>{{title}}</h1>
<p>{{description}}</p>

<!-- Loops -->
{{#each items}}
  <div>{{name}} - {{value}}</div>
{{/each}}

<!-- Conditionals -->
{{#if showSection}}
  <div>This section is conditional</div>
{{/if}}

<!-- Index in loops -->
{{#each products}}
  <p>{{@index}}. {{name}}</p>
{{/each}}
```

## 🎨 **Usage Examples**

### Sales Report
```json
{
  "title": "Sales Report",
  "date": "2024-01-15",
  "sales": [
    {"product": "Laptop", "quantity": 2, "value": 2500.00},
    {"product": "Mouse", "quantity": 10, "value": 25.00}
  ],
  "total": 2750.00
}
```

### Certificate
```html
<div class="certificate">
  <h1>Certificate of Completion</h1>
  <p>We certify that <strong>{{name}}</strong> has completed the <strong>{{course}}</strong> course.</p>
  <p>Date: {{date}}</p>
  <p>Workload: {{workload}} hours</p>
</div>
```

## 🌟 **Advanced Features**

- **Automatic Formatting**: Excel spreadsheets with professional formatting
- **Multiple Sheets**: Data automatically organized
- **Automatic Totals**: Automatic calculations in numeric fields
- **Complete Validation**: Data validation with Zod
- **Error Handling**: Detailed error messages

## 🤝 **Contributing**

1. Fork the project
2. Create a branch for your feature (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## 📝 **License**

This project is under the ISC license. See the `LICENSE` file for more details.

## 🆘 **Support**

- **Documentation**: [https://nextreport.vercel.app/docs](https://nextreport.vercel.app/docs)
- **Issues**: [GitHub Issues](https://github.com/your-username/nextreport/issues)
- **API Reference**: [https://nextreport.vercel.app/swagger](https://nextreport.vercel.app/swagger)

---

**Made with ❤️ using Next.js and TypeScript**
