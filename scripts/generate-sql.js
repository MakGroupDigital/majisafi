#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnv() {
  const envPath = path.join(__dirname, '../.env');
  const env = {};
  
  if (!fs.existsSync(envPath)) {
    console.warn('⚠️ .env file not found');
    return env;
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      env[key.trim()] = valueParts.join('=').trim();
    }
  });
  
  return env;
}

function generateHTML() {
  const env = loadEnv();
  const supabaseUrl = env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
  const migrationsDir = path.join(__dirname, '../supabase/migrations');
  
  let migrationHTML = '';
  
  if (fs.existsSync(migrationsDir)) {
    const files = fs
      .readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();
    
    files.forEach((file, idx) => {
      const filePath = path.join(migrationsDir, file);
      const sqlContent = fs.readFileSync(filePath, 'utf8');
      const escapedSQL = sqlContent.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      
      migrationHTML += `
      <div class="migration-card">
        <div class="migration-header">
          <span class="migration-number">${idx + 1}</span>
          <h3>${file}</h3>
          <button class="copy-btn" onclick="copySQL('${file}', \`${escapedSQL}\`)">
            📋 Copy SQL
          </button>
        </div>
        <details class="migration-details">
          <summary>Preview SQL</summary>
          <pre><code>${escapedSQL}</code></pre>
        </details>
      </div>
      `;
    });
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Maji Safi Ya Kwetu - Database Migrations</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }
    
    .container {
      max-width: 900px;
      margin: 0 auto;
    }
    
    .header {
      background: white;
      border-radius: 12px;
      padding: 30px;
      margin-bottom: 30px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    }
    
    .header h1 {
      color: #333;
      margin-bottom: 10px;
      font-size: 28px;
    }
    
    .header p {
      color: #666;
      margin-bottom: 15px;
      line-height: 1.6;
    }
    
    .info-box {
      background: #f0f9ff;
      border-left: 4px solid #0ea5e9;
      padding: 15px;
      border-radius: 6px;
      margin-bottom: 15px;
    }
    
    .info-box strong {
      color: #0369a1;
    }
    
    .action-buttons {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    
    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      font-size: 14px;
      transition: all 0.3s;
      text-decoration: none;
      display: inline-block;
    }
    
    .btn-primary {
      background: #0ea5e9;
      color: white;
    }
    
    .btn-primary:hover {
      background: #0284c7;
      transform: translateY(-2px);
    }
    
    .migrations {
      display: grid;
      gap: 20px;
    }
    
    .migration-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    
    .migration-header {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 15px;
      flex-wrap: wrap;
    }
    
    .migration-number {
      background: #667eea;
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      flex-shrink: 0;
    }
    
    .migration-header h3 {
      margin: 0;
      color: #333;
      font-size: 18px;
      flex: 1;
      font-family: 'Monaco', 'Menlo', monospace;
    }
    
    .copy-btn {
      padding: 8px 15px;
      background: #10b981;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      font-size: 13px;
      transition: all 0.3s;
      flex-shrink: 0;
    }
    
    .copy-btn:hover {
      background: #059669;
    }
    
    .copy-btn.copied {
      background: #8b5cf6;
    }
    
    .migration-details {
      cursor: pointer;
    }
    
    .migration-details summary {
      color: #667eea;
      font-weight: 600;
      padding: 10px;
      cursor: pointer;
      user-select: none;
    }
    
    .migration-details summary:hover {
      color: #764ba2;
    }
    
    .migration-details pre {
      background: #1f2937;
      color: #e5e7eb;
      padding: 15px;
      border-radius: 6px;
      overflow-x: auto;
      margin-top: 10px;
      font-size: 12px;
      line-height: 1.5;
      font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
    }
    
    .steps {
      background: white;
      border-radius: 12px;
      padding: 30px;
      margin-top: 30px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    }
    
    .steps h2 {
      color: #333;
      margin-bottom: 20px;
      font-size: 20px;
    }
    
    .steps ol {
      list-style: decimal;
      margin-left: 20px;
      line-height: 2;
      color: #555;
    }
    
    .steps li {
      margin-bottom: 10px;
    }
    
    .toast {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 15px 20px;
      border-radius: 6px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      animation: slideIn 0.3s ease;
      z-index: 1000;
    }
    
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @media (max-width: 768px) {
      .header {
        padding: 20px;
      }
      
      .header h1 {
        font-size: 24px;
      }
      
      .migration-header {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .copy-btn {
        width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🌊 Maji Safi Ya Kwetu - Database Setup</h1>
      <p>Execute these SQL migrations to set up your Supabase database. Copy each migration and run it in your Supabase SQL Editor.</p>
      
      <div class="info-box">
        <strong>📌 Project URL:</strong> ${supabaseUrl}
      </div>
      
      <div class="action-buttons">
        <a href="${supabaseUrl}/project/_/sql" target="_blank" class="btn btn-primary">
          🔗 Open Supabase SQL Editor
        </a>
      </div>
    </div>
    
    <div class="migrations">
      ${migrationHTML || '<p style="color: white; text-align: center;">No migration files found</p>'}
    </div>
    
    <div class="steps">
      <h2>📋 How to Execute Migrations:</h2>
      <ol>
        <li>Click the "Copy SQL" button on each migration card above</li>
        <li>Click the <strong>"Open Supabase SQL Editor"</strong> button above</li>
        <li>Create a new query (click "New query")</li>
        <li>Paste the SQL code into the editor</li>
        <li>Click the <strong>"Execute"</strong> button</li>
        <li>Repeat for each migration in order (001, 002, 003, ...)</li>
        <li>Once all migrations are executed, refresh your app</li>
      </ol>
    </div>
  </div>
  
  <script>
    function copySQL(name, content) {
      navigator.clipboard.writeText(content).then(() => {
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = '✅ Copied!';
        btn.classList.add('copied');
        
        showToast('SQL copied to clipboard!');
        
        setTimeout(() => {
          btn.textContent = originalText;
          btn.classList.remove('copied');
        }, 2000);
      }).catch(err => {
        showToast('Failed to copy SQL', 'error');
        console.error('Copy failed:', err);
      });
    }
    
    function showToast(message, type = 'success') {
      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.textContent = message;
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.remove();
      }, 3000);
    }
  </script>
</body>
</html>`;
}

function main() {
  try {
    const html = generateHTML();
    const outputPath = path.join(__dirname, '../migrations-setup.html');
    
    fs.writeFileSync(outputPath, html, 'utf8');
    console.log(`\n✅ Migration setup page generated!`);
    console.log(`📄 File: ${outputPath}`);
    console.log(`\n🌐 To view in browser:`);
    console.log(`   macOS: open migrations-setup.html`);
    console.log(`   Or open the file with your browser\n`);
    
  } catch (error) {
    console.error('Error generating HTML:', error);
    process.exit(1);
  }
}

main();
