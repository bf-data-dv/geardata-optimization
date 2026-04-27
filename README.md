# 🏎️ GearData Engine | Optimization & Data Purification

[![Vercel Deployment](https://img.shields.io/badge/Deployment-Live-success?style=flat-square&logo=vercel)](https://geardata-engine.vercel.app/)
[![Stack](https://img.shields.io/badge/Stack-React_|_Tailwind_|_SQL-blue?style=flat-square)](https://github.com/bf-data-dv/geardata-optimization)

### 🎯 Le Projet
Ce projet démontre une pipeline complète de traitement de données, allant d'un dataset automobile brut et corrompu vers une interface utilisateur haute performance. L'objectif était de résoudre les problèmes de latence et d'incohérence des données (doublons, formats erronés).

### 🚀 Performance & Optimisation
* **Latence :** Réduite à ~0ms grâce au pré-traitement des données.
* **Architecture :** Passage d'un flux de données non structuré à une structure JSON optimisée.
* **Nettoyage (Data Cleaning) :**
    * Suppression des entrées dupliquées via scripts SQL.
    * Normalisation des noms de marques et modèles.
    * Correction des types de données (prix, années).

### 🛠️ Stack Technique
* **Frontend :** React.js avec composants dynamiques.
* **Styling :** Tailwind CSS pour une interface moderne et responsive.
* **Data Pipeline :** SQL pour l'extraction et la purification, JSON pour le stockage final.
* **Hosting :** Vercel (CI/CD lié au repo GitHub).

### 📊 Aperçu du Workflow
1.  **Ingestion :** Analyse du dataset brut.
2.  **Transformation :** Application de règles de nettoyage SQL.
3.  **Visualisation :** Interface de filtrage intelligente en temps réel.

---
*Développé par [Brahim Fettih](https://github.com/bf-data-dv) dans le cadre d'une optimisation de gestion de flotte automobile.*
