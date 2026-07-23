# Notice d'Accessibilité - Projet MySelfPro (Dossier de Certification)

## Actions mises en œuvre pour permettre l'accès à l'application aux personnes en situation de handicap

Dans le cadre du développement de la plateforme SaaS B2B **MySelfPro**, une attention particulière a été portée à la conformité avec le Référentiel Général d'Amélioration de l'Accessibilité (**RGAA**) afin de garantir une expérience utilisateur inclusive et utilisable par tous, y compris les personnes navigant avec des technologies d'assistance (lecteurs d'écran, contacteurs, clavier seul).

Les points techniques suivants ont été rigoureusement implémentés sur le prototype :

1. **Sémantique HTML5 Strict (RGAA Thématique 12 - Sémantique & Thématique 9 - Structuration)**
   - Utilisation des balises structurelles appropriées (`<main>`, `<aside>`, `<nav>`, `<section>`, `<header>`) pour définir des repères (*landmarks*) clairs facilitant la navigation rapide des synthèses vocales.
   - Structuration logique des niveaux de titres (`h1` pour le titre de la page, `h2` pour les statistiques, `h3` pour les sections) sans saut de niveau.
   - Balisage sémantique du tableau des factures avec l'utilisation de `scope="col"` sur les en-têtes de colonnes (`<th>`) pour lier explicitement les données aux en-têtes et insertion d'un titre explicite (`<caption>`) masqué visuellement mais vocalisé par les outils d'assistance.

2. **Attributs et Relations WAI-ARIA (RGAA Thématique 11 - Formulaires & Thématique 10 - Présentation)**
   - Utilisation des liaisons ARIA dans les formulaires via l'attribut `aria-describedby` pour relier dynamiquement les champs de saisie (`input`) aux messages d'erreur ou d'aide correspondants, assurant que l'utilisateur comprenne immédiatement la nature de l'erreur.
   - Implémentation de l'attribut `aria-invalid` (basculant à `true` ou `false`) pour signaler vocalement et programmatiquement l'état d'erreur d'un champ.
   - Ajout d'une zone dynamique `aria-live="polite"` (avec `role="status"`) pour annoncer de façon fluide et non-intrusive la réussite ou l'échec de la création d'une facture au lecteur d'écran.
   - Indication de l'onglet actif dans le menu de navigation latérale à l'aide de l'attribut `aria-current="page"`.

3. **Navigation Clavier Intégrale (RGAA Thématique 12 - Navigation)**
   - Intégration d'un lien d'évitement / contournement (*skip link*) invisible au repos mais apparaissant au premier appui sur la touche `Tab`, permettant aux utilisateurs de sauter directement la barre latérale pour atteindre le contenu principal (`#main-content`).
   - Préservation et amélioration de l'indicateur de focus visuel sur l'ensemble des éléments interactifs (boutons, liens, formulaires) via les classes de focus visibles de Tailwind (`focus-visible:ring-2 focus-visible:ring-indigo-500`), garantissant que les utilisateurs naviguant sans souris repèrent instantanément l'élément actif.

4. **Contrastes et Lisibilité (RGAA Thématique 3 - Couleurs)**
   - Choix minutieux des couleurs de texte et de fond pour dépasser les exigences minimales de contraste du RGAA (ratio supérieur ou égal à 4.5:1 pour le texte normal).
   - Augmentation des contrastes sur le thème sombre (passage de `text-zinc-400` à `text-zinc-300` ou `text-zinc-200` sur fond sombre et badges d'états réajustés) pour maximiser la lisibilité des métriques et des statuts des factures.
