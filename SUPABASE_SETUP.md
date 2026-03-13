# Configuration Supabase

## ✅ Fichiers créés

1. **`supabase/migrations/001_create_initial_schema.sql`** - Tables et indexes
2. **`supabase/migrations/002_enable_rls.sql`** - Politiques Row Level Security
3. **`types.ts`** - Types TypeScript mis à jour
4. **`utils/supabase.ts`** - API client et hooks

## 🚀 Étapes de configuration

### 1. Exécuter les migrations

1. Aller sur https://app.supabase.com
2. Ouvrir ton projet `biddiqgmwrdhozksietf`
3. Aller à `SQL Editor`
4. Créer une nouvelle query
5. Copier le contenu de `supabase/migrations/001_create_initial_schema.sql`
6. Exécuter ✓
7. Faire la même chose pour `002_enable_rls.sql`

### 2. Installer Supabase JS

```bash
npm install @supabase/supabase-js
```

### 3. Utiliser dans les composants

```typescript
import { clientsAPI, depotsAPI, stockAPI, salesAPI } from '@/utils/supabase';

// Récupérer tous les clients
const clients = await clientsAPI.getAll();

// Créer un client
const newClient = await clientsAPI.create({
  name: 'John',
  email: 'john@example.com',
  client_type: 'individual'
});

// Récupérer le stock d'un dépôt
const stock = await stockAPI.getByDepot(depotId);
```

## 📊 Schéma de données

```
clients
├── id (UUID)
├── name
├── email
├── phone
├── address
├── client_type (individual | business | distributor)
└── timestamps

depots
├── id (UUID)
├── name
├── location
├── phone
├── email
├── manager
└── timestamps

stock_items
├── id (UUID)
├── depot_id (FK)
├── product_name
├── brand
├── size
├── quantity
├── price_per_unit
└── timestamps

sales
├── id (UUID)
├── depot_id (FK)
├── client_id (FK)
├── total
├── payment_method
├── status
└── timestamps

sale_items
├── id (UUID)
├── sale_id (FK)
├── product_name
├── quantity
├── unit_price
└── timestamps
```

## 🔒 Sécurité RLS activée

- **Clients** : Voient seulement leurs données
- **Managers** : Voient seulement leurs dépôts
- **Admins** : Accès complet

## 📝 Prochaines étapes

- Intégrer les API Supabase dans AdminDashboard
- Remplacer localStorage par Supabase
- Ajouter authentification avec Supabase Auth
- Configurer real-time sync
