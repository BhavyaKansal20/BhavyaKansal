export default function ProofStrip() {
  return (
    <div className="border-y border-border bg-secondary/30">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="space-y-1">
            <h4 className="text-2xl font-bold text-foreground">TODO(bhavya)</h4>
            <p className="text-sm text-muted-foreground">Projects Shipped</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-2xl font-bold text-foreground">IIT & NIELIT Ropar</h4>
            <p className="text-sm text-muted-foreground">Industrial AI Training</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-2xl font-bold text-foreground">General Secretary</h4>
            <p className="text-sm text-muted-foreground">Code Metrics Society</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-2xl font-bold text-foreground">TODO(bhavya)</h4>
            <p className="text-sm text-muted-foreground">Hackathon Wins</p>
          </div>
        </div>
      </div>
    </div>
  );
}
