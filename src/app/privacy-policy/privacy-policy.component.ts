import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-privacy-policy',
  imports: [RouterLink],
  template: `
    <div class="max-w-3xl mx-auto">
      <h2 class="text-2xl font-bold mb-6">Datenschutzerklärung</h2>

      <section class="mb-6">
        <h3 class="text-lg font-semibold mb-2">Allgemeines</h3>
        <p class="text-base-content/80 leading-relaxed">
          Der Schutz Ihrer Privatsphäre ist uns wichtig. Diese Datenschutzerklärung informiert Sie
          darüber, welche Daten wir erheben und wie wir diese verwenden. Die vorliegende Website
          wird betrieben in Übereinstimmung mit dem Schweizer Datenschutzgesetz (DSG) sowie weiteren
          anwendbaren datenschutzrechtlichen Bestimmungen.
        </p>
      </section>

      <section class="mb-6">
        <h3 class="text-lg font-semibold mb-2">Keine Cookies</h3>
        <p class="text-base-content/80 leading-relaxed">
          Diese Website verwendet keine Cookies. Es werden keine Tracking-Cookies, Session-Cookies
          oder sonstige Cookies auf Ihrem Gerät gespeichert. Ein Cookie-Banner ist daher nicht
          erforderlich.
        </p>
      </section>

      <section class="mb-6">
        <h3 class="text-lg font-semibold mb-2">Keine Weitergabe personenbezogener Daten</h3>
        <p class="text-base-content/80 leading-relaxed">
          Wir erheben, speichern oder verarbeiten keine personenbezogenen Daten unserer
          Besucherinnen und Besucher. Ihre Daten werden weder an Dritte weitergegeben noch für
          Werbezwecke verwendet.
        </p>
      </section>

      <section class="mb-6">
        <h3 class="text-lg font-semibold mb-2">Webanalyse mit Cloudflare Web Analytics</h3>
        <p class="text-base-content/80 leading-relaxed">
          Zur Analyse der Nutzung unserer Website verwenden wir
          <a
            href="https://www.cloudflare.com/web-analytics/"
            target="_blank"
            rel="noopener"
            class="link link-primary"
            >Cloudflare Web Analytics</a
          >, einen datenschutzfreundlichen Analysedienst von Cloudflare, Inc. (USA). Cloudflare Web
          Analytics zeichnet sich durch folgende Eigenschaften aus:
        </p>
        <ul class="list-disc list-inside mt-2 text-base-content/80 space-y-1">
          <li>Keine Verwendung von Cookies</li>
          <li>Keine Speicherung von IP-Adressen</li>
          <li>Keine Erfassung personenbezogener Daten</li>
          <li>Kein Fingerprinting oder Tracking einzelner Besucher</li>
          <li>DSGVO-konform und konform mit dem Schweizer Datenschutzgesetz</li>
        </ul>
        <p class="text-base-content/80 leading-relaxed mt-2">
          Es werden lediglich aggregierte, anonyme Statistiken erfasst, wie beispielsweise die
          Anzahl der Seitenaufrufe oder die Herkunftsländer der Besucher. Ein Rückschluss auf
          einzelne Personen ist nicht möglich.
        </p>
      </section>

      <section class="mb-6">
        <h3 class="text-lg font-semibold mb-2">Server-Logfiles</h3>
        <p class="text-base-content/80 leading-relaxed">
          Der Hosting-Provider dieser Website kann technisch bedingt Server-Logfiles erfassen, die
          Ihr Browser automatisch übermittelt. Dazu gehören unter anderem Browsertyp,
          Betriebssystem, Referrer-URL und Zugriffszeitpunkt. Diese Daten können keiner bestimmten
          Person zugeordnet werden und werden nicht mit anderen Datenquellen zusammengeführt.
        </p>
      </section>

      <section class="mb-6">
        <h3 class="text-lg font-semibold mb-2">Ihre Rechte</h3>
        <p class="text-base-content/80 leading-relaxed">
          Gemäss dem Schweizer Datenschutzgesetz haben Sie das Recht auf Auskunft über Ihre
          gespeicherten Daten sowie gegebenenfalls ein Recht auf Berichtigung, Sperrung oder
          Löschung. Da wir jedoch keine personenbezogenen Daten erheben oder speichern, können wir
          in der Regel keine personenbezogenen Auskünfte erteilen.
        </p>
      </section>

      <section class="mb-6">
        <h3 class="text-lg font-semibold mb-2">Kontakt</h3>
        <p class="text-base-content/80 leading-relaxed">
          Bei Fragen zum Datenschutz können Sie uns jederzeit kontaktieren. Die Kontaktdaten finden
          Sie im <a routerLink="/impressum" class="link link-primary">Impressum</a>.
        </p>
      </section>

      <section class="mb-6">
        <h3 class="text-lg font-semibold mb-2">Änderungen</h3>
        <p class="text-base-content/80 leading-relaxed">
          Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf anzupassen, um sie an
          geänderte rechtliche Anforderungen oder Änderungen unserer Dienste anzupassen.
        </p>
      </section>
    </div>
  `,
})
export class PrivacyPolicyComponent {}
