# 🔍 Debug - Page Admin

## 🚨 Problème : 
Quand vous allez sur `?admin=true`, vous restez sur la page d'accueil au lieu de voir la page de connexion.

## 🔧 Solutions à tester :

### 1. Vérifier l'URL exacte
Assurez-vous d'utiliser :
```
http://localhost:3000/?admin=true
```
(Pas `http://localhost:5173` si c'est le port Vite)

### 2. Vider le cache du navigateur
- Appuyez sur `Ctrl+Shift+R` (ou `Cmd+Shift+R` sur Mac)
- Ou ouvrez les DevTools → Network → cochez "Disable cache"

### 3. Vérifier les logs de la console
Ouvrez les DevTools (F12) et regardez s'il y a des erreurs dans la Console.

### 4. Forcer le mode admin
Ajoutez cette ligne temporaire dans App.tsx après la ligne 25 :
```javascript
setIsAdminMode(true); // TEMPORAIRE POUR DEBUG
```

### 5. Vérifier les états
Ajoutez ces logs temporaires dans App.tsx après la ligne 30 :
```javascript
console.log('🔍 Debug:', { isAdminMode, isAuthenticated, authLoading });
```

## 🎯 Test rapide :

1. **Ouvrir la console** (F12)
2. **Aller sur** : `http://localhost:3000/?admin=true`
3. **Regarder les logs** dans la console
4. **Dire-moi ce que vous voyez** dans les logs

## 📝 Ce qui devrait se passer :

1. URL avec `?admin=true` → `isAdminMode = true`
2. Pas encore connecté → `isAuthenticated = false`
3. Chargement terminé → `authLoading = false`
4. **Résultat** : Page de connexion affichée

Si ce n'est pas le cas, il y a un problème dans la logique que nous devons corriger.

## 🚀 Solution temporaire :

Si rien ne fonctionne, vous pouvez forcer l'affichage de la page de connexion en modifiant temporairement App.tsx ligne ~106 :

```javascript
// TEMPORAIRE - Forcer l'affichage de la page de connexion
if (true) {
  return <LoginPage onLoginSuccess={handleLoginSuccess} />;
}
```

Cela vous permettra de créer votre compte admin, puis nous corrigerons la logique.