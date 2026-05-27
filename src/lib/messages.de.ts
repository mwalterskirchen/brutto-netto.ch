export const messages = {
  brand: {
    wordmark: 'brutto-netto.ch',
    tagline: 'Schweiz · 2026',
    a11yHeading: 'Brutto Netto Lohnrechner Schweiz 2026',
  },
  privacy: {
    localTag: 'local',
    badge: '0 requests',
    badgeNote: '100% in deinem Browser',
  },
  calculator: {
    frequency: {
      label: 'Lohnfrequenz',
      monthly: 'monatlich',
      annual: 'jährlich',
    },
    grossSalary: {
      labelMonthly: 'Brutto pro Monat',
      labelAnnual: 'Brutto pro Jahr',
      placeholder: '0',
      unit: 'CHF',
    },
    age: {
      label: 'Alter',
      placeholder: '—',
      unit: 'Jahre',
    },
    toggles: {
      thirteenth: '13. Monatslohn',
      ktg: 'Krankentaggeld',
    },
    receipt: {
      grossHeading: 'Brutto',
      netHeading: 'Netto',
      deductionsHeading: (period: 'monthly' | 'annual') =>
        period === 'monthly' ? 'Monatliche Abzüge' : 'Jährliche Abzüge',
      totalLabel: 'Gesamtabzug',
      ofGross: 'vom Brutto',
      ghostHint: 'Beispiel — gib deinen Lohn ein',
      taxDisclaimer: 'Einkommens- und Quellensteuer nicht enthalten.',
    },
    viz: {
      sankeyAria: 'Flussdiagramm der Lohnabzüge',
      waterfallAria: 'Wasserfall-Diagramm der Lohnabzüge',
      nodeGross: 'Brutto',
      nodeNet: 'Netto',
    },
  },
  deductions: {
    ahvIvEo: {
      label: 'AHV / IV / EO',
      full: 'Alters-, Invaliden- und Erwerbsersatz',
      explanation: 'Staatliche Sozialversicherung — finanziert Renten, Invaliditäts- und Erwerbsausfallleistungen.',
    },
    bvg: {
      label: 'BVG',
      full: 'Berufliche Vorsorge (2. Säule)',
      explanation: 'Pensionskasse — dein Beitrag hängt von Alter und koordiniertem Lohn ab.',
    },
    alv: {
      label: 'ALV',
      full: 'Arbeitslosenversicherung',
      explanation: 'Schützt bei Arbeitslosigkeit. Über CHF 148’200/Jahr greift der reduzierte Solidaritätssatz.',
    },
    nbu: {
      label: 'NBU',
      full: 'Nichtberufsunfallversicherung',
      explanation: 'Versichert dich gegen Unfälle ausserhalb der Arbeit.',
    },
    ktg: {
      label: 'KTG',
      full: 'Krankentaggeldversicherung',
      explanation: 'Optional — sichert deinen Lohn bei längerer Krankheit ab.',
    },
  },
  sections: {
    howItWorks: {
      eyebrow: 'so funktioniert’s',
      heading: 'Vom Brutto zum Netto',
    },
    faq: {
      eyebrow: 'fragen & antworten',
      heading: 'Was du wissen solltest',
    },
  },
  footer: {
    privacy: 'Datenschutz',
    imprint: 'Impressum',
    disclaimer: 'Haftungsausschluss',
    github: 'Open Source auf GitHub',
    builtBy: 'gebaut von',
  },
} as const;
