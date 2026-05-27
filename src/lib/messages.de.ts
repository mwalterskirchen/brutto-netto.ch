export const messages = {
  brand: {
    wordmark: 'brutto-netto.ch',
    tagline: 'Schweiz · 2026',
    hero: {
      headline: 'Dein Netto. Ohne dass es jemand mitliest.',
      subline:
        'Brutto Netto für die Schweiz, 2026. Die Berechnung läuft in deinem Browser. Kein Server, kein Tracking, kein Account. Open Source.',
    },
  },
  privacy: {
    badge: '0 requests',
    badgeNote: 'läuft lokal',
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
      placeholder: '·',
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
      taxDisclaimer: 'Ohne Kantons- und Quellensteuer.',
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
      explanation: 'Staatliche Sozialversicherung. Finanziert Renten, Invaliditäts- und Erwerbsausfallleistungen.',
    },
    bvg: {
      label: 'BVG',
      full: 'Berufliche Vorsorge (2. Säule)',
      explanation: 'Pensionskasse. Dein Beitrag hängt von Alter und koordiniertem Lohn ab.',
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
      explanation: 'Optional. Sichert deinen Lohn bei längerer Krankheit ab.',
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
  comparison: {
    label: (year: number) => `Schweizer Medianlohn ${year}`,
    monthlyNote: 'Brutto · 100% FTE',
    annualNote: '× 12 · BFS rapportiert monatlich',
    source: 'BFS LSE',
  },
  share: {
    cta: 'Link kopieren',
    copied: 'kopiert',
    aria: 'Resultat als Link teilen. Die Daten stecken in der URL, nicht auf einem Server.',
  },
  taxRoadmap: {
    line: 'Kantons- und Quellensteuer kommen 2027.',
    cta: 'Auf GitHub verfolgen',
  },
  methodology: {
    eyebrow: 'methodologie',
    heading: 'Wie wir rechnen, und woher die Zahlen kommen',
    includes: {
      heading: 'Eingerechnet',
      items: [
        'AHV / IV / EO (5.3% des Bruttolohns)',
        'BVG / Pensionskasse (altersabhängig, koordinierter Lohn)',
        'ALV (1.1% bis 148’200 CHF, darüber 0.5% Solidaritätssatz)',
        'NBU / Nichtberufsunfallversicherung (1.0%)',
        'KTG / Krankentaggeld (0.8%, optional)',
      ],
    },
    excludes: {
      heading: 'Nicht eingerechnet',
      items: [
        'Kantonale Einkommenssteuer',
        'Quellensteuer für Nicht-Niedergelassene',
        'Kirchensteuer',
        'Individuelle Pensionskassen-Varianten (überobligatorisch)',
      ],
    },
    sources: {
      heading: 'Quellen & Datenstand',
      asOf: 'Datenstand · 01.01.2026',
      items: [
        { label: 'BSV · Bundesamt für Sozialversicherungen', url: 'https://www.bsv.admin.ch/' },
        {
          label: 'ASGA · Beitragstabelle 2026 (PDF)',
          url: 'https://www.asga.ch/wp-content/uploads/downloads/merkblaetter/merkblaetter-e/renten-und-grenzbetraege_2026_e.pdf',
        },
        {
          label: 'BFS Lohnstrukturerhebung 2024',
          url: 'https://www.bfs.admin.ch/bfs/de/home/aktuell/neue-veroeffentlichungen.assetdetail.36195847.html',
        },
        {
          label: 'Quellcode · deduction-rates.ts',
          url: 'https://github.com/mwalterskirchen/brutto-netto.ch/blob/main/src/lib/deduction-rates.ts',
        },
        {
          label: 'Letzte Änderung der Beitragssätze',
          url: 'https://github.com/mwalterskirchen/brutto-netto.ch/blame/main/src/lib/deduction-rates.ts',
        },
      ],
    },
  },
  bottomCta: {
    eyebrow: 'open source',
    heading: 'Vertrau uns nicht. Lies den Code.',
    body: 'Beitragssätze, Berechnungslogik, jeder Datenfluss. Alles offen auf GitHub. PRs willkommen.',
    cta: 'Code lesen',
    url: 'https://github.com/mwalterskirchen/brutto-netto.ch',
  },
} as const;
