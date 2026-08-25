// français
import { Lang } from './en';

const lang: Partial<Lang> = {
  // main.ts
  'Open as kanban board': 'Ouvrir comme board Kanbam',
  'Create new board': 'Créer un nouveau board',
  'Archive completed cards in active board': 'Archiver les cartes terminées du board actif',
  'Error: current file is not a Kanban board':
    "Erreur : le fichier courant n'est pas un board Kanbam",
  'Convert empty note to Kanban': 'Convertir une note vide en board',
  'Error: cannot create Kanban, the current note is not empty':
    "Erreur : impossible de créer le board, la note courante n'est pas vide",
  'New kanban board': 'Nouveau board',
  'Untitled Kanban': 'Board sans titre',
  'Toggle between Kanban and markdown mode': 'Basculer entre le board et le markdown',

  'View as board': 'Afficher en board',
  'View as list': 'Afficher en liste',
  'View as table': 'Afficher en tableau',
  'Board view': 'Affichage du board',

  // KanbanView.tsx
  'Open as markdown': 'Ouvrir en markdown',
  'Open board settings': 'Ouvrir les paramètres du board',
  'Archive completed cards': 'Archiver les cartes terminées',
  'Something went wrong': "Quelque chose s'est mal passé",
  'You may wish to open as markdown and inspect or edit the file.':
    'Vous pouvez ouvrir le fichier en markdown pour l’inspecter ou le corriger.',
  'Are you sure you want to archive all completed cards on this board?':
    'Voulez-vous vraiment archiver toutes les cartes terminées de ce board ?',

  // parser.ts
  // « Complete » et « Archive » ne sont PAS traduits : ces deux chaînes sont
  // écrites dans le fichier du board (`**Complete**`, `## Archive`) puis
  // relues telles quelles par le parseur. Les traduire rendrait illisibles
  // les boards déjà enregistrés, et les fichiers dépendraient de la langue
  // de l'utilisateur. Voir parsers/formats/list.ts (lignes 231, 267, 415, 431).
  'Invalid Kanban file: problems parsing frontmatter':
    'Fichier de board invalide : impossible de lire le frontmatter',
  "I don't know how to interpret this line:": 'Impossible d’interpréter cette ligne :',
  Untitled: 'Sans titre', // colonne créée automatiquement

  // settingHelpers.ts
  'Note: No template plugins are currently enabled.':
    'Note : aucune extension de modèles n’est actuellement activée.',
  default: 'par défaut',
  'Search...': 'Rechercher…',

  // Settings.ts
  'New line trigger': 'Touche de nouvelle ligne',
  'Select whether Enter or Shift+Enter creates a new line. The opposite of what you choose will create and complete editing of cards and lists.':
    'Choisissez si Entrée ou Maj+Entrée insère une nouvelle ligne. L’autre combinaison validera la carte ou la liste en cours d’édition.',
  'Shift + Enter': 'Maj + Entrée',
  Enter: 'Entrée',
  'Prepend / append new cards': 'Ajouter les nouvelles cartes au début / à la fin',
  'This setting controls whether new cards are added to the beginning or end of the list.':
    'Détermine si les nouvelles cartes sont ajoutées au début ou à la fin de la liste.',
  Prepend: 'Au début',
  'Prepend (compact)': 'Au début (compact)',
  Append: 'À la fin',
  'These settings will take precedence over the default Kanban board settings.':
    'Ces paramètres ont priorité sur les paramètres par défaut des boards.',
  'Set the default Kanban board settings. Settings can be overridden on a board-by-board basis.':
    'Définit les paramètres par défaut des boards. Chaque board peut les redéfinir de son côté.',
  'Note template': 'Modèle de note',
  'This template will be used when creating new notes from Kanban cards.':
    'Ce modèle sera utilisé lors de la création de notes depuis une carte.',
  'No template': 'Aucun modèle',
  'Note folder': 'Dossier des notes',
  'Notes created from Kanban cards will be placed in this folder. If blank, they will be placed in the default location for this vault.':
    'Les notes créées depuis une carte seront placées dans ce dossier. Si le champ est vide, elles iront à l’emplacement par défaut du coffre.',
  'Default folder': 'Dossier par défaut',
  'List width': 'Largeur des listes',
  'Expand lists to full width in list view':
    'Étendre les listes sur toute la largeur en affichage liste',
  'Enter a number to set the list width in pixels.':
    'Saisissez un nombre pour fixer la largeur des listes en pixels.',
  'Maximum number of archived cards': 'Nombre maximum de cartes archivées',
  "Archived cards can be viewed in markdown mode. This setting will begin removing old cards once the limit is reached. Setting this value to -1 will allow a board's archive to grow infinitely.":
    'Les cartes archivées sont consultables en mode markdown. Une fois la limite atteinte, les plus anciennes sont supprimées. La valeur -1 laisse l’archive grandir sans limite.',
  'Display card checkbox': 'Afficher la case à cocher des cartes',
  'When toggled, a checkbox will be displayed with each card':
    'Si activé, une case à cocher est affichée sur chaque carte',
  'Reset to default': 'Réinitialiser',
  'Date & Time': 'Date et heure',
  'Date trigger': 'Déclencheur de date',
  'When this is typed, it will trigger the date selector':
    'Saisir ce caractère ouvre le sélecteur de date',
  'Time trigger': 'Déclencheur d’heure',
  'When this is typed, it will trigger the time selector':
    'Saisir ce caractère ouvre le sélecteur d’heure',
  'Date format': 'Format de date',
  'This format will be used when saving dates in markdown.':
    'Ce format sera utilisé pour enregistrer les dates dans le markdown.',
  'For more syntax, refer to': 'Pour la syntaxe complète, voir la',
  'format reference': 'référence des formats',
  'Your current syntax looks like this': 'Votre syntaxe actuelle donne',
  'Time format': 'Format d’heure',
  'Date display format': 'Format d’affichage des dates',
  'This format will be used when displaying dates in Kanban cards.':
    'Ce format sera utilisé pour afficher les dates sur les cartes.',
  'Show relative date': 'Afficher la date relative',
  "When toggled, cards will display the distance between today and the card's date. eg. 'In 3 days', 'A month ago'. Relative dates will not be shown for dates from the Tasks and Dataview plugins.":
    'Si activé, les cartes affichent l’écart entre aujourd’hui et leur date, par exemple « dans 3 jours » ou « il y a un mois ». Les dates issues des extensions Tasks et Dataview ne sont pas concernées.',

  'Move dates to card footer': 'Déplacer les dates en pied de carte',
  "When toggled, dates will be displayed in the card's footer instead of the card's body.":
    'Si activé, les dates sont affichées en pied de carte plutôt que dans son corps.',
  'Move tags to card footer': 'Déplacer les étiquettes en pied de carte',
  "When toggled, tags will be displayed in the card's footer instead of the card's body.":
    'Si activé, les étiquettes sont affichées en pied de carte plutôt que dans son corps.',
  'Move task data to card footer': 'Déplacer les données de tâche en pied de carte',
  "When toggled, task data (from the Tasks plugin) will be displayed in the card's footer instead of the card's body.":
    'Si activé, les données de tâche (extension Tasks) sont affichées en pied de carte plutôt que dans son corps.',
  'Inline metadata position': 'Position des métadonnées en ligne',
  'Controls where the inline metadata (from the Dataview plugin) will be displayed.':
    'Détermine où sont affichées les métadonnées en ligne (extension Dataview).',
  'Card body': 'Corps de la carte',
  'Card footer': 'Pied de la carte',
  'Merge with linked page metadata': 'Fusionner avec les métadonnées de la page liée',

  'Hide card counts in list titles': 'Masquer le nombre de cartes dans le titre des listes',
  'When toggled, card counts are hidden from the list title':
    'Si activé, le nombre de cartes est masqué dans le titre des listes',
  'Link dates to daily notes': 'Lier les dates aux notes quotidiennes',
  'When toggled, dates will link to daily notes. Eg. [[2021-04-26]]':
    'Si activé, les dates deviennent des liens vers les notes quotidiennes. Ex. [[2021-04-26]]',
  'Add date and time to archived cards': 'Ajouter la date et l’heure aux cartes archivées',
  'When toggled, the current date and time will be added to the card title when it is archived. Eg. - [ ] 2021-05-14 10:00am My card title':
    'Si activé, la date et l’heure courantes sont ajoutées au titre de la carte au moment de l’archivage. Ex. - [ ] 2021-05-14 10:00 Titre de ma carte',
  'Add archive date/time after card title': 'Placer la date d’archivage après le titre de la carte',
  'When toggled, the archived date/time will be added after the card title, e.g.- [ ] My card title 2021-05-14 10:00am. By default, it is inserted before the title.':
    'Si activé, la date d’archivage est ajoutée après le titre de la carte, ex. - [ ] Titre de ma carte 2021-05-14 10:00. Par défaut, elle est insérée avant le titre.',
  'Archive date/time separator': 'Séparateur de la date d’archivage',
  'This will be used to separate the archived date/time from the title':
    'Sépare la date d’archivage du titre de la carte',
  'Archive date/time format': 'Format de la date d’archivage',
  'Kanban Plugin': 'Kanbam',
  'Tag click action': 'Action au clic sur une étiquette',
  'Search Kanban Board': 'Rechercher dans le board',
  'Search Obsidian Vault': 'Rechercher dans le coffre Obsidian',
  'This setting controls whether clicking the tags displayed below the card title opens the Obsidian search or the Kanban board search.':
    'Détermine si un clic sur les étiquettes affichées sous le titre d’une carte ouvre la recherche d’Obsidian ou celle du board.',
  'Tag colors': 'Couleurs des étiquettes',
  'Set colors for tags displayed in cards.':
    'Définit les couleurs des étiquettes affichées sur les cartes.',
  'Linked Page Metadata': 'Métadonnées de la page liée',
  'Inline Metadata': 'Métadonnées en ligne',
  'Display metadata for the first note linked within a card. Specify which metadata keys to display below. An optional label can be provided, and labels can be hidden altogether.':
    'Affiche les métadonnées de la première note liée dans une carte. Indiquez ci-dessous les clés à afficher. Un libellé facultatif peut être ajouté, et les libellés peuvent être masqués complètement.',
  'Board Header Buttons': 'Boutons d’en-tête du board',
  'Calendar: first day of week': 'Calendrier : premier jour de la semaine',
  'Override which day is used as the start of the week':
    'Choisir le jour utilisé comme début de semaine',
  Sunday: 'Dimanche',
  Monday: 'Lundi',
  Tuesday: 'Mardi',
  Wednesday: 'Mercredi',
  Thursday: 'Jeudi',
  Friday: 'Vendredi',
  Saturday: 'Samedi',
  'Background color': 'Couleur de fond',
  Tag: 'Étiquette',
  'Text color': 'Couleur du texte',
  'Date is': 'La date est',
  Today: 'Aujourd’hui',
  'After now': 'Après maintenant',
  'Before now': 'Avant maintenant',
  'Between now and': 'Entre maintenant et',
  'Display date colors': 'Colorer les dates',
  'Set colors for dates displayed in cards based on the rules below.':
    'Définit les couleurs des dates affichées sur les cartes selon les règles ci-dessous.',
  'Add date color': 'Ajouter une couleur de date',

  // MetadataSettings.tsx
  'Metadata key': 'Clé de métadonnée',
  'Display label': 'Afficher le libellé',
  'Hide label': 'Masquer le libellé',
  'Drag to rearrange': 'Glisser pour réordonner',
  Delete: 'Supprimer',
  'Add key': 'Ajouter une clé',
  'Add tag': 'Ajouter une étiquette',
  'Field contains markdown': 'Le champ contient du markdown',
  'Tag sort order': 'Ordre de tri des étiquettes',
  'Set an explicit sort order for the specified tags.':
    'Définit un ordre de tri explicite pour les étiquettes indiquées.',

  // TagColorSettings.tsx
  'Add tag color': 'Ajouter une couleur d’étiquette',

  // components/Table.tsx
  List: 'Liste',
  Card: 'Carte',
  Date: 'Date',
  Tags: 'Étiquettes',

  Priority: 'Priorité',
  Start: 'Début',
  Created: 'Création',
  Scheduled: 'Planifiée',
  Due: 'Échéance',
  Cancelled: 'Annulée',
  Recurrence: 'Récurrence',
  'Depends on': 'Dépend de',
  ID: 'ID',

  // components/Item/Item.tsx
  'More options': 'Plus d’options',
  Cancel: 'Annuler',
  Done: 'Terminé',
  Save: 'Enregistrer',

  // components/Item/ItemContent.tsx
  today: 'aujourd’hui',
  yesterday: 'hier',
  tomorrow: 'demain',
  'Change date': 'Changer la date',
  'Change time': 'Changer l’heure',

  // components/Item/ItemForm.tsx
  'Card title...': 'Titre de la carte…',
  'Add card': 'Ajouter la carte',
  'Add a card': 'Ajouter une carte',

  // components/Item/ItemMenu.ts
  'Edit card': 'Modifier la carte',
  'New note from card': 'Nouvelle note depuis la carte',
  'Open note': 'Ouvrir la note',
  'Archive card': 'Archiver la carte',
  'Delete card': 'Supprimer la carte',
  'Edit date': 'Modifier la date',
  'Add date': 'Ajouter une date',
  'Remove date': 'Retirer la date',
  'Edit time': 'Modifier l’heure',
  'Add time': 'Ajouter une heure',
  'Remove time': 'Retirer l’heure',
  'Duplicate card': 'Dupliquer la carte',
  'Split card': 'Scinder la carte',
  'Copy link to card': 'Copier le lien vers la carte',
  'Insert card before': 'Insérer une carte avant',
  'Insert card after': 'Insérer une carte après',
  'Add label': 'Ajouter un libellé',
  'Move to top': 'Déplacer tout en haut',
  'Move to bottom': 'Déplacer tout en bas',
  'Move to list': 'Déplacer vers la liste',
  'The note could not be created. The card title may be too long, or rejected by the file system.':
    'La note n’a pas pu être créée. Le titre de la carte est peut-être trop long, ou refusé par le système de fichiers.',
  'The folder configured for new notes no longer exists. The note was created in the default location.':
    'Le dossier configuré pour les nouvelles notes n’existe plus. La note a été créée à l’emplacement par défaut.',

  // components/Lane/LaneForm.tsx
  'Enter list title...': 'Titre de la liste…',
  'Mark cards in this list as complete': 'Marquer les cartes de cette liste comme terminées',
  'Add list': 'Ajouter',
  'Add a list': 'Ajouter une liste',

  // components/Lane/LaneHeader.tsx
  'Move list': 'Déplacer la liste',
  Close: 'Fermer',

  // components/Lane/LaneMenu.tsx
  'Are you sure you want to delete this list and all its cards?':
    'Voulez-vous vraiment supprimer cette liste et toutes ses cartes ?',
  'Yes, delete list': 'Oui, supprimer la liste',
  'Are you sure you want to archive this list and all its cards?':
    'Voulez-vous vraiment archiver cette liste et toutes ses cartes ?',
  'Yes, archive list': 'Oui, archiver la liste',
  'Are you sure you want to archive all cards in this list?':
    'Voulez-vous vraiment archiver toutes les cartes de cette liste ?',
  'Yes, archive cards': 'Oui, archiver les cartes',
  'Edit list': 'Modifier la liste',
  'Archive cards': 'Archiver les cartes',
  'Archive list': 'Archiver la liste',
  'Delete list': 'Supprimer la liste',
  'Insert list before': 'Insérer une liste avant',
  'Insert list after': 'Insérer une liste après',
  'Sort by card text': 'Trier par texte de carte',
  'Sort by date': 'Trier par date',
  'Sort by tags': 'Trier par étiquettes',
  'Sort by': 'Trier par',

  // components/helpers/renderMarkdown.ts
  'Unable to find': 'Introuvable',
  'Open in default app': 'Ouvrir dans l’application par défaut',

  // components/Editor/MarkdownEditor.tsx
  Submit: 'Valider',
};

export default lang;
