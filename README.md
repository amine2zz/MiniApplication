# 🏠 Mini Application Immobilière

> **Application full-stack de gestion de propriétés immobilières**  
> Développée avec React + TypeScript (frontend) et Fastify + TypeScript (backend)

[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Fastify](https://img.shields.io/badge/Fastify-4.0-green?logo=fastify)](https://www.fastify.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

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
1. **🏠 Liste des propriétés** - Affichage en cards avec titre, ville, prix et actions
2. **🔍 Système de filtrage avancé** - Multi-sélection de villes, sliders de prix/surface
3. **📋 Détail d'une propriété** - Vue complète avec toutes les informations
4. **✏️ Formulaire de création/édition** - Interface validée pour gérer les propriétés
5. **🌐 Support multilingue** - Interface FR/EN avec traduction des données

## 🛠️ Stack Technique

### 🔧 Backend
| Technologie | Version | Usage |
|-------------|---------|-------|
| **Fastify** | 4.x | Framework web haute performance |
| **TypeScript** | 5.x | Typage statique et sécurité |
| **Zod** | 3.x | Validation schémas + auto-typing DTO |
| **UUID** | 9.x | Génération d'identifiants uniques |

### ⚛️ Frontend
| Technologie | Version | Usage |
|-------------|---------|-------|
| **React** | 18.x | Bibliothèque UI moderne |
| **TypeScript** | 5.x | Typage statique |
| **React Router** | 6.x | Navigation SPA |
| **Axios** | 1.x | Client HTTP |
| **CSS3** | - | Styles CFP + animations |

## 🚀 Installation & Démarrage

### 📋 Prérequis
- **Node.js** ≥ 16.0.0
- **npm** ≥ 8.0.0 ou **yarn** ≥ 1.22.0

### ⚡ Démarrage rapide

```bash
# 1️⃣ Cloner le repository
git clone <repository-url>
cd MiniApplication

# 2️⃣ Installation Backend
cd backend
npm install

# 3️⃣ Installation Frontend
cd ../frontend
npm install
```

### 🔄 Lancement en développement

**Terminal 1 - Backend API:**
```bash
cd backend
npm run dev
# 🌐 Serveur: http://localhost:3001
```

**Terminal 2 - Frontend React:**
```bash
cd frontend
npm start
# 🌐 Application: http://localhost:3000
```

> **✅ Prêt !** L'application est accessible sur `http://localhost:3000`

## 🎨 Design System

### 🎯 Palette CFP (Cash Flow Positif)
```css
--primary: #0085ff     /* Bleu CFP principal */
--secondary: #0f172a   /* Bleu foncé */
--accent: #e7f6ff      /* Bleu clair */
--text: #364151        /* Texte principal */
--border: #e2e8f0      /* Bordures */
```

### 🔤 Typographie
- **Police principale:** Poppins (Google Fonts)
- **Poids:** 400, 500, 600, 700
- **Responsive:** Adaptatif mobile/desktop

## 📊 Modèle de Données

```typescript
// 🏠 Propriété immobilière
interface Property {
  id: string;        // UUID unique
  title: string;     // Titre (multilingue)
  city: string;      // Ville
  price: number;     // Prix en euros
  surface: number;   // Surface en m²
}

// 📝 DTO de création
interface CreatePropertyDTO {
  title: string;
  city: string;
  price: number;
  surface: number;
}

// ✏️ DTO de mise à jour
interface UpdatePropertyDTO extends Partial<CreatePropertyDTO> {}
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
- **🎨 Design responsive** - Mobile-first approach
- **✨ Animations fluides** - Transitions CSS3
- **⏳ États de chargement** - Spinners et feedback
- **🚨 Gestion d'erreurs** - Messages clairs
- **🧭 Navigation intuitive** - UX optimisée
- **🔍 Filtrage avancé** - Multi-critères avec sliders
- **🌐 Multilingue** - FR/EN avec traductions

## 🔮 Fonctionnalités Actuelles

### ✅ Implémentées
- **🏠 CRUD complet** - Créer, lire, modifier, supprimer
- **🔍 Filtrage avancé** - Multi-villes, prix, surface avec sliders
- **🌐 Multilingue** - FR/EN avec traductions complètes
- **📱 Responsive** - Design adaptatif mobile/desktop
- **⚡ Performance** - Fastify + React optimisés
- **🎨 UI/UX moderne** - Design CFP professionnel
- **🔒 Validation** - Zod + TypeScript strict

### 🚀 Évolutions Futures

<details>
<summary><strong>🔧 Backend</strong></summary>

- 🗄️ Base de données (PostgreSQL/MySQL)
- 🔐 Authentification JWT
- 📄 Pagination des résultats
- 🖼️ Upload d'images
- 🧪 Tests unitaires et d'intégration
- 📚 Documentation API (Swagger)
- 📊 Logging structuré
- 🛡️ Rate limiting
</details>

<details>
<summary><strong>⚛️ Frontend</strong></summary>

- 🗃️ Gestionnaire d'état (Zustand/Redux)
- 🔄 Cache des requêtes (React Query)
- 🧪 Tests unitaires (Jest/Testing Library)
- 🤖 Tests E2E (Cypress)
- 📱 PWA (Progressive Web App)
- 🌙 Thème sombre/clair
- 📄 Pagination avancée
- 🖼️ Upload d'images avec preview
</details>

<details>
<summary><strong>🚀 DevOps</strong></summary>

- 🐳 Docker et Docker Compose
- 🔄 CI/CD (GitHub Actions)
- 🌐 Déploiement automatisé
- 📊 Monitoring (Sentry)
- 🔐 Variables d'environnement
- 🔒 HTTPS en production
</details>

## 📸 Aperçu

### 🏠 Liste des Propriétés
- Interface moderne avec cards responsive
- Filtrage multi-critères (villes, prix, surface)
- Sliders interactifs avec valeurs éditables
- Support multilingue FR/EN

### 🔍 Système de Filtrage
- **Multi-sélection de villes** avec tags
- **Sliders de prix/surface** avec plages colorées
- **Valeurs éditables** directement dans les champs
- **Suggestions intelligentes** basées sur les données

### 📱 Responsive Design
- Adaptation automatique mobile/tablet/desktop
- Navigation optimisée pour tous les écrans
- Interactions tactiles fluides

## 📝 Notes de Développement

### 🎯 Objectifs Atteints
- ✅ **Architecture multi-couches** - Séparation claire des responsabilités
- ✅ **Validation Zod** - Auto-typing des DTO
- ✅ **Structure organisée** - Code maintenable et scalable
- ✅ **Design CFP** - Identité visuelle respectée
- ✅ **TypeScript strict** - Sécurité de type maximale
- ✅ **UX moderne** - Interface intuitive et responsive

### 🏆 Points Forts
- **🔍 Filtrage avancé** - Multi-critères avec sliders interactifs
- **🌐 Multilingue** - Support FR/EN complet
- **⚡ Performance** - Optimisations React + Fastify
- **🎨 Design moderne** - UI/UX professionnelle
- **🔒 Robustesse** - Validation et gestion d'erreurs

---

## 🤝 Contribution

Pour contribuer au projet :

1. **Fork** le repository
2. **Créer** une branche feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** les changements (`git commit -m 'Add AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrir** une Pull Request

## 📄 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Contact

**Med Amine Ghariani**
- 📧 Email: [votre-email@example.com]
- 💼 LinkedIn: [votre-profil-linkedin]
- 🐙 GitHub: [votre-github]

---

**👨💻 Développé par:** Med Amine Ghariani  
**📅 Date:** Décembre 2024  
**🏢 Pour:** CFP GROUP - Test Technique

---

<div align="center">
  <strong>⭐ Si ce projet vous plaît, n'hésitez pas à lui donner une étoile ! ⭐</strong>
</div>