export type GirlUser = {
  id: number;
  email: string;
  password: string;
  role: 'girl'; // Assuming 'role' can have other values, you can expand this type accordingly
  girlId: number;
  girl: Girl;
  welcomeMessage: string;
  welcomeSent: boolean;
  changePasswordMessage: string;
  changePasswordSent: boolean;
  edit?: Boolean;
};

export type AdminUser = {
  id: number;
  email: string;
  password: string;
  role: 'admin'; // Assuming 'role' can have other values, you can expand this type accordingly
  girlId?: number;
  girl?: Girl;
};

export type PricingPlan = {
  id: number;
  name: string;
  price: number;
  discount: number;
  discountMessage: string;
};

export type SeoCategory = {
  id?: number;
  name: string;
  metaTitle: string;
  metaDescription: string;
  edit?: boolean;
  new?: boolean;
};

export type Banner = {
  id: number;
  message: number;
  showBanner: boolean;
};

export type Girl = {
  id: number;
  name: string; // added to html Done
  bday: Date; //added to html Done
  active: boolean; // for admin only MISSING
  hiden: boolean;
  bluredFace: boolean; // added to html Done
  cityId?: number; // Not USED
  specificLocation: {
    id: number;
    name: string;
  }; // added to html Done
  phoneNumber: string; // added to html Done
  description: string; //added to html Done
  sessionPrices: PricesObject; // added to html Almost Done missing min-max
  sessionPricesId?: number; // added to html Almost Done missing min-max
  ethnicity: {
    id: number;
    name: string;
  }; // added to html Done
  height: number; // added to html Done
  weight: number; // added to html Done
  barbie: boolean;
  chestCm: number; // added to html Done
  waistCm: number; // added to html Done
  bottomCm: number; // added to html Done
  parking: boolean; // added to html Done
  schedule: ScheduleRow[]; // added to html Missing Functionality
  attributes: Attributes; // added to html Done
  images: MultimediaObject; // added to html Missing Functionality
  videos: MultimediaObject; // added to html Missing Functionality
  requestProfilePicture?: string;
  profilePicture: string; // added to html Missing Functionality
  editLevel: string; // added to html Missing Functionality
  nationality: {
    id: number;
    name: string;
  }; // added to html Missing Functionality
  categories: GirlCategory[]; // should only allow change of order
  verificationId: number | null; // not going to be added for admin only
  city: {
    id: number;
    name: string;
  }; // added to html
  services: any[]; // added to html
  paidServices: any[]; // NEW ADDITION, these ones must be present in "services" but have to have a tooltip that they are extra
  paymentTier: PaymentTier;
  subscription: Subscription;
  verification: Verification; // not going to be added, for admin only
};

export type Attributes = {
  contexture: Contexture;
  hair: HairColor;
  eyes: EyeColor;
  chestSize: ChestSize;
  bottomSize: BottomSize;
  shaving: ShavingStatus; // shown
  attentionAtHotels: boolean; // shown
  attentionAtGirlPlace: boolean; // shown
  attentionAtClientPlace: boolean; // shown
  smoking: boolean; // shown
  tatoos: boolean; // shown
  languages: string[]; // shown
};

export type PricesObject = {
  id?: number;
  halfHourPrice?: number;
  oneHourPrice: number;
  oneAndAHalfHourPrice?: number;
  twoHourPrice?: number;
  fourHourPrice?: number;
  dinnerPrice?: number;
  wholeNight?: number;
  girlId?: number;
  girl?: Girl;
};

export type MultimediaObject = {
  active: string[];
  request: string[];
  bluredFace: string[];
};

export type Subscription = {
  id?: number;
  girlId?: number;
  availablePauses: number;
  pauseStartDate: Date | undefined;
  pauseEndDate: Date | undefined;
  expiryDate: Date; // when subscription will expire
  deactivationDate: Date; // when client will actually get deactivated | 3 days after expiry
};

export type SubscriptionPayment = {
  id?: number;
  paymentTier: PaymentTier;
  amountPaid: number;
  paymentDate: Date;
  duration: SubscriptionDuration;
  paymentMethod: string;
};

export enum SubscriptionDuration {
  MONTH = 'month',
  TWO_WEEKS = '2weeks',
  ONE_WEEK = '1week',
}

export enum EyeColor {
  BLACK = 'Ojos Negros',
  BROWN_LIGHT = 'Ojos castaño claros',
  BROWN_DARK = 'Ojos castaño oscuro',
  BLUE = 'Ojos azules',
  GREEN = 'Ojos verdes',
}

export enum Contexture {
  THIN = 'Contextura delgada',
  MEDIUM = 'Contextura media',
  BIG = 'Contextura gruesa',
}

