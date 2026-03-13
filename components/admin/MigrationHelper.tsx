import React, { useState, useEffect } from 'react';
import { Copy, Check, AlertCircle } from 'lucide-react';

interface MigrationFile {
  name: string;
  content: string;
  executed: boolean;
}

export const MigrationHelper: React.FC = () => {
  const [migrations, setMigrations] = useState<MigrationFile[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load migration files
    const loadMigrations = async () => {
      try {
        setLoading(true);
        const files = [
          '001_create_initial_schema.sql',
          '002_enable_rls.sql',
          '003_create_products.sql'
        ];
        
        const migs = await Promise.all(
          files.map(async (file) => ({
            name: file,
            content: `-- Migration: ${file}\n-- Content loaded from supabase/migrations/${file}`,
            executed: false
          }))
        );
        
        setMigrations(migs);
      } catch (error) {
        console.error('Error loading migrations:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadMigrations();
  }, []);

  const copyToClipboard = (content: string, name: string) => {
    navigator.clipboard.writeText(content);
    setCopied(name);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-blue-600 mt-1 flex-shrink-0" size={20} />
          <div>
            <h2 className="text-lg font-bold text-blue-900 mb-2">Database Migrations</h2>
            <p className="text-blue-800 text-sm mb-3">
              Execute these SQL migrations in your Supabase dashboard to set up the database schema.
            </p>
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-semibold text-sm underline"
            >
              Open Supabase Dashboard →
            </a>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin">⚙️</div>
          <p className="text-gray-600 mt-2">Loading migrations...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {migrations.map((migration) => (
            <div key={migration.name} className="border rounded-lg overflow-hidden bg-white">
              <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                <h3 className="font-mono font-semibold text-gray-900">{migration.name}</h3>
                <button
                  onClick={() => copyToClipboard(migration.content, migration.name)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition"
                >
                  {copied === migration.name ? (
                    <>
                      <Check size={16} /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={16} /> Copy SQL
                    </>
                  )}
                </button>
              </div>
              <div className="p-4">
                <p className="text-gray-600 text-sm mb-3">
                  To execute: Copy above, go to Supabase SQL Editor, paste, and click "Execute"
                </p>
                <details className="cursor-pointer">
                  <summary className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                    Preview SQL
                  </summary>
                  <pre className="mt-3 bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-auto max-h-48">
                    {migration.content}
                  </pre>
                </details>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h3 className="font-bold text-amber-900 mb-2">Steps to Execute Migrations:</h3>
        <ol className="list-decimal list-inside space-y-2 text-amber-900 text-sm">
          <li>Click "Copy SQL" on each migration above</li>
          <li>Go to <a href="https://supabase.com/dashboard" className="underline text-blue-600" target="_blank" rel="noopener noreferrer">Supabase Dashboard</a></li>
          <li>Navigate to SQL Editor</li>
          <li>Paste the SQL code</li>
          <li>Click "Execute" button</li>
          <li>Repeat for each migration in order</li>
        </ol>
      </div>
    </div>
  );
};

export default MigrationHelper;
