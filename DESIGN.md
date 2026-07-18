# Les choix de design de MTP Map — et pourquoi

Ce document explique les principes appliqués dans l'app, pour comprendre
*pourquoi* elle est agréable à utiliser — et réutiliser ces règles ailleurs.
Référence : les meilleures apps de cartographie (Google Maps, Citymapper).

## 1. La carte est le contenu, l'UI flotte

Sur une app carto, **la carte EST la page**. Tout le reste (recherche,
chips, panneaux) flotte au-dessus en petites cartes blanches avec une ombre
douce, et n'occupe jamais plus d'espace que nécessaire. C'est le principe
n° 1 de Google Maps : ne jamais enfermer la carte dans un « site web ».

**Règle à retenir :** identifiez le contenu principal de votre page et
donnez-lui un maximum d'espace ; le reste est secondaire et doit s'effacer.

## 2. Une seule couleur d'accent, des couleurs sémantiques réservées

- **Un seul bleu** (`#2563EB`) pour les actions et sélections (boutons,
  focus, éléments choisis). Quand tout est coloré, rien ne ressort.
- **Vert / orange / rouge sont réservés à un seul sens** : le taux de
  disponibilité (≥ 50 % / 20-50 % / < 20 %). L'utilisateur apprend ce code
  une fois et le lit partout d'un coup d'œil.
- **Chaque catégorie de données a sa couleur + son pictogramme**, identiques
  partout (marqueur, chip, popup, réglages). C'est ce qui rend les couches
  « très bien identifiables » : la chip sert de légende vivante.
- Les neutres sont une gamme de gris froids (slate), jamais du noir pur.

**Règle :** avant de choisir des couleurs, écrivez ce que chaque couleur
*signifie*. Une couleur = un sens, partout.

## 3. Tokens sémantiques = thème sombre gratuit

Aucun composant ne dit `bg="white"` : ils disent `bg="bg.surface"`,
`color="fg.muted"`, etc. Ces *tokens sémantiques* (définis dans
[src/theme.tsx](src/theme.tsx)) valent blanc/gris en clair et gris
foncé/clair en sombre. Résultat : le mode sombre fonctionne partout sans
dupliquer de code — même le chrome Leaflet (popups, zoom) suit, car son CSS
consomme les variables Chakra (`var(--chakra-colors-…)`). Et le **fond de
carte change avec le thème** (CARTO Voyager ↔ Dark Matter) : un thème
sombre avec une carte éblouissante n'aurait aucun sens.

**Règle :** ne codez jamais une couleur en dur dans un composant ;
nommez son rôle.

## 4. Une seule police, une hiérarchie par le poids

Une app-outil n'a pas besoin de deux polices : **Inter** partout, et la
hiérarchie vient de la taille (échelle resserrée) et de la graisse
(400 / 500 / 600 / 700). Les popups vont à l'essentiel : titre, badge de
disponibilité, 2-3 infos, actions — le détail complet vit dans le panneau
« Détails ».

## 5. Le mobile n'est pas un desktop rétréci

- Les panneaux latéraux deviennent des **bottom sheets** (accessibles au
  pouce, motif standard de toutes les apps cartes).
- La recherche prend toute la largeur, les chips défilent horizontalement.
- Cibles tactiles ≥ 44 px, `safe-area-inset` pour les encoches d'iPhone.

**Règle :** sur mobile, pensez « zone du pouce » : les actions vont en bas,
le contenu en haut.

## 6. La densité se gère (clustering)

340 bornes de recharge en vrac = une carte illisible. Les couches denses
sont **regroupées en clusters** colorés qui affichent le compte et
s'ouvrent au zoom. C'est aussi pour ça que les bus (~1 200 arrêts) ne sont
pas affichés : trop de bruit pour peu de valeur — savoir *ne pas* montrer
une donnée fait partie du design.

## 7. Les états « vides » sont du design

- Chargement : petit spinner dans la chip, skeleton dans le panneau —
  jamais d'écran bloquant, la carte reste utilisable.
- Erreur réseau : un toast discret l'annonce ; l'app ne casse pas.
- Données douteuses : les éco-compteurs muets depuis 24 h sont filtrés
  (afficher « 0 passage » d'un capteur mort serait un mensonge).

**Règle :** concevez d'abord loading / erreur / vide ; le « happy path »
est la partie facile.

## 8. Micro-interactions sobres

Transitions de 150-250 ms avec sortie douce : survol des marqueurs (léger
zoom), montée des panneaux, hover des chips. La motion **signale un
changement d'état**, elle ne décore pas. Et `prefers-reduced-motion` est
respecté (animations remplacées par un fondu).

## 9. Accessibilité de base, non négociable

- Contraste AA sur les deux thèmes (texte secondaire compris).
- Tous les boutons-icônes ont un `aria-label` ; les chips exposent
  `aria-pressed` ; les marqueurs ont un titre.
- Focus visible au clavier (anneau bleu), navigation clavier des panneaux.

## 10. Ce qui fait revenir les gens

La question du produit, pas seulement du pixel : l'app doit être **plus
rapide que l'alternative**. Ouvrir → voir en 2 secondes s'il y a des vélos
à la station d'à côté. D'où : données temps réel (60 s), préférences
mémorisées (couches et fond de carte retrouvés à la prochaine visite),
zéro compte, zéro pub, une URL qui marche sur téléphone. La confiance
vient de la transparence : horodatage des mesures et sources citées.
