type MigrationRedirectProps = {
  destination: string;
  label: string;
};

export function MigrationRedirect({ destination, label }: MigrationRedirectProps) {
  return (
    <main className="seo-page" id="contenu">
      <meta httpEquiv="refresh" content={`0;url=${destination}`} />
      <section className="seo-hero">
        <p className="seo-eyebrow">YVEXOR</p>
        <h1>Cette page a rejoint le nouveau site.</h1>
        <p>
          Redirection en cours. <a href={destination}>{label}</a>
        </p>
      </section>
    </main>
  );
}
