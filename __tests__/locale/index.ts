import ru from './ru';

const locales = {
  ru,
} as const;

const locale = process.env.LOCALE?.split('-').at(0) as keyof typeof locales | undefined;

if (!locale) {
  throw new Error('LOCALE env var is required (e.g. LOCALE=ru)');
}

const ui = locales[locale];

if (!ui) {
  throw new Error(`Unsupported LOCALE: ${locale}`);
}

export default ui;
