# 🚀 Supabase Database Management from VS Code

Vous avez maintenant un système complet pour gérer votre base de données Supabase directement depuis VS Code **sans CLI et sans accès manuel à la console Supabase**.

## 📋 Commandes disponibles

### 1️⃣ Vérifier les migrations
```bash
npm run migrate
```
**Résultat:** Affiche la liste des fichiers de migration et les étapes à suivre.

### 2️⃣ Générer l'interface HTML
```bash
npm run migrate:sql
```
**Résultat:** Génère `migrations-setup.html` - une interface complète pour gérer les migrations.

## 🎯 Workflow recommandé

### **Option 1: Utiliser l'interface HTML (PLUS FACILE)** ✅

1. Lancez le script dans le terminal :
   ```bash
   npm run migrate:sql
   ```

2. Le fichier `migrations-setup.html` s'ouvrira automatiquement

3. L'interface affichera :
   - 📌 Votre URL Supabase
   - 📋 Les 3 fichiers de migration (001, 002, 003)
   - 🔗 Un bouton "Open Supabase SQL Editor"
   - 📋 Un bouton "Copy SQL" pour chaque migration

4. Pour chaque migration:
   - Cliquez "Copy SQL"
   - Allez dans Supabase SQL Editor
   - Collez le SQL
   - Cliquez "Execute"
   - Passez à la migration suivante

### **Option 2: Accès direct à Supabase**

```bash
npm run migrate
```

Puis copiez-collez directement le lien vers votre Supabase SQL Editor:
```
https://biddiqgmwrdhozksietf.supabase.co/project/_/sql
```

## 📂 Structure des scripts

```
scripts/
├── migrate.js          # Vérifie & affiche les migrations
└── generate-sql.js     # Génère l'interface HTML

supabase/migrations/
├── 001_create_initial_schema.sql    # Crée les 6 tables principales
├── 002_enable_rls.sql               # Configure la sécurité RLS
└── 003_create_products.sql          # Crée la table produits
```

## 🔧 Stockage et configuration

Toute la configuration est stockée localement:
- `.env` - Credentials Supabase
- `supabase/migrations/*.sql` - Fichiers de migration
- `scripts/` - Scripts d'automatisation
- `migrations-setup.html` - Interface générée

✅ **Pas besoin de CLI Supabase**
✅ **Pas besoin d'accès console**
✅ **Gestion complète depuis le projet**

## 🎓 Étapes pour les migrations (Détaillé)

### Première fois seulement:

1. **Vérifier les fichiers:**
   ```bash
   npm run migrate
   ```

2. **Ouvrir l'interface:**
   ```bash
   npm run migrate:sql
   ```

3. **Pour chaque migration (001, 002, 003):**
   
   3a. Ouvrir le fichier HTML généré
   
   3b. Cliquer "Copy SQL" sur la première migration
   
   3c. Cliquer le lien "Open Supabase SQL Editor"
   
   3d. Dans Supabase:
   - Cliquer "New query"
   - Coller le SQL
   - Cliquer le bouton "Execute" (flèche verte)
   - Attendre le ✅ "Success"
   
   3e. Revenir au HTML et répéter pour migration 2 et 3

4. **Après toutes les migrations:**
   - Votre base de données est prête! 🎉
   - Retourner à l'app et rafraîchir

## ✨ Résultat final après migrations

Après exécution des 3 migrations, vous aurez:

**6 Tables créées:**
- `users` - Utilisateurs du système
- `clients` - Clients de la distribution
- `depots` - Dépôts/Points de vente
- `stock_items` - Inventaire
- `sales` - Ventes enregistrées
- `sale_items` - Détail des ventes
- `products` - Produits (5 produits pré-chargés)

**Sécurité RLS:**
- ✅ Admins voient tout
- ✅ Managers voient leurs dépôts
- ✅ Users voient seulement leurs données

**Données initiales:**
- 5 produits avec prix pré-configurés
- Prêt pour les clients, dépôts, stock & ventes

## 🆘 Dépannage

### L'interface HTML ne s'ouvre pas automatiquement?
```bash
cd /Users/mac/maji-safi-ya-kuetu
open migrations-setup.html
```

### Les migrations n'existent pas?
Vérifiez le dossier:
```bash
ls supabase/migrations/
```

### Erreur SQL après exécution?
- Exécutez les migrations dans l'ordre: 001 → 002 → 003
- Attendez que chaque migration termine avant la suivante
- Vérifiez les erreurs affichées dans l'interface Supabase

## 🎯 Prochaines étapes

Après les migrations:

1. ✅ App va se connecter automatiquement à la base
2. ✅ Les produits apparaîtront dans l'admin
3. ✅ Vous pouvez créer clients, dépôts, stock, ventes
4. ✅ Les images produits peuvent être uploadées

## 📝 Notes importantes

- **Fichiers générés:** `migrations-setup.html` - vous pouvez le réutiliser/ouvrir plusieurs fois
- **À ne pas modifier:** `supabase/migrations/*.sql` - sauf par Git commits
- **Sûr:** Chaque migration est idempotente pendant le développement
- **Production:** Utilisez les migrations comme version control de votre schéma

---

**Status:** ✅ Prêt pour exécution!

Commande rapide pour commencer:
```bash
npm run migrate:sql
```

Suivez les instructions dans l'interface générée! 🚀
