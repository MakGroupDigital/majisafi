# 📊 Scripts de Gestion Supabase

Ce dossier contient les scripts pour gérer votre base de données Supabase directement depuis le projet.

## 🚀 Utilisation rapide

```bash
# Voir la liste des migrations
npm run migrate

# Générer l'interface HTML pour exécuter les migrations
npm run migrate:sql
```

## 📝 Fichiers

### `migrate.js`
Vérifie et affiche les migrations disponibles.
```bash
npm run migrate
```
**Affiche:**
- Nombre de fichiers de migration
- Localisation des fichiers
- Lien direct vers Supabase SQL Editor

### `generate-sql.js`
Génère une page HTML interactive pour copier-coller les migrations.
```bash
npm run migrate:sql
```
**Génère:** `migrations-setup.html`
- Interface moderne avec tous les SQL
- Boutons "Copy SQL" pour chaque migration
- Lien direct vers Supabase

## 🎯 Workflow

1. **Vérifier les migrations:**
   ```bash
   npm run migrate
   ```

2. **Générer l'interface:**
   ```bash
   npm run migrate:sql
   ```

3. **Exécuter dans Supabase:**
   - Ouvrir le fichier HTML généré
   - Cliquer "Copy SQL"
   - Aller dans Supabase SQL Editor
   - Exécuter chaque migration

## 📌 Notes

- Scripts en ES Module (compatible avec `"type": "module"` dans package.json)
- Aucune dépendance externe - utilise uniquement Node.js built-in
- Lisez `.env` pour récupérer vos credentials Supabase
- Les migrations sont dans `supabase/migrations/`

## 🔍 Fichiers lus

- `.env` - Récupère `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`
- `supabase/migrations/*.sql` - Tous les fichiers `.sql` triés par ordre

## 💾 Sortie

- **Terminal:** Messages informatifs et lien Supabase
- **HTML:** `migrations-setup.html` - Page complète avec interface moderne

---

Pour plus de détails: voir `MIGRATIONS_SETUP.md`