export enum BottomSize {
  SMALL = 'Trasero pequeño',
  MEDIUM = 'Trasero medio',
  BIG = 'Trasero grande',
}

export enum ChestSize {
  SMALL = 'Senos pequeños',
  MEDIUM = 'Senos medianos',
  BIG = 'Senos grandes',
}

export enum HairColor {
  BLACK = 'Cabello negro',
  BROWN_LIGHT = 'Cabello castaño claro',
  BROWN_DARK = 'Cabello castaño oscuro',
  BLONDE = 'Cabello rubio',
  GINGER = 'Cabello peli rojo',
}

export enum ShavingStatus {
  FULL = 'Depilación completa',
  TRIMED = 'Depilación de rebaje',
  NONE = 'Sin Depilar',
}

export enum EditLevel {
  NONE = 'Nulo',
  MID = 'Leve',
  FULL = 'Editado',
}

export type AtentionPlaces = {
  delivery: boolean;
  hotels: boolean;
  ownPlace: boolean;
};

export type Verification = {
  id: number; // not editable
  carnetFrontal: string;
  carnetAtras: string;
  status: VerificationStatus; // implmemented in verification page
  name: string; // implemented in verification Page
  lastname: string; // implmented in verifcation Page
  bday: string; // implemented in verification Page
  rut: string | null; // implemented In Verification Page
  scheduledLink: string | null;
  verificationDate: string | null; // backEnd Implementation
  verifiedBy: number | null; // backEndImplementation
  girlId: number; // not editable
};

export type AppNotification = {
  id: number;
  type: string;
  fromUserId: number;
  date: Date;
  searchId: number;
};

export type AnounceRequest = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  paymentTier: string;
  message: string;
};

export type Service = {
  id?: number;
  name: string;
  description: string;
  metaTitle?: string;
  metaDescription?: string;
  edit?: boolean;
  new?: boolean;
};

export type Blog = {
  id?: number;
  title: string;
  shortDescription: string;
  content?: string;
  metaTitle?: string;
  category?: string;
  metaDescription?: string;
  createdAt?: Date;
};

export type City = {
  id?: number;
  name: string;
  metaTitle?: string;
  metaDescription?: string;
  edit?: boolean;
  new?: boolean;
};

export type SpecificLocation = {
  id?: number;
  name: string;
  metaTitle?: string;
  metaDescription?: string;
  edit?: boolean;
  new?: boolean;
};

export type Ethnicity = {
  id?: number;
  name: string;
  metaTitle?: string;
  metaDescription?: string;
  edit?: boolean;
  new?: boolean;
};

export type Nationality = {
  id?: number;
  name: string;
  metaTitle?: string;
  metaDescription?: string;
  edit?: boolean;
  new?: boolean;
};

export enum SessionDuration {
  THIRTY_MINUTES = '30 Minutos',
  ONE_HOUR = '1 Hora',
  HOUR_AND_HALF = '1 Hora y media',
  TWO_HOURS = '2 Horas',
  FOUR_HOURS = '4 Horas',
  NIGHT = 'Noche Completa',
  DINNER = 'Cena',
}

export type TimeBracket = {
  startTime: string;
  endTime: string;
};

export type ScheduleRow = {
  monday: TimeBracket | undefined;
  tuesday: TimeBracket | undefined;
  wednesday: TimeBracket | undefined;
  thursday: TimeBracket | undefined;
  friday: TimeBracket | undefined;
  saturday: TimeBracket | undefined;
  sunday: TimeBracket | undefined;
};

export enum GirlCategory {
  GOLD = 'Gold',
  SILVER = 'Silver',
  BRONZE = 'Bronze',
  MADURAS = 'Maduras',
  MASAJISTAS = 'Masajistas',
  BARBIE = 'Barbie',
}

export enum PaymentTier {
  SPECIAL = 'Especial',
  PREMIUM = 'Premium',
  REGULAR = 'Regular',
  ECONOMIC = 'Economica',
}

export enum VerificationStatus {
  PENDING = 'Pending',
  SCHEDULED = 'Scheduled',
  PROCESSING = 'Processing',
  VERIFIED = 'Verified',
}

export enum UserRole {
  ADMIN = 'admin',
  GIRL = 'girl',
}

export type AllDaysTimeOptions = {
  monday: string[];
  tuesday: string[];
  wednesday: string[];
  thursday: string[];
  friday: string[];
  saturday: string[];
  sunday: string[];
};

export type ClientReview = {
  id?: number;
  girlId?: number;
  review: string;
  rating: number;
  date?: string | Date;
  phoneNumber: string;
};
