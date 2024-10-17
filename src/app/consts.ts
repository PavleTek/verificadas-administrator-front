import {
  SessionDuration,
  HairColor,
  ChestSize,
  BottomSize,
  Contexture,
  EyeColor,
  ShavingStatus,
  VerificationStatus,
  PaymentTier,
  SubscriptionDuration,
} from './types';

export const eyeColorOptions = [EyeColor.BLACK, EyeColor.BROWN_LIGHT, EyeColor.BROWN_DARK, EyeColor.BLUE, EyeColor.GREEN];
export const contextureOptions = [Contexture.THIN, Contexture.MEDIUM, Contexture.BIG];
export const bottomSizeOptions = [BottomSize.SMALL, BottomSize.MEDIUM, BottomSize.BIG];
export const chestSizeOptions = [ChestSize.SMALL, ChestSize.MEDIUM, ChestSize.BIG];
export const verificationStatusOptions = [VerificationStatus.PENDING, VerificationStatus.SCHEDULED, VerificationStatus.PROCESSING, VerificationStatus.VERIFIED];
export const hairColorOptions = [HairColor.BLACK, HairColor.BROWN_LIGHT, HairColor.BROWN_DARK, HairColor.BLONDE, HairColor.GINGER];
export const sessionDurationOptions = [
  SessionDuration.THIRTY_MINUTES,
  SessionDuration.ONE_HOUR,
  SessionDuration.HOUR_AND_HALF,
  SessionDuration.TWO_HOURS,
  SessionDuration.FOUR_HOURS,
  SessionDuration.NIGHT,
  SessionDuration.DINNER,
];
export const paymentTierOptions = [PaymentTier.PREMIUM, PaymentTier.REGULAR, PaymentTier.ECONOMIC, PaymentTier.SPECIAL];
export const subcsriptionDurationOptions = [SubscriptionDuration.MONTH, SubscriptionDuration.TWO_WEEKS, SubscriptionDuration.ONE_WEEK];
export const retoqueOptions = ['Nulo', 'Leve', 'Editado'];
export const shavingStatusOptions = [ShavingStatus.FULL, ShavingStatus.TRIMED, ShavingStatus.NONE];
export const languageOptions = [
  'Español',
  'English',
  'Português',
  'Italiano',
  'Français',
  'Deutsch',
  'Nederlands',
  'Русский',
  '日本語',
  '中文',
  'العربية',
  'हिन्दी',
  '한국어',
  'Türkçe',
  'Polski',
  'Svenska',
  'Norsk',
  'Dansk',
  'Suomi',
];
export const timeOptions = [
  '00:00',
  '00:30',
  '01:00',
  '01:30',
  '02:00',
  '02:30',
  '03:00',
  '03:30',
  '04:00',
  '04:30',
  '05:00',
  '05:30',
  '06:00',
  '06:30',
  '07:00',
  '07:30',
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:00',
  '20:30',
  '21:00',
  '21:30',
  '22:00',
  '22:30',
  '23:00',
  '23:30',
  '24:00',
];

export const PaymentTierToNumberMap: { [key in PaymentTier]: number } = {
  [PaymentTier.SPECIAL]: 90,
  [PaymentTier.PREMIUM]: 90,
  [PaymentTier.REGULAR]: 60,
  [PaymentTier.ECONOMIC]: 30,
};

export const paymentTierToMaxImagesMap: { [key in PaymentTier]: number } = {
  [PaymentTier.SPECIAL]: 16,
  [PaymentTier.PREMIUM]: 16,
  [PaymentTier.REGULAR]: 12,
  [PaymentTier.ECONOMIC]: 8,
};