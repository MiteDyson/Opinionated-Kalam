// ─────────────────────────────────────────────────────────────────────────────
// REPLACE in MobilePage.tsx — the SortDropdown component and MobileArticlesView
// These are the only two components that change for Change 5.
// The rest of MobilePage.tsx remains identical.
// ─────────────────────────────────────────────────────────────────────────────

// Change 5: Sort options now include Trending (recent views), Most Views, Least Views, Oldest, Newest
type SortOption = "trending" | "mostViews" | "leastViews" | "newest" | "oldest";

const SORT_LABELS: Record<SortOption, string> = {
  trending:  "Trending",
  mostViews: "Most Views",
  leastViews:"Least Views",
  oldest:    "Oldest",
  newest:    "Newest",
};

function SortDropdown({ sortOpt, setSortOpt }: { sortOpt: SortOption; setSortOpt: (d: SortOption) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen(o => !o)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: 6, border: "1.5px solid var(--border)", backgroundColor: "white", fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", fontWeight: 600, color: "var(--text-main)", cursor: "pointer" }}>
        Sort <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, backgroundColor: "white", borderRadius: 10, border: "1px solid var(--border)", boxShadow: "0 8px 24px rgba(0,0,0,0.1)", zIndex: 40, minWidth: 140, overflow: "hidden" }}>
          {(Object.keys(SORT_LABELS) as SortOption[]).map((opt, i, arr) => (
            <button key={opt} onClick={() => { setSortOpt(opt); setOpen(false); }} style={{ display: "block", width: "100%", padding: "10px 14px", background: "none", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", fontWeight: sortOpt === opt ? 700 : 400, color: sortOpt === opt ? ACCENT : "var(--text-main)", backgroundColor: sortOpt === opt ? "rgba(27,42,71,0.05)" : "transparent", borderBottom: i < arr.length - 1 ? "1px solid #f5f5f3" : "none", textAlign: "left" }}>
              {SORT_LABELS[opt]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Change 5: MobileArticlesView fetches trending from /api/articles/trending
// when sortOpt === "trending", otherwise client-sorts the existing list
function MobileArticlesView({ articles, loading }: { articles: Article[]; loading: boolean }) {
  const [selectedBeat, setSelectedBeat] = useState<string | null>(null);
  const [sortOpt, setSortOpt] = useState<SortOption>("newest");
  const [trendingList, setTrendingList] = useState<Article[]>([]);
  const [trendingLoading, setTrendingLoading] = useState(false);

  // Fetch trending when that option is selected
  useEffect(() => {
    if (sortOpt !== "trending") return;
    setTrendingLoading(true);
    fetch("/api/articles/trending?type=article")
      .then(r => r.ok ? r.json() : { articles: [] })
      .then(data => setTrendingList(Array.isArray(data.articles) ? data.articles : []))
      .catch(() => setTrendingList([]))
      .finally(() => setTrendingLoading(false));
  }, [sortOpt]);

  // Compute display list
  const displayList = (() => {
    if (sortOpt === "trending") {
      const filtered = selectedBeat ? trendingList.filter(a => a.tags?.includes(selectedBeat)) : trendingList;
      return filtered;
    }
    const filtered = selectedBeat ? articles.filter(a => a.tags?.includes(selectedBeat)) : articles;
    return [...filtered].sort((a, b) => {
      if (sortOpt === "mostViews")  return (b.views ?? 0) - (a.views ?? 0);
      if (sortOpt === "leastViews") return (a.views ?? 0) - (b.views ?? 0);
      const da = new Date(a.publishedAt ?? 0).getTime();
      const db = new Date(b.publishedAt ?? 0).getTime();
      return sortOpt === "newest" ? db - da : da - db;
    });
  })();

  const isLoading = loading || (sortOpt === "trending" && trendingLoading);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 0", borderBottom: "1px solid var(--border)", marginBottom: 4 }}>
        <div style={{ flex: 1 }} />
        <BeatsFilter selectedBeat={selectedBeat} onBeatChange={setSelectedBeat} />
        <SortDropdown sortOpt={sortOpt} setSortOpt={setSortOpt} />
      </div>
      {isLoading
        ? [1,2,3,4].map(i => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "13px 0", borderBottom: "1px solid var(--border)" }}>
              <Sk h={66} w={88} r={6} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 7 }}><Sk h={12} w="80%" /><Sk h={10} w="50%" /><Sk h={10} w="40%" /></div>
            </div>
          ))
        : displayList.length === 0
          ? <p style={{ textAlign: "center", color: "#aaa", fontFamily: "'Inter', sans-serif", padding: "48px 0", fontSize: "0.88rem" }}>{selectedBeat ? `No articles in "${selectedBeat}" beat.` : "No articles yet."}</p>
          : displayList.map(a => <MobileArticleCard key={a._id} a={a} />)
      }
    </div>
  );
}
