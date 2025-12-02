# Mini Application Immobilière

Une application full-stack de gestion de propriétés immobilières développée avec React + TypeScript (frontend) et Fastify + TypeScript (backend).

## 🏗️ Architecture

### Backend (Fastify + TypeScript)
```
backend/
├── src/
│   ├── routes/          # Routes API
│   ├── services/        # Logique métier
│   ├── schemas/         # Validation Zod
│   ├── models/          # Interfaces TypeScript
│   └── server.ts        # Point d'entrée
├── package.json
├── tsconfig.json
└── nodemon.json
```

### Frontend (React + TypeScript)
```
frontend/
├── src/
│   ├── components/      # Composants réutilisables
│   ├── pages/          # Pages de l'application
│   ├── services/       # Services API
│   ├── types/          # Types TypeScript
│   └── App.tsx         # Point d'entrée
├── package.json
└── tsconfig.json
```

## 🚀 Fonctionnalités

### API Backend (CRUD)
- `GET /items` - Récupérer toutes les propriétés
- `GET /items/:id` - Récupérer une propriété par ID
- `POST /items` - Créer une nouvelle propriété
- `PUT /items/:id` - Mettre à jour une propriété
- `DELETE /items/:id` - Supprimer une propriété

### Interface Frontend
1. **Liste des propriétés** - Affichage en cards avec titre, ville, prix et actions
2. **Détail d'une propriété** - Vue complète avec toutes les informations
3. **Formulaire de création/édition** - Interface validée pour gérer les propriétés

## 🛠️ Technologies Utilisées

### Backend
- **Fastify** - Framework web rapide et efficace
- **TypeScript** - Typage statique
- **Zod** - Validation des schémas et typage automatique des DTO
- **UUID** - Génération d'identifiants uniques

### Frontend
- **React 18** - Bibliothèque UI
- **TypeScript** - Typage statique
- **React Router** - Navigation
- **Axios** - Client HTTP
- **CSS3** - Styles personnalisés inspirés du design CFP

## 📦 Installation et Lancement

### Prérequis
- Node.js (version 16 ou supérieure)
- npm ou yarn

### 1. Installation du Backend
```bash
cd backend
npm install
```

### 2. Installation du Frontend
```bash
cd frontend
npm install
```

### 3. Lancement en mode développement

**Terminal 1 - Backend :**
```bash
cd backend
npm run dev
```
Le serveur démarre sur http://localhost:3001

**Terminal 2 - Frontend :**
```bash
cd frontend
npm start
```
L'application démarre sur http://localhost:3000

## 🎨 Design

L'interface utilise la palette de couleurs et le style du site Cash Flow Positif :
- **Couleur primaire** : #0085ff (bleu CFP)
- **Couleur secondaire** : #0f172a (bleu foncé)
- **Couleur d'accent** : #e7f6ff (bleu clair)
- **Police** : Poppins (Google Fonts)

## 📊 Modèle de Données

```typescript
interface Property {
  id: string;
  title: string;
  city: string;
  price: number;
  surface: number;
}
```

## 🔧 Choix Techniques

### Architecture Scalable
- **Séparation des responsabilités** : Routes, Services, Modèles
- **Validation centralisée** avec Zod
- **Typage strict** TypeScript
- **Structure modulaire** pour faciliter l'évolution

### Validation et Sécurité
- Validation des entrées avec Zod
- Typage automatique des DTO
- Gestion d'erreurs centralisée
- CORS configuré pour le développement

### Interface Utilisateur
- Design responsive
- Animations fluides
- Gestion des états de chargement
- Messages d'erreur clairs
- Navigation intuitive

## 🚀 Évolutions Possibles

Si j'avais plus de temps, j'aurais ajouté :

### Backend
- Base de données (PostgreSQL/MySQL)
- Authentification JWT
- Pagination des résultats
- Filtres et recherche
- Upload d'images
- Tests unitaires et d'intégration
- Documentation API (Swagger)
- Logging structuré
- Rate limiting

### Frontend
- Gestionnaire d'état (Zustand/Redux)
- Cache des requêtes (React Query)
- Tests unitaires (Jest/Testing Library)
- Tests E2E (Cypress)
- PWA (Progressive Web App)
- Internationalisation (i18n)
- Thème sombre/clair
- Filtres avancés
- Pagination
- Upload d'images avec preview

### DevOps
- Docker et Docker Compose
- CI/CD (GitHub Actions)
- Déploiement automatisé
- Monitoring (Sentry)
- Variables d'environnement
- HTTPS en production

## 📝 Notes de Développement

Cette application a été développée en suivant les spécifications exactes du test technique :
- Architecture backend multi-couches
- Validation Zod pour typer automatiquement les DTO
- Structure frontend organisée
- Design inspiré du site CFP
- Code propre et scalable
- TypeScript strict

L'accent a été mis sur la qualité du code, l'architecture scalable et l'expérience utilisateur, conformément aux attentes du test.