export enum PropertyType {
  SALE = 'sale',
  RENT = 'rent'
}

export enum PropertyStatus {
  AVAILABLE = 'available',
  SOLD = 'sold',
  RENTED = 'rented'
}

export enum PropertyCategory {
  APARTMENT = 'apartment',
  HOUSE = 'house',
  OFFICE = 'office',
  VILLA = 'villa',
  STUDIO = 'studio'
}

export enum FrenchCities {
  PARIS = "Paris",
  MARSEILLE = "Marseille",
  LYON = "Lyon",
  TOULOUSE = "Toulouse",
  NICE = "Nice",
  NANTES = "Nantes",
  MONTPELLIER = "Montpellier",
  STRASBOURG = "Strasbourg",
  BORDEAUX = "Bordeaux",
  LILLE = "Lille",
  RENNES = "Rennes",
  REIMS = "Reims",
  TOULON = "Toulon",
  SAINT_ETIENNE = "Saint-Étienne",
  LE_HAVRE = "Le Havre",
  GRENOBLE = "Grenoble",
  DIJON = "Dijon",
  ANGERS = "Angers",
  NIMES = "Nîmes",
  VILLEURBANNE = "Villeurbanne",
  CLERMONT_FERRAND = "Clermont-Ferrand",
  AIXEN_PROVENCE = "Aix-en-Provence",
  BREST = "Brest",
  TOURS = "Tours",
  AMIENS = "Amiens",
  LIMOGES = "Limoges",
  ANNECY = "Annecy",
  PERPIGNAN = "Perpignan",
  BOULOGNE_BILLANCOURT = "Boulogne-Billancourt",
  ORLEANS = "Orléans",
  METZ = "Metz",
  ROUEN = "Rouen",
  MULHOUSE = "Mulhouse",
  CAEN = "Caen",
  NANCY = "Nancy",
  ARGENTEUIL = "Argenteuil",
  MONTREUIL = "Montreuil",
  ROUBAIX = "Roubaix",
  TOURCOING = "Tourcoing",
  NANTERRE = "Nanterre",
  AVIGNON = "Avignon",
  CRETEIL = "Créteil",
  DUNKERQUE = "Dunkerque",
  POITIERS = "Poitiers",
  ASNIERES_SUR_SEINE = "Asnières-sur-Seine",
  COURBEVOIE = "Courbevoie",
  VERSAILLES = "Versailles",
  COLOMBES = "Colombes",
  FORT_DE_FRANCE = "Fort-de-France",
  AULNAY_SOUS_BOIS = "Aulnay-sous-Bois",
  SAINT_PAUL = "Saint-Paul",
  RUEIL_MALMAISON = "Rueil-Malmaison",
  PAU = "Pau",
  AUBERVILLIERS = "Aubervilliers",
  CHAMPIGNY_SUR_MARNE = "Champigny-sur-Marne",
  SAINT_MAUR_DES_FOSSES = "Saint-Maur-des-Fossés",
  CANNES = "Cannes",
  BÉZIERS = "Béziers",
  CALAIS = "Calais",
  SAINT_NAZAIRE = "Saint-Nazaire",
  COLMAR = "Colmar",
  DRANCY = "Drancy",
  AJACCIO = "Ajaccio",
  LEVALLOIS_PERRET = "Levallois-Perret",
  ISSY_LES_MOULINEAUX = "Issy-les-Moulineaux",
  VILLENEUVE_D_ASCQ = "Villeneuve-d'Ascq",
  NEUILLY_SUR_SEINE = "Neuilly-sur-Seine",
  ANTONY = "Antony",
  TROYES = "Troyes",
  MONTAUBAN = "Montauban",
  BOURGES = "Bourges",
  CANTELEU = "Canteleu",
  SARCELLES = "Sarcelles",
  PESSAC = "Pessac",
  BAYONNE = "Bayonne",
  LORIENT = "Lorient",
  BEAUVAIS = "Beauvais",
  CHOLET = "Cholet",
  VANNES = "Vannes",
  LAVAL = "Laval",
  VALENCIENNES = "Valenciennes",
  CLICHY = "Clichy",
  MONTROUGE = "Montrouge",
  MEAUX = "Meaux",
  CHELLES = "Chelles",
}

export const FRENCH_CITIES_LIST = Object.values(FrenchCities).sort();

export interface Property {
  id: string;
  title: string;
  city: string;
  price: number;
  surface: number;
  type: PropertyType;
  status: PropertyStatus;
  category: PropertyCategory;
  images: string[];
}

export interface CreatePropertyDTO {
  title: string;
  city: string;
  price: number;
  surface: number;
  type: PropertyType;
  category: PropertyCategory;
  images?: string[];
}

export interface UpdatePropertyDTO {
  title?: string;
  city?: string;
  price?: number;
  surface?: number;
  type?: PropertyType;
  category?: PropertyCategory;
  status?: PropertyStatus;
  images?: string[];
}