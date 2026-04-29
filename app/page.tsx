"use client"
// @ts-nocheck
import { useState, useRef, useEffect } from "react";
import {
  ComposedChart, Area, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer,
} from "recharts";

// ─── 6 PROFILS SR800 + TUBE D'EXTENSION (ET en °F) ───────────────────────────
// Torréfacteur à air chaud. Avec tube d'extension : montée plus lente,
// températures ET plus basses. Charge ~290°F, 1er crack 370–420°F selon niveau.
const PROFILS = [
  {
    id: "sr800_cinnamon", label: "SR800 – Cinnamon", emoji: "🌿",
    desc: "Très légère, acidité vive, fruité intense, ~8 min",
    couleur_cible: "cinnamon",
    points: [
      { t: 0,   ref: 290 }, { t: 0.5, ref: 268 }, { t: 1.0, ref: 255 },
      { t: 1.5, ref: 258 }, { t: 2.0, ref: 268 }, { t: 2.5, ref: 281 },
      { t: 3.0, ref: 295 }, { t: 3.5, ref: 308 }, { t: 4.0, ref: 320 },
      { t: 4.5, ref: 331 }, { t: 5.0, ref: 341 }, { t: 5.5, ref: 350 },
      { t: 6.0, ref: 358 }, { t: 6.5, ref: 365 }, { t: 7.0, ref: 371 },
      { t: 7.5, ref: 374 }, { t: 8.0, ref: 372 },
    ],
  },
  {
    id: "sr800_light", label: "SR800 – Light", emoji: "🌤",
    desc: "Floraux et agrumes, acidité marquée, ~9.5 min",
    couleur_cible: "light",
    points: [
      { t: 0,   ref: 290 }, { t: 0.5, ref: 266 }, { t: 1.0, ref: 252 },
      { t: 1.5, ref: 255 }, { t: 2.0, ref: 265 }, { t: 2.5, ref: 278 },
      { t: 3.0, ref: 291 }, { t: 3.5, ref: 304 }, { t: 4.0, ref: 316 },
      { t: 4.5, ref: 327 }, { t: 5.0, ref: 337 }, { t: 5.5, ref: 346 },
      { t: 6.0, ref: 354 }, { t: 6.5, ref: 362 }, { t: 7.0, ref: 368 },
      { t: 7.5, ref: 374 }, { t: 8.0, ref: 379 }, { t: 8.5, ref: 383 },
      { t: 9.0, ref: 386 }, { t: 9.5, ref: 384 },
    ],
  },
  {
    id: "sr800_city", label: "SR800 – City", emoji: "☀️",
    desc: "Équilibrée, caramel léger, acidité modérée, ~11 min",
    couleur_cible: "city",
    points: [
      { t: 0,    ref: 290 }, { t: 0.5,  ref: 265 }, { t: 1.0,  ref: 250 },
      { t: 1.5,  ref: 253 }, { t: 2.0,  ref: 263 }, { t: 2.5,  ref: 276 },
      { t: 3.0,  ref: 289 }, { t: 3.5,  ref: 302 }, { t: 4.0,  ref: 314 },
      { t: 4.5,  ref: 325 }, { t: 5.0,  ref: 335 }, { t: 5.5,  ref: 344 },
      { t: 6.0,  ref: 352 }, { t: 6.5,  ref: 360 }, { t: 7.0,  ref: 367 },
      { t: 7.5,  ref: 373 }, { t: 8.0,  ref: 378 }, { t: 8.5,  ref: 383 },
      { t: 9.0,  ref: 387 }, { t: 9.5,  ref: 391 }, { t: 10.0, ref: 394 },
      { t: 10.5, ref: 396 }, { t: 11.0, ref: 394 },
    ],
  },
  {
    id: "sr800_city_plus", label: "SR800 – City+", emoji: "🌇",
    desc: "Développée, sucrosité, acidité douce, ~12 min",
    couleur_cible: "city_plus",
    points: [
      { t: 0,    ref: 290 }, { t: 0.5,  ref: 264 }, { t: 1.0,  ref: 249 },
      { t: 1.5,  ref: 252 }, { t: 2.0,  ref: 262 }, { t: 2.5,  ref: 275 },
      { t: 3.0,  ref: 288 }, { t: 3.5,  ref: 301 }, { t: 4.0,  ref: 313 },
      { t: 4.5,  ref: 324 }, { t: 5.0,  ref: 334 }, { t: 5.5,  ref: 343 },
      { t: 6.0,  ref: 351 }, { t: 6.5,  ref: 359 }, { t: 7.0,  ref: 366 },
      { t: 7.5,  ref: 372 }, { t: 8.0,  ref: 378 }, { t: 8.5,  ref: 383 },
      { t: 9.0,  ref: 387 }, { t: 9.5,  ref: 391 }, { t: 10.0, ref: 395 },
      { t: 10.5, ref: 399 }, { t: 11.0, ref: 402 }, { t: 11.5, ref: 405 },
      { t: 12.0, ref: 403 },
    ],
  },
  {
    id: "sr800_full_city", label: "SR800 – Full City", emoji: "🌆",
    desc: "Chocolaté, corps plein, 2e crack approché, ~13 min",
    couleur_cible: "full_city",
    points: [
      { t: 0,    ref: 290 }, { t: 0.5,  ref: 263 }, { t: 1.0,  ref: 248 },
      { t: 1.5,  ref: 251 }, { t: 2.0,  ref: 261 }, { t: 2.5,  ref: 274 },
      { t: 3.0,  ref: 287 }, { t: 3.5,  ref: 300 }, { t: 4.0,  ref: 312 },
      { t: 4.5,  ref: 323 }, { t: 5.0,  ref: 333 }, { t: 5.5,  ref: 342 },
      { t: 6.0,  ref: 350 }, { t: 6.5,  ref: 358 }, { t: 7.0,  ref: 365 },
      { t: 7.5,  ref: 371 }, { t: 8.0,  ref: 377 }, { t: 8.5,  ref: 382 },
      { t: 9.0,  ref: 387 }, { t: 9.5,  ref: 391 }, { t: 10.0, ref: 395 },
      { t: 10.5, ref: 399 }, { t: 11.0, ref: 403 }, { t: 11.5, ref: 407 },
      { t: 12.0, ref: 410 }, { t: 12.5, ref: 413 }, { t: 13.0, ref: 411 },
    ],
  },
  {
    id: "sr800_dark", label: "SR800 – Dark", emoji: "🌑",
    desc: "Intense, fumé, 2e crack, corps lourd, ~14 min",
    couleur_cible: "dark",
    points: [
      { t: 0,    ref: 290 }, { t: 0.5,  ref: 262 }, { t: 1.0,  ref: 247 },
      { t: 1.5,  ref: 250 }, { t: 2.0,  ref: 260 }, { t: 2.5,  ref: 273 },
      { t: 3.0,  ref: 286 }, { t: 3.5,  ref: 299 }, { t: 4.0,  ref: 311 },
      { t: 4.5,  ref: 322 }, { t: 5.0,  ref: 332 }, { t: 5.5,  ref: 341 },
      { t: 6.0,  ref: 349 }, { t: 6.5,  ref: 357 }, { t: 7.0,  ref: 364 },
      { t: 7.5,  ref: 370 }, { t: 8.0,  ref: 376 }, { t: 8.5,  ref: 381 },
      { t: 9.0,  ref: 386 }, { t: 9.5,  ref: 390 }, { t: 10.0, ref: 394 },
      { t: 10.5, ref: 398 }, { t: 11.0, ref: 402 }, { t: 11.5, ref: 406 },
      { t: 12.0, ref: 410 }, { t: 12.5, ref: 414 }, { t: 13.0, ref: 418 },
      { t: 13.5, ref: 421 }, { t: 14.0, ref: 419 },
    ],
  },
];


const TOL = 15;

const COULEURS = [
  { id: "cinnamon",       label: "Cinnamon",   bg: "#D4A050", fg: "#000" },
  { id: "light",          label: "Light",      bg: "#B8763A", fg: "#fff" },
  { id: "city",           label: "City",       bg: "#8B4513", fg: "#fff" },
  { id: "city_plus",      label: "City+",      bg: "#6B3410", fg: "#fff" },
  { id: "full_city",      label: "Full City",  bg: "#4A2C17", fg: "#fff" },
  { id: "full_city_plus", label: "Full City+", bg: "#3A1F0E", fg: "#D4820A" },
  { id: "dark",           label: "Dark",       bg: "#2C1A0A", fg: "#F5A623" },
];

const EVENT_DEFS = [
  { id: "drying",   label: "Fin séchage", short: "DRY", color: "#60A5FA" },
  { id: "maillard", label: "Maillard",    short: "MAI", color: "#FBBF24" },
  { id: "crack1",   label: "1er crack",   short: "1CR", color: "#FB923C" },
  { id: "drop",     label: "Drop",        short: "DRP", color: "#F87171" },
];

const DEGUST_FIELDS = [
  { k: "aromes", label: "Arômes",     ph: "Fruité, floral, chocolat, noisette…" },
  { k: "saveur", label: "Saveur",     ph: "Caramel, agrumes, épices…" },
  { k: "corps",  label: "Corps",      ph: "Léger, moyen, plein, sirupeux…" },
  { k: "finale", label: "Finale",     ph: "Courte, longue, amère, propre…" },
  { k: "notes",  label: "Notes libres", ph: "Observations, améliorations pour le prochain batch…" },
];

const C = {
  bg: "#150E07", surface: "#221508", surface2: "#2D1C0A",
  border: "#3D2810", accent: "#D4820A", gold: "#F5A623",
  cream: "#F0DFC0", muted: "#9B8A6E",
  green: "#4ADE80", yellow: "#FBBF24", red: "#F87171",
};

const SK = { batches: "rl_batches", ref: "rl_ref", active: "rl_active" };

// ─── UTILS ────────────────────────────────────────────────────────────────────
const uid = () => crypto.randomUUID();
const fmtS = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
const fmtM = (m) => { const mm = Math.floor(m); const ss = Math.round((m - mm) * 60); return `${mm}:${String(ss).padStart(2, "0")}`; };

const lerp = (t, curve) => {
  const s = [...curve].sort((a, b) => a.t - b.t);
  if (t <= s[0].t) return s[0].ref;
  if (t >= s[s.length - 1].t) return s[s.length - 1].ref;
  for (let i = 0; i < s.length - 1; i++) {
    if (t >= s[i].t && t <= s[i + 1].t) {
      const r = (t - s[i].t) / (s[i + 1].t - s[i].t);
      return s[i].ref + r * (s[i + 1].ref - s[i].ref);
    }
  }
  return null;
};

const dotColor = (et, t, curve) => {
  const ref = lerp(t, curve);
  if (ref === null) return C.muted;
  const d = Math.abs(et - ref);
  return d <= TOL ? C.green : d <= TOL * 2 ? C.yellow : C.red;
};

const nextNum = (batches) => {
  const y = new Date().getFullYear();
  const nums = batches.filter(b => b.batchNum?.startsWith(`B-${y}-`)).map(b => parseInt(b.batchNum.split("-")[2]) || 0);
  return `B-${y}-${String(nums.length ? Math.max(...nums) + 1 : 1).padStart(3, "0")}`;
};

// ─── STORAGE ──────────────────────────────────────────────────────────────────
const sGet = async k => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch { return null; } };
const sSet = async (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const sDel = async k => { try { localStorage.removeItem(k); } catch {} };

// ─── SHARED STYLES ────────────────────────────────────────────────────────────
const INP = { background: C.surface2, border: `1px solid ${C.border}`, color: C.cream, padding: "9px 11px", borderRadius: 6, fontSize: 13, outline: "none", width: "100%", fontFamily: "inherit" };
const LBL = { color: C.muted, fontSize: 10, fontWeight: 600, letterSpacing: "0.09em", textTransform: "uppercase", display: "block", marginBottom: 5 };
const BTN = (bg, fg, extra = {}) => ({ background: bg, color: fg, border: "none", padding: "10px 20px", borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", ...extra });

// ─── CHART ────────────────────────────────────────────────────────────────────
const CustomDot = ({ cx, cy, payload, entries, curve }) => {
  if (!payload || payload.actual == null) return null;
  const e = entries.find(x => Math.abs(x.t - payload.t) < 0.01);
  if (!e) return null;
  return <circle cx={cx} cy={cy} r={5} fill={dotColor(e.et, e.t, curve)} stroke={C.bg} strokeWidth={1.5} />;
};

const ChartTooltip = ({ active, payload, entries, curve }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  const e = entries.find(x => Math.abs(x.t - d?.t) < 0.01);
  const ref  = d?.t != null ? lerp(d.t, curve) : null;
  const diff = e && ref != null ? e.et - ref : null;
  return (
    <div style={{ background: C.surface2, border: `1px solid ${C.border}`, padding: "8px 14px", borderRadius: 6, fontSize: 12 }}>
      <b style={{ color: C.gold }}>{fmtM(d?.t ?? 0)}</b>
      {payload.map(p => p.value != null && (
        <div key={p.dataKey} style={{ color: p.dataKey === "actual" && e ? dotColor(p.value, d.t, curve) : C.gold }}>
          {p.name}: {Number(p.value).toFixed(1)}°F
        </div>
      ))}
      {diff != null && <div style={{ color: C.muted, marginTop: 3 }}>Écart: {diff >= 0 ? "+" : ""}{diff.toFixed(1)}°F</div>}
      {e?.airflow != null && <div style={{ color: C.muted }}>Airflow: {e.airflow}%</div>}
      {e?.power   != null && <div style={{ color: C.muted }}>Puissance: {e.power}%</div>}
    </div>
  );
};

const RoastChart = ({ entries = [], events = {}, curve, height = 260 }) => {
  const refData = [...curve].sort((a, b) => a.t - b.t).map(p => ({ ...p, hi: p.ref + TOL, lo: p.ref - TOL }));
  const actual  = entries.map(e => ({ t: e.t, actual: e.et }));
  const maxT    = Math.max(14, entries.length ? Math.ceil(Math.max(...entries.map(e => e.t))) + 1 : 14);
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart margin={{ top: 4, right: 18, left: 0, bottom: 18 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
        <XAxis dataKey="t" type="number" domain={[0, maxT]} tickCount={Math.min(maxT + 1, 16)}
          tickFormatter={fmtM} tick={{ fill: C.muted, fontSize: 10 }} stroke={C.border}
          label={{ value: "mm:ss", position: "insideBottom", offset: -10, fill: C.muted, fontSize: 10 }} />
        <YAxis domain={[220, 450]} tickFormatter={v => `${v}°`}
          tick={{ fill: C.muted, fontSize: 10 }} stroke={C.border} />
        <Tooltip content={<ChartTooltip entries={entries} curve={curve} />} />
        <Area data={refData} dataKey="hi" type="monotone" stroke="none" fill={C.gold} fillOpacity={0.15} legendType="none" />
        <Area data={refData} dataKey="lo" type="monotone" stroke="none" fill={C.bg}   fillOpacity={1}    legendType="none" />
        <Line data={refData} dataKey="ref" name="Référence" type="monotone"
          stroke={C.gold} strokeWidth={2} strokeDasharray="7 3" dot={false} />
        {actual.length > 0 && (
          <Line data={actual} dataKey="actual" name="ET réel" type="monotone"
            stroke={C.cream} strokeWidth={2}
            dot={<CustomDot entries={entries} curve={curve} />}
            activeDot={{ r: 6, fill: C.gold }} />
        )}
        {EVENT_DEFS.map(ev => events[ev.id] != null && (
          <ReferenceLine key={ev.id} x={events[ev.id]} stroke={ev.color} strokeDasharray="4 2"
            label={{ value: ev.short, position: "insideTopRight", fill: ev.color, fontSize: 10, fontWeight: 700 }} />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  );
};

// ─── STAR RATING ──────────────────────────────────────────────────────────────
const StarRating = ({ value, onChange, readOnly = false }) => (
  <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
    {[1,2,3,4,5,6,7,8,9,10].map(n => (
      <button key={n} onClick={() => !readOnly && onChange(n)}
        style={{ background: "none", border: "none", fontSize: 17, cursor: readOnly ? "default" : "pointer",
          color: n <= (value || 0) ? C.gold : C.border, padding: "0 1px", lineHeight: 1, fontFamily: "inherit" }}>★</button>
    ))}
    {value && <span style={{ color: C.muted, fontSize: 11, marginLeft: 5 }}>{value}/10</span>}
  </div>
);

// ─── VUE LISTE ────────────────────────────────────────────────────────────────
const VueListe = ({ batches, onNew, onOpen }) => {
  const [search,      setSearch]      = useState("");
  const [sortBy,      setSortBy]      = useState("date_desc");
  const [filtStatut,  setFiltStatut]  = useState("tous");
  const [filtCouleur, setFiltCouleur] = useState("");

  let list = [...batches];
  if (search)        list = list.filter(b => b.batchNum?.toLowerCase().includes(search.toLowerCase()) || b.origine?.toLowerCase().includes(search.toLowerCase()));
  if (filtStatut !== "tous") list = list.filter(b => b.statut === filtStatut);
  if (filtCouleur)   list = list.filter(b => b.couleur === filtCouleur);
  list.sort((a, b) => {
    if (sortBy === "date_desc")  return new Date(b.date) - new Date(a.date);
    if (sortBy === "date_asc")   return new Date(a.date) - new Date(b.date);
    if (sortBy === "note_desc")  return (b.degustation?.note || 0) - (a.degustation?.note || 0);
    if (sortBy === "note_asc")   return (a.degustation?.note || 0) - (b.degustation?.note || 0);
    if (sortBy === "num_desc")   return (b.batchNum || "").localeCompare(a.batchNum || "");
    if (sortBy === "num_asc")    return (a.batchNum || "").localeCompare(b.batchNum || "");
    return 0;
  });

  const Chip = ({ active, label, onClick }) => (
    <button onClick={onClick} style={{ background: active ? C.accent + "33" : C.surface2, color: active ? C.gold : C.muted, border: `1px solid ${active ? C.accent : C.border}`, padding: "4px 12px", borderRadius: 12, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
      {label}
    </button>
  );

  return (
    <div style={{ padding: "20px 24px", maxWidth: 960, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: C.gold }}>Mes Batches</div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{batches.length} enregistrés · {batches.filter(b => b.statut === "termine").length} terminés</div>
        </div>
        <button onClick={onNew} style={BTN(C.accent, "#fff")}>+ Nouveau batch</button>
      </div>

      {/* Barre filtres */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 14px", marginBottom: 14, display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Numéro, origine…" style={{ ...INP, width: 200, padding: "6px 10px", fontSize: 12 }} />
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          <Chip active={filtStatut === "tous"}     label="Tous"      onClick={() => setFiltStatut("tous")} />
          <Chip active={filtStatut === "en_cours"} label="En cours"  onClick={() => setFiltStatut("en_cours")} />
          <Chip active={filtStatut === "termine"}  label="Terminés"  onClick={() => setFiltStatut("termine")} />
        </div>
        <select value={filtCouleur} onChange={e => setFiltCouleur(e.target.value)}
          style={{ ...INP, width: "auto", padding: "6px 10px", fontSize: 12, cursor: "pointer" }}>
          <option value="">Toutes couleurs</option>
          {COULEURS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          style={{ ...INP, width: "auto", padding: "6px 10px", fontSize: 12, cursor: "pointer" }}>
          <option value="date_desc">Date ↓ récent</option>
          <option value="date_asc">Date ↑ ancien</option>
          <option value="note_desc">Note ↓ meilleure</option>
          <option value="note_asc">Note ↑ pire</option>
          <option value="num_desc">Numéro ↓</option>
          <option value="num_asc">Numéro ↑</option>
        </select>
        {(search || filtStatut !== "tous" || filtCouleur) && (
          <button onClick={() => { setSearch(""); setFiltStatut("tous"); setFiltCouleur(""); }}
            style={{ background: "none", border: "none", color: C.muted, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>✕ Réinitialiser</button>
        )}
      </div>

      {list.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: C.muted }}>
          <div style={{ fontSize: 48, marginBottom: 14 }}>☕</div>
          <div>{batches.length === 0 ? "Aucun batch enregistré" : "Aucun résultat"}</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {list.map(b => {
            const coul    = COULEURS.find(c => c.id === b.couleur);
            const enCours = b.statut !== "termine";
            const note    = b.degustation?.note;
            return (
              <div key={b.id} onClick={() => onOpen(b)}
                style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "11px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, transition: "border-color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = C.accent}
                onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                <div style={{ width: 42, height: 42, borderRadius: 7, background: coul?.bg || C.surface2, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>☕</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ color: C.gold, fontWeight: 700, fontSize: 13 }}>{b.batchNum}</span>
                    {coul && <span style={{ background: coul.bg, color: coul.fg, padding: "1px 8px", borderRadius: 10, fontSize: 10, fontWeight: 600 }}>{coul.label}</span>}
                    {enCours && <span style={{ background: "#059669", color: "#fff", padding: "1px 8px", borderRadius: 10, fontSize: 10 }}>En cours</span>}
                  </div>
                  <div style={{ color: C.cream, fontSize: 12, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {b.origine || <i style={{ color: C.muted }}>Origine non précisée</i>}
                  </div>
                  <div style={{ color: C.muted, fontSize: 11, marginTop: 1 }}>
                    {b.date}{b.poids_vert ? ` · ${b.poids_vert}g vert` : ""}{b.poids_final ? ` → ${b.poids_final}g torréfié` : ""}
                  </div>
                  {note && (
                    <div style={{ display: "flex", gap: 2, marginTop: 3 }}>
                      {[1,2,3,4,5,6,7,8,9,10].map(n => <span key={n} style={{ fontSize: 10, color: n <= note ? C.gold : C.border }}>★</span>)}
                    </div>
                  )}
                </div>
                <div style={{ textAlign: "right", flexShrink: 0, fontSize: 11 }}>
                  {b.duree_total > 0 && <div style={{ color: C.gold, fontWeight: 700, fontSize: 13 }}>{fmtS(b.duree_total)}</div>}
                  <div style={{ color: C.muted }}>{(b.readings || []).length} lectures</div>
                  {!note && !enCours && <div style={{ color: C.border, fontSize: 10, marginTop: 2 }}>Non noté</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── VUE CRÉATION ─────────────────────────────────────────────────────────────
const VueCreer = ({ batches, onStart, onCancel }) => {
  const [f, setF] = useState({ origine: "", poids_vert: "", notes_debut: "" });
  const num = nextNum(batches);
  return (
    <div style={{ padding: "28px 24px", maxWidth: 500, margin: "0 auto" }}>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: C.gold }}>Nouveau Batch</div>
      <div style={{ color: C.muted, fontSize: 12, marginBottom: 24, marginTop: 2 }}>{num} · {new Date().toISOString().split("T")[0]}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div><label style={LBL}>Origine</label><input value={f.origine} onChange={e => setF(p => ({ ...p, origine: e.target.value }))} placeholder="ex. Éthiopie Yirgacheffe, Lot 42" style={INP} /></div>
        <div><label style={LBL}>Poids vert (g)</label><input type="number" value={f.poids_vert} onChange={e => setF(p => ({ ...p, poids_vert: e.target.value }))} placeholder="300" style={INP} /></div>
        <div><label style={LBL}>Notes de départ</label>
          <textarea value={f.notes_debut} onChange={e => setF(p => ({ ...p, notes_debut: e.target.value }))}
            placeholder="Humidité, conditions, objectif de profil…" style={{ ...INP, resize: "vertical", minHeight: 72 }} /></div>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button onClick={onCancel} style={{ ...BTN("transparent", C.muted), border: `1px solid ${C.border}`, flex: 1, fontWeight: 400 }}>Annuler</button>
          <button onClick={() => onStart({
            id: uid(), batchNum: num, date: new Date().toISOString().split("T")[0],
            ...f, poids_vert: f.poids_vert ? parseFloat(f.poids_vert) : null,
            poids_final: null, couleur: null, notes_fin: null, degustation: null,
            duree_total: 0, statut: "en_cours", readings: [], events: {},
          })} style={{ ...BTN(C.accent, "#fff"), flex: 2 }}>🔥 Démarrer la torréfaction</button>
        </div>
      </div>
    </div>
  );
};

// ─── VUE JOURNAL ──────────────────────────────────────────────────────────────
const VueJournal = ({ batch, entries, events, setEntries, setEvents, elapsed, running, onStart, onPause, onFin, curve }) => {
  const [et,      setEt]      = useState("");
  const [airflow, setAirflow] = useState("");
  const [power,   setPower]   = useState("");
  const [adv,     setAdv]     = useState(false);
  const inputRef              = useRef(null);

  const add = () => {
    if (!et) return;
    const t = Math.round((elapsed / 60) * 100) / 100;
    setEntries(prev => [...prev, { id: uid(), t, et: parseFloat(et), airflow: airflow ? parseFloat(airflow) : null, power: power ? parseFloat(power) : null }].sort((a, b) => a.t - b.t));
    setEt(""); setTimeout(() => inputRef.current?.focus(), 50);
  };

  const mark = id => setEvents(prev => ({ ...prev, [id]: Math.round((elapsed / 60) * 100) / 100 }));
  const rmEv = id => setEvents(prev => { const n = { ...prev }; delete n[id]; return n; });
  const rmEn = id => setEntries(prev => prev.filter(e => e.id !== id));

  const diffs = entries.map(e => { const r = lerp(e.t, curve); return r ? Math.abs(e.et - r) : 0; });
  const avg   = diffs.length ? (diffs.reduce((a, b) => a + b, 0) / diffs.length).toFixed(1) : "—";

  return (
    <div style={{ padding: "14px 20px", display: "grid", gridTemplateColumns: "210px 1fr", gap: 14, maxWidth: 1220, margin: "0 auto" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 10, color: C.accent, fontWeight: 600, letterSpacing: "0.1em", marginBottom: 8 }}>BATCH EN COURS</div>
          <div style={{ color: C.gold, fontWeight: 700, fontSize: 14 }}>{batch.batchNum}</div>
          <div style={{ color: C.cream, fontSize: 12, marginTop: 2 }}>{batch.origine || "—"}</div>
          {batch.poids_vert && <div style={{ color: C.muted, fontSize: 11, marginTop: 1 }}>{batch.poids_vert}g vert</div>}
        </div>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 10, color: C.accent, fontWeight: 600, letterSpacing: "0.1em", marginBottom: 8 }}>ÉVÉNEMENTS</div>
          <div style={{ fontSize: 10, color: C.muted, marginBottom: 8 }}>Cliquer = marque l'heure actuelle</div>
          {EVENT_DEFS.map(ev => {
            const marked = events[ev.id] != null;
            return (
              <div key={ev.id} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 7 }}>
                <button onClick={() => mark(ev.id)} style={{ flex: 1, textAlign: "left", background: marked ? ev.color + "22" : C.surface2, color: marked ? ev.color : C.muted, border: `1px solid ${marked ? ev.color : C.border}`, padding: "6px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{ev.label}</button>
                <span style={{ color: ev.color, fontSize: 11, minWidth: 34, textAlign: "right", fontWeight: 600 }}>{marked ? fmtM(events[ev.id]) : "—"}</span>
                {marked && <button onClick={() => rmEv(ev.id)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 14, fontFamily: "inherit" }}>×</button>}
              </div>
            );
          })}
        </div>

        {entries.length > 0 && (
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 10, color: C.accent, fontWeight: 600, letterSpacing: "0.1em", marginBottom: 8 }}>STATS</div>
            {[["Lectures", entries.length], ["Dév. moy.", `±${avg}°F`], ["Dans tol.", `${diffs.filter(d => d <= TOL).length}/${entries.length}`]].map(([l, v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 12 }}>
                <span style={{ color: C.muted }}>{l}</span><span style={{ color: C.cream, fontWeight: 700 }}>{v}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12 }}>
          <div style={{ fontSize: 10, color: C.muted, marginBottom: 8 }}>Légende points</div>
          {[[C.green, `≤ ±${TOL}°F`], [C.yellow, `≤ ±${TOL * 2}°F`], [C.red, `> ±${TOL * 2}°F`]].map(([col, txt]) => (
            <div key={txt} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5, fontSize: 11 }}>
              <div style={{ width: 9, height: 9, borderRadius: "50%", background: col, flexShrink: 0 }} />
              <span style={{ color: C.muted }}>{txt}</span>
            </div>
          ))}
        </div>

        <button onClick={onFin} style={{ ...BTN("#7F1D1D", "#FCA5A5"), border: "1px solid #991B1B", padding: "12px", borderRadius: 8, fontWeight: 700, fontSize: 13 }}>⏹ Terminer le batch</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
            <div style={{ textAlign: "center", flexShrink: 0 }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 56, fontWeight: 600, color: running ? C.gold : C.muted, lineHeight: 1, letterSpacing: "0.05em", minWidth: 130 }}>{fmtS(elapsed)}</div>
              <div style={{ display: "flex", gap: 6, marginTop: 8, justifyContent: "center" }}>
                {!running
                  ? <button onClick={onStart} style={BTN(C.accent, "#fff", { padding: "6px 18px", fontSize: 12 })}>{elapsed === 0 ? "▶ Charge" : "▶ Reprendre"}</button>
                  : <button onClick={onPause} style={{ ...BTN(C.surface2, C.cream), border: `1px solid ${C.border}`, padding: "6px 14px", fontSize: 12 }}>⏸ Pause</button>
                }
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ ...LBL, marginBottom: 8 }}>TEMPÉRATURE ET / AT (°F)</label>
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input ref={inputRef} type="number" value={et} autoFocus
                  onChange={e => setEt(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && add()}
                  placeholder="435"
                  style={{ ...INP, fontSize: 30, fontWeight: 700, padding: "8px 14px", flex: 1, textAlign: "center" }} />
                <button onClick={add} disabled={!et}
                  style={{ background: et ? C.accent : C.surface2, color: et ? "#fff" : C.muted, border: "none", padding: "0 20px", borderRadius: 6, fontSize: 24, fontWeight: 700, cursor: et ? "pointer" : "default", fontFamily: "inherit" }}>+</button>
              </div>
              <div style={{ fontSize: 10, color: C.muted, marginBottom: 8 }}>↵ Entrée pour enregistrer · Temps capturé à {fmtS(elapsed)}</div>
              <button onClick={() => setAdv(p => !p)} style={{ background: "none", border: "none", color: C.muted, fontSize: 11, cursor: "pointer", padding: 0, fontFamily: "inherit" }}>
                {adv ? "▼" : "▶"} Airflow / Puissance
              </button>
              {adv && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
                  <div><label style={LBL}>Airflow (%)</label><input type="number" value={airflow} onChange={e => setAirflow(e.target.value)} placeholder="75" style={INP} /></div>
                  <div><label style={LBL}>Puissance (%)</label><input type="number" value={power} onChange={e => setPower(e.target.value)} placeholder="80" style={INP} /></div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "14px 8px 10px 4px" }}>
          <div style={{ fontSize: 10, color: C.accent, fontWeight: 600, letterSpacing: "0.1em", paddingLeft: 12, marginBottom: 8 }}>COURBE EN DIRECT</div>
          <RoastChart entries={entries} events={events} curve={curve} height={240} />
        </div>

        {entries.length > 0 && (
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: C.surface2 }}>
                  {["Heure", "ET/AT", "Réf.", "Écart", "Airflow", "Puissance", ""].map(h => (
                    <th key={h} style={{ padding: "7px 12px", textAlign: "left", color: C.muted, fontSize: 10, fontWeight: 600, letterSpacing: "0.07em", borderBottom: `1px solid ${C.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...entries].reverse().map((e, i) => {
                  const ref  = lerp(e.t, curve);
                  const diff = ref != null ? e.et - ref : null;
                  const col  = dotColor(e.et, e.t, curve);
                  return (
                    <tr key={e.id} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 ? C.surface2 : "transparent" }}>
                      <td style={{ padding: "6px 12px", color: C.gold, fontWeight: 700 }}>{fmtM(e.t)}</td>
                      <td style={{ padding: "6px 12px", color: col, fontWeight: 700 }}>{e.et.toFixed(1)}°F</td>
                      <td style={{ padding: "6px 12px", color: C.muted }}>{ref != null ? `${ref.toFixed(1)}°F` : "—"}</td>
                      <td style={{ padding: "6px 12px", color: col }}>{diff != null ? `${diff >= 0 ? "+" : ""}${diff.toFixed(1)}°F` : "—"}</td>
                      <td style={{ padding: "6px 12px", color: C.muted }}>{e.airflow != null ? `${e.airflow}%` : "—"}</td>
                      <td style={{ padding: "6px 12px", color: C.muted }}>{e.power   != null ? `${e.power}%`   : "—"}</td>
                      <td style={{ padding: "6px 8px" }}><button onClick={() => rmEn(e.id)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 14, fontFamily: "inherit" }}>×</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── VUE FIN ──────────────────────────────────────────────────────────────────
const VueFin = ({ batch, entries, events, elapsed, curve, onSave, onBack }) => {
  const [f, setF] = useState({ poids_final: "", couleur: batch.couleur || "", notes_fin: batch.notes_fin || "" });
  const diffs = entries.map(e => { const r = lerp(e.t, curve); return r ? Math.abs(e.et - r) : 0; });
  const avg   = diffs.length ? (diffs.reduce((a, b) => a + b, 0) / diffs.length).toFixed(1) : "—";
  const inTol = diffs.filter(d => d <= TOL).length;
  const perte = f.poids_final && batch.poids_vert ? ((batch.poids_vert - parseFloat(f.poids_final)) / batch.poids_vert * 100).toFixed(1) : null;

  return (
    <div style={{ padding: "24px", maxWidth: 760, margin: "0 auto" }}>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, color: C.gold }}>Résumé du Batch</div>
      <div style={{ color: C.muted, fontSize: 12, marginBottom: 20, marginTop: 2 }}>{batch.batchNum} · {batch.origine || "—"}</div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 14 }}>
        {[["⏱", "Durée", fmtS(elapsed)], ["📊", "Lectures", entries.length], ["🎯", "Dév. moy.", `±${avg}°F`], ["✅", "Dans tol.", `${inTol}/${entries.length}`]].map(([ico, l, v]) => (
          <div key={l} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "14px 12px", textAlign: "center" }}>
            <div style={{ fontSize: 22, marginBottom: 5 }}>{ico}</div>
            <div style={{ color: C.gold, fontWeight: 700, fontSize: 18 }}>{v}</div>
            <div style={{ color: C.muted, fontSize: 10, marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>

      {Object.keys(events).length > 0 && (
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 16px", marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: C.accent, fontWeight: 600, letterSpacing: "0.1em", marginBottom: 10 }}>ÉVÉNEMENTS</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            {EVENT_DEFS.filter(ev => events[ev.id] != null).map(ev => (
              <div key={ev.id} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <span style={{ color: ev.color, fontWeight: 700, fontSize: 12 }}>{ev.label}</span>
                <span style={{ color: C.cream, fontSize: 13, fontWeight: 600 }}>{fmtM(events[ev.id])}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 8px 10px 4px", marginBottom: 14 }}>
        <RoastChart entries={entries} events={events} curve={curve} height={180} />
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 18, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ fontSize: 10, color: C.accent, fontWeight: 600, letterSpacing: "0.1em" }}>COMPLÉTER & SAUVEGARDER</div>
        <div>
          <label style={LBL}>Poids torréfié (g)</label>
          <input type="number" value={f.poids_final} onChange={e => setF(p => ({ ...p, poids_final: e.target.value }))}
            placeholder={batch.poids_vert ? `ex. ${Math.round(batch.poids_vert * 0.84)}` : "ex. 252"} style={INP} />
          {perte && <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>Perte : <b style={{ color: C.cream }}>{perte}%</b></div>}
        </div>
        <div>
          <label style={LBL}>Couleur / Niveau</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {COULEURS.map(c => (
              <button key={c.id} onClick={() => setF(p => ({ ...p, couleur: c.id }))}
                style={{ background: c.bg, color: c.fg, border: `2px solid ${f.couleur === c.id ? C.gold : "transparent"}`, padding: "6px 13px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                {c.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label style={LBL}>Notes de fin</label>
          <textarea value={f.notes_fin} onChange={e => setF(p => ({ ...p, notes_fin: e.target.value }))}
            placeholder="1er crack à 9:30, progression Maillard bien contrôlée…" style={{ ...INP, resize: "vertical", minHeight: 72 }} />
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          <button onClick={onBack} style={{ ...BTN("transparent", C.muted), border: `1px solid ${C.border}`, fontWeight: 400 }}>← Continuer</button>
          <button onClick={() => onSave({ ...f, poids_final: f.poids_final ? parseFloat(f.poids_final) : null })}
            style={{ ...BTN(C.accent, "#fff"), flex: 1 }}>💾 Sauvegarder le batch</button>
        </div>
      </div>
    </div>
  );
};

// ─── VUE DÉTAIL + DÉGUSTATION ─────────────────────────────────────────────────
const VueDetail = ({ batch: initialBatch, onBack, onSaveDegustation, onSaveBatchInfo, curve }) => {
  const [batch,   setBatch]   = useState(initialBatch);
  const entries = batch.readings || [];
  const events  = batch.events  || {};
  const coul    = COULEURS.find(c => c.id === batch.couleur);
  const diffs   = entries.map(e => { const r = lerp(e.t, curve); return r ? Math.abs(e.et - r) : 0; });
  const avg     = diffs.length ? (diffs.reduce((a, b) => a + b, 0) / diffs.length).toFixed(1) : "—";
  const perte   = batch.poids_final && batch.poids_vert ? ((batch.poids_vert - batch.poids_final) / batch.poids_vert * 100).toFixed(1) : null;

  const [editDeg,  setEditDeg]  = useState(false);
  const [editInfo, setEditInfo] = useState(false);
  const [deg,      setDeg]      = useState(batch.degustation || { note: null, aromes: "", saveur: "", corps: "", finale: "", notes: "" });
  const [infoF,    setInfoF]    = useState({ poids_final: batch.poids_final || "", couleur: batch.couleur || "", notes_fin: batch.notes_fin || "" });
  const [saved,    setSaved]    = useState("");

  const hasDeg = batch.degustation && (batch.degustation.note || batch.degustation.aromes || batch.degustation.notes);

  const saveDeg = () => {
    onSaveDegustation(batch.id, deg);
    setBatch(p => ({ ...p, degustation: deg }));
    setSaved("deg"); setEditDeg(false);
    setTimeout(() => setSaved(""), 2000);
  };

  const saveInfo = async () => {
    const updated = { ...batch, poids_final: infoF.poids_final ? parseFloat(infoF.poids_final) : null, couleur: infoF.couleur, notes_fin: infoF.notes_fin };
    await onSaveBatchInfo(updated);
    setBatch(updated);
    setSaved("info"); setEditInfo(false);
    setTimeout(() => setSaved(""), 2000);
  };

  const coulEdit = COULEURS.find(c => c.id === (editInfo ? infoF.couleur : batch.couleur));
  const perteEdit = infoF.poids_final && batch.poids_vert ? ((batch.poids_vert - parseFloat(infoF.poids_final)) / batch.poids_vert * 100).toFixed(1) : null;

  return (
    <div style={{ padding: "20px 24px", maxWidth: 900, margin: "0 auto" }}>
      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <button onClick={onBack} style={{ ...BTN("transparent", C.muted), border: `1px solid ${C.border}`, fontWeight: 400, padding: "6px 12px", fontSize: 12 }}>← Liste</button>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: C.gold }}>{batch.batchNum}</span>
            {coul && <span style={{ background: coul.bg, color: coul.fg, padding: "2px 10px", borderRadius: 10, fontSize: 11, fontWeight: 600 }}>{coul.label}</span>}
            {saved === "deg"  && <span style={{ color: C.green, fontSize: 11 }}>✓ Dégustation sauvegardée</span>}
            {saved === "info" && <span style={{ color: C.green, fontSize: 11 }}>✓ Infos mises à jour</span>}
          </div>
          {batch.origine && <div style={{ color: C.cream, fontSize: 13, marginTop: 2 }}>{batch.origine}</div>}
        </div>
        <button onClick={() => window.print()} style={{ ...BTN(C.surface2, C.muted), border: `1px solid ${C.border}`, padding: "6px 12px", fontSize: 11 }}>🖨 Imprimer</button>
        {batch.degustation?.note && <StarRating value={batch.degustation.note} readOnly />}
      </div>

      {/* GRAPHIQUE */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 8px 10px 4px", marginBottom: 14 }}>
        <RoastChart entries={entries} events={events} curve={curve} height={220} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
        {/* INFOS avec bouton modifier */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontSize: 10, color: C.accent, fontWeight: 600, letterSpacing: "0.1em" }}>INFOS</div>
            <button onClick={() => setEditInfo(p => !p)}
              style={{ ...BTN(editInfo ? C.surface2 : C.accent + "22", editInfo ? C.muted : C.gold), border: `1px solid ${editInfo ? C.border : C.accent}`, padding: "3px 10px", fontSize: 10 }}>
              {editInfo ? "Annuler" : "✏ Modifier"}
            </button>
          </div>

          {!editInfo ? (
            [["Date", batch.date], ["Durée", fmtS(batch.duree_total || 0)], ["Poids vert", batch.poids_vert ? `${batch.poids_vert}g` : "—"], ["Poids torréfié", batch.poids_final ? `${batch.poids_final}g` : "—"], ["Perte", perte ? `${perte}%` : "—"], ["Couleur", coul?.label || "—"], ["Dév. moy.", `±${avg}°F`]].map(([l, v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: `1px solid ${C.border}`, fontSize: 12 }}>
                <span style={{ color: C.muted }}>{l}</span><span style={{ color: C.cream, fontWeight: 600 }}>{v}</span>
              </div>
            ))
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div>
                <label style={LBL}>Poids torréfié (g)</label>
                <input type="number" value={infoF.poids_final} onChange={e => setInfoF(p => ({ ...p, poids_final: e.target.value }))}
                  placeholder={batch.poids_vert ? `ex. ${Math.round(batch.poids_vert * 0.84)}` : "252"} style={INP} />
                {perteEdit && <div style={{ color: C.muted, fontSize: 11, marginTop: 3 }}>Perte: <b style={{ color: C.cream }}>{perteEdit}%</b></div>}
              </div>
              <div>
                <label style={LBL}>Couleur</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {COULEURS.map(c => (
                    <button key={c.id} onClick={() => setInfoF(p => ({ ...p, couleur: c.id }))}
                      style={{ background: c.bg, color: c.fg, border: `2px solid ${infoF.couleur === c.id ? C.gold : "transparent"}`, padding: "4px 10px", borderRadius: 5, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={LBL}>Notes de fin</label>
                <textarea value={infoF.notes_fin} onChange={e => setInfoF(p => ({ ...p, notes_fin: e.target.value }))}
                  style={{ ...INP, resize: "vertical", minHeight: 56 }} />
              </div>
              <button onClick={saveInfo} style={{ ...BTN(C.accent, "#fff"), padding: "8px 16px", fontSize: 12 }}>💾 Sauvegarder</button>
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {Object.keys(events).length > 0 && (
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 10, color: C.accent, fontWeight: 600, letterSpacing: "0.1em", marginBottom: 10 }}>ÉVÉNEMENTS</div>
              {EVENT_DEFS.filter(ev => events[ev.id] != null).map(ev => (
                <div key={ev.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12 }}>
                  <span style={{ color: ev.color, fontWeight: 600 }}>{ev.label}</span>
                  <span style={{ color: C.cream }}>{fmtM(events[ev.id])}</span>
                </div>
              ))}
            </div>
          )}
          {(batch.notes_debut || batch.notes_fin) && (
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16, flex: 1 }}>
              <div style={{ fontSize: 10, color: C.accent, fontWeight: 600, letterSpacing: "0.1em", marginBottom: 10 }}>NOTES TORRÉFACTION</div>
              {batch.notes_debut && <div style={{ color: C.muted, fontSize: 11, marginBottom: 6 }}><b>Départ:</b> {batch.notes_debut}</div>}
              {batch.notes_fin   && <div style={{ color: C.muted, fontSize: 11 }}><b>Fin:</b> {batch.notes_fin}</div>}
            </div>
          )}
        </div>
      </div>

      {/* DÉGUSTATION */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 18, marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 10, color: C.accent, fontWeight: 600, letterSpacing: "0.1em" }}>☕ DÉGUSTATION</div>
          <button onClick={() => setEditDeg(p => !p)}
            style={{ ...BTN(editDeg ? C.surface2 : C.accent + "33", editDeg ? C.muted : C.gold), border: `1px solid ${editDeg ? C.border : C.accent}`, padding: "5px 14px", fontSize: 11 }}>
            {editDeg ? "Annuler" : hasDeg ? "✏ Modifier" : "+ Ajouter une dégustation"}
          </button>
        </div>
        {!editDeg && !hasDeg && (
          <div style={{ textAlign: "center", padding: "24px", color: C.muted, fontSize: 12 }}>
            <div style={{ fontSize: 30, marginBottom: 8 }}>👃</div>
            Ajoutez vos impressions après dégustation — arômes, saveur, corps, note
          </div>
        )}
        {!editDeg && hasDeg && (
          <div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ ...LBL, marginBottom: 6 }}>Note globale</div>
              <StarRating value={batch.degustation.note} readOnly />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {DEGUST_FIELDS.map(f => batch.degustation[f.k] && (
                <div key={f.k} style={{ gridColumn: f.k === "notes" ? "1 / -1" : "auto" }}>
                  <div style={{ ...LBL, marginBottom: 4 }}>{f.label}</div>
                  <div style={{ color: C.cream, fontSize: 13 }}>{batch.degustation[f.k]}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {editDeg && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={LBL}>Note globale (/10)</label>
              <StarRating value={deg.note} onChange={n => setDeg(p => ({ ...p, note: n }))} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {DEGUST_FIELDS.map(f => (
                <div key={f.k} style={{ gridColumn: f.k === "notes" ? "1 / -1" : "auto" }}>
                  <label style={LBL}>{f.label}</label>
                  {f.k === "notes"
                    ? <textarea value={deg[f.k]} onChange={e => setDeg(p => ({ ...p, [f.k]: e.target.value }))} placeholder={f.ph} style={{ ...INP, resize: "vertical", minHeight: 72 }} />
                    : <input   value={deg[f.k]} onChange={e => setDeg(p => ({ ...p, [f.k]: e.target.value }))} placeholder={f.ph} style={INP} />
                  }
                </div>
              ))}
            </div>
            <button onClick={saveDeg} style={{ ...BTN(C.accent, "#fff"), alignSelf: "flex-end", padding: "10px 28px" }}>💾 Sauvegarder la dégustation</button>
          </div>
        )}
      </div>

      {/* LOG IMPRIMABLE */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 10, color: C.accent, fontWeight: 600, letterSpacing: "0.1em" }}>📋 LOG DE TORRÉFACTION</div>
          <button onClick={() => window.print()} style={{ ...BTN(C.surface2, C.muted), border: `1px solid ${C.border}`, padding: "4px 12px", fontSize: 11 }}>🖨 Imprimer</button>
        </div>

        {/* En-tête fiche */}
        <div style={{ borderBottom: `2px solid ${C.border}`, paddingBottom: 10, marginBottom: 12 }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: C.gold }}>Le Brûleur de l'est — Fiche de Torréfaction</div>
          <div style={{ display: "flex", gap: 24, marginTop: 6, flexWrap: "wrap", fontSize: 12 }}>
            <span style={{ color: C.muted }}>Batch : <b style={{ color: C.cream }}>{batch.batchNum}</b></span>
            <span style={{ color: C.muted }}>Date : <b style={{ color: C.cream }}>{batch.date}</b></span>
            <span style={{ color: C.muted }}>Origine : <b style={{ color: C.cream }}>{batch.origine || "—"}</b></span>
            <span style={{ color: C.muted }}>Poids vert : <b style={{ color: C.cream }}>{batch.poids_vert ? `${batch.poids_vert}g` : "—"}</b></span>
            <span style={{ color: C.muted }}>Poids torréfié : <b style={{ color: C.cream }}>{batch.poids_final ? `${batch.poids_final}g` : "—"}</b></span>
            {perte && <span style={{ color: C.muted }}>Perte : <b style={{ color: C.cream }}>{perte}%</b></span>}
            {coul && <span style={{ color: C.muted }}>Couleur : <b style={{ color: C.cream }}>{coul.label}</b></span>}
            <span style={{ color: C.muted }}>Durée : <b style={{ color: C.cream }}>{fmtS(batch.duree_total || 0)}</b></span>
          </div>
        </div>

        {/* Événements */}
        {Object.keys(events).length > 0 && (
          <div style={{ display: "flex", gap: 20, marginBottom: 12, flexWrap: "wrap" }}>
            {EVENT_DEFS.filter(ev => events[ev.id] != null).map(ev => (
              <span key={ev.id} style={{ fontSize: 12, color: C.muted }}>
                {ev.label} : <b style={{ color: ev.color }}>{fmtM(events[ev.id])}</b>
              </span>
            ))}
          </div>
        )}

        {/* Tableau des lectures */}
        {entries.length > 0 && (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginBottom: 12 }}>
            <thead>
              <tr style={{ background: C.surface2 }}>
                {["Heure", "ET/AT (°F)", "Réf. (°F)", "Écart", "Airflow", "Puissance"].map(h => (
                  <th key={h} style={{ padding: "6px 10px", textAlign: "left", color: C.muted, fontSize: 10, fontWeight: 600, letterSpacing: "0.07em", borderBottom: `1px solid ${C.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entries.map((e, i) => {
                const ref  = lerp(e.t, curve);
                const diff = ref != null ? e.et - ref : null;
                const col  = dotColor(e.et, e.t, curve);
                return (
                  <tr key={e.id} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 ? C.surface2 : "transparent" }}>
                    <td style={{ padding: "5px 10px", color: C.gold, fontWeight: 700 }}>{fmtM(e.t)}</td>
                    <td style={{ padding: "5px 10px", color: col, fontWeight: 700 }}>{e.et.toFixed(1)}</td>
                    <td style={{ padding: "5px 10px", color: C.muted }}>{ref != null ? ref.toFixed(1) : "—"}</td>
                    <td style={{ padding: "5px 10px", color: col }}>{diff != null ? `${diff >= 0 ? "+" : ""}${diff.toFixed(1)}` : "—"}</td>
                    <td style={{ padding: "5px 10px", color: C.muted }}>{e.airflow != null ? `${e.airflow}%` : "—"}</td>
                    <td style={{ padding: "5px 10px", color: C.muted }}>{e.power   != null ? `${e.power}%`   : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Notes et dégustation */}
        {(batch.notes_debut || batch.notes_fin || batch.degustation?.aromes) && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 12 }}>
            <div>
              {batch.notes_debut && <div style={{ color: C.muted, marginBottom: 4 }}><b style={{ color: C.cream }}>Notes départ :</b> {batch.notes_debut}</div>}
              {batch.notes_fin   && <div style={{ color: C.muted }}><b style={{ color: C.cream }}>Notes fin :</b> {batch.notes_fin}</div>}
            </div>
            {batch.degustation && (
              <div>
                {batch.degustation.note && <div style={{ color: C.muted, marginBottom: 3 }}><b style={{ color: C.cream }}>Note :</b> {batch.degustation.note}/10</div>}
                {batch.degustation.aromes && <div style={{ color: C.muted, marginBottom: 3 }}><b style={{ color: C.cream }}>Arômes :</b> {batch.degustation.aromes}</div>}
                {batch.degustation.saveur && <div style={{ color: C.muted, marginBottom: 3 }}><b style={{ color: C.cream }}>Saveur :</b> {batch.degustation.saveur}</div>}
                {batch.degustation.corps  && <div style={{ color: C.muted, marginBottom: 3 }}><b style={{ color: C.cream }}>Corps :</b> {batch.degustation.corps}</div>}
                {batch.degustation.finale && <div style={{ color: C.muted }}><b style={{ color: C.cream }}>Finale :</b> {batch.degustation.finale}</div>}
              </div>
            )}
          </div>
        )}
      </div>

      {/* CSS IMPRESSION */}
      <style>{`
        @media print {
          body { background: white !important; color: black !important; }
          nav, button, [class*="navbar"] { display: none !important; }
          * { color: black !important; background: white !important; border-color: #ccc !important; }
        }
      `}</style>
    </div>
  );
};

// ─── VUE PARAMÈTRES ───────────────────────────────────────────────────────────
const VueParams = ({ curve, onSave }) => {
  const [rows,      setRows]      = useState(curve.map((p, i) => ({ ...p, _id: i })));
  const [saved,     setSaved]     = useState(false);
  const [selProfil, setSelProfil] = useState(null);

  const load = p => setRows(p.points.map((pt, i) => ({ ...pt, _id: i })));
  const upd  = (id, f, v) => setRows(prev => prev.map(p => p._id === id ? { ...p, [f]: parseFloat(v) || 0 } : p));
  const add  = () => { const l = [...rows].sort((a, b) => a.t - b.t).slice(-1)[0]; setRows(prev => [...prev, { t: l.t + 0.5, ref: l.ref, _id: Date.now() }]); };
  const rm   = id => setRows(prev => prev.filter(p => p._id !== id));
  const save = () => { const sorted = [...rows].sort((a, b) => a.t - b.t).map(({ _id, ...p }) => p); onSave(sorted); setSaved(true); setTimeout(() => setSaved(false), 2500); };

  const sorted = [...rows].sort((a, b) => a.t - b.t);
  const CINP   = { background: C.surface2, border: `1px solid ${C.border}`, color: C.cream, padding: "5px 8px", borderRadius: 4, fontSize: 12, outline: "none", width: "100%", textAlign: "center", fontFamily: "inherit" };

  return (
    <div style={{ padding: "24px", maxWidth: 820, margin: "0 auto" }}>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: C.gold }}>Paramètres</div>
      <div style={{ color: C.muted, fontSize: 12, marginBottom: 20, marginTop: 2 }}>Courbe de référence ET/AT (°F) · Tolérance : ±{TOL}°F</div>

      {/* Profils prédéfinis */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16, marginBottom: 14 }}>
        <div style={{ fontSize: 10, color: C.accent, fontWeight: 600, letterSpacing: "0.1em", marginBottom: 12 }}>
          6 PROFILS PRÉDÉFINIS — cliquer pour charger dans l'éditeur
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {PROFILS.map(p => {
            const coul   = COULEURS.find(c => c.id === p.couleur_cible);
            const active = selProfil === p.id;
            return (
              <button key={p.id} onClick={() => { load(p); setSelProfil(p.id); }}
                style={{ background: active ? (coul?.bg || C.accent) + "33" : C.surface2, border: `2px solid ${active ? C.gold : C.border}`, borderRadius: 7, padding: "10px 12px", textAlign: "left", cursor: "pointer", fontFamily: "inherit" }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>{p.emoji}</div>
                <div style={{ color: active ? C.gold : C.cream, fontWeight: 700, fontSize: 12 }}>{p.label}</div>
                <div style={{ color: C.muted, fontSize: 10, marginTop: 3, lineHeight: 1.4 }}>{p.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Aperçu */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 8px 10px 4px", marginBottom: 14 }}>
        <div style={{ fontSize: 10, color: C.muted, paddingLeft: 12, marginBottom: 6 }}>Aperçu de la courbe dans l'éditeur</div>
        <RoastChart entries={[]} events={{}} curve={sorted} height={180} />
      </div>

      {/* Tableau éditable */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden", marginBottom: 10 }}>
        <div style={{ padding: "10px 14px", background: C.surface2, borderBottom: `1px solid ${C.border}`, fontSize: 10, color: C.accent, fontWeight: 600, letterSpacing: "0.1em" }}>
          PERSONNALISER — modifier les valeurs directement
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: C.surface2 }}>
              <th style={{ padding: "8px 14px", color: C.muted, fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", borderBottom: `1px solid ${C.border}`, textAlign: "left" }}>Temps (min)</th>
              <th style={{ padding: "8px 14px", color: C.muted, fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", borderBottom: `1px solid ${C.border}`, textAlign: "left" }}>ET réf. (°F)</th>
              <th style={{ width: 36, borderBottom: `1px solid ${C.border}` }}></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p, i) => (
              <tr key={p._id} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 ? C.surface2 : "transparent" }}>
                <td style={{ padding: "4px 10px" }}><input type="number" value={p.t}   step="0.5" onChange={e => upd(p._id, "t",   e.target.value)} style={CINP} /></td>
                <td style={{ padding: "4px 10px" }}><input type="number" value={p.ref}           onChange={e => upd(p._id, "ref", e.target.value)} style={CINP} /></td>
                <td style={{ padding: "4px 8px", textAlign: "center" }}>
                  <button onClick={() => rm(p._id)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 14, fontFamily: "inherit" }}>×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <button onClick={add} style={{ ...BTN(C.surface2, C.cream), border: `1px solid ${C.border}`, fontWeight: 400, fontSize: 12, padding: "8px 14px" }}>+ Point</button>
      </div>

      <button onClick={save} style={{ ...BTN(saved ? "#059669" : C.accent, "#fff"), width: "100%", padding: "12px", transition: "background 0.3s" }}>
        {saved ? "✓ Sauvegardé comme courbe active!" : "💾 Sauvegarder comme courbe active"}
      </button>
    </div>
  );
};

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [view,    setView]    = useState("list");
  const [batches, setBatches] = useState([]);
  const [active,  setActive]  = useState(null);
  const [entries, setEntries] = useState([]);
  const [events,  setEvents]  = useState({});
  const [curve,   setCurve]   = useState(PROFILS[0].points);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [detail,  setDetail]  = useState(null);
  const [loaded,  setLoaded]  = useState(false);

  const timerRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
  if (!user) return
  console.log('user connected:', user.id)
  ;(async () => {
    const b = await loadBatches().catch(e => { console.log('catch:', e); return [] })
    console.log('batches loaded:', b)
    if (b?.length) setBatches(b)
    setLoaded(true)
  })()
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (!loaded || !active) return;
    sSet(SK.active, { batch: active, entries, events, elapsed });
  }, [entries, events, active, loaded]);

  const startTimer = () => {
    startRef.current = Date.now() - elapsed * 1000;
    setRunning(true);
    timerRef.current = setInterval(() => setElapsed(Math.floor((Date.now() - startRef.current) / 1000)), 500);
  };
  const pauseTimer = () => { clearInterval(timerRef.current); setRunning(false); };

  const handleCreate = batch => { setActive(batch); setEntries([]); setEvents({}); setElapsed(0); setRunning(false); setView("journal"); };

  const handleOpen = batch => {
    if (batch.statut !== "termine") {
      setActive(batch); setEntries(batch.readings || []); setEvents(batch.events || {}); setElapsed(batch.duree_total || 0); setView("journal");
    } else {
      setDetail(batch); setView("detail");
    }
  };

  const handleFin = () => { pauseTimer(); setView("fin"); };

  const handleSave = async finData => {
    const done = { ...active, ...finData, readings: entries, events, duree_total: elapsed, statut: "termine" };
    const next  = [...batches.filter(b => b.id !== active.id), done];
    setBatches(next); await sSet(SK.batches, next); await sDel(SK.active);
    setActive(null); setEntries([]); setEvents({}); setElapsed(0); setRunning(false); setView("list");
  };

  const handleSaveDegustation = async (batchId, deg) => {
    const next = batches.map(b => b.id === batchId ? { ...b, degustation: deg } : b);
    setBatches(next); await sSet(SK.batches, next);
    setDetail(prev => prev?.id === batchId ? { ...prev, degustation: deg } : prev);
  }

  const handleSaveBatchInfo = async (updated) => {
  const next = batches.map(b => b.id === updated.id ? updated : b)
  setBatches(next)
  await sSet(SK.batches, next)
  setDetail(updated) 
};

  const handleSaveCurve = async c => { setCurve(c); await sSet(SK.ref, c); };

  if (!loaded) return (
    <div style={{ background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'IBM Plex Mono', monospace", color: C.muted }}>Chargement…</div>
  );

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.cream, fontFamily: "'IBM Plex Mono', 'Courier New', monospace" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Cormorant+Garamond:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder, textarea::placeholder { color: #4A3820; }
        input:focus, textarea:focus { border-color: ${C.accent} !important; outline: none; }
        button { cursor: pointer; transition: opacity 0.15s; font-family: inherit; }
        button:hover { opacity: 0.82; } button:active { opacity: 0.65; }
        select { color-scheme: dark; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 2px; }
      `}</style>

      {/* NAVBAR */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "10px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: C.gold, flex: 1 }}>☕ RoastLog</div>
        {[{ id: "list", label: "Batches", ico: "☕" }, { id: "settings", label: "Paramètres", ico: "⚙" }].map(n => (
          <button key={n.id} onClick={() => setView(n.id)}
            style={{ background: view === n.id ? C.accent + "22" : "transparent", color: view === n.id ? C.gold : C.muted, border: `1px solid ${view === n.id ? C.accent : "transparent"}`, padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600 }}>
            {n.ico} {n.label}
          </button>
        ))}
        {active && (
          <button onClick={() => setView("journal")}
            style={{ background: (view === "journal" || view === "fin") ? "#05966933" : "#05966915", color: "#34D399", border: `1px solid ${(view === "journal" || view === "fin") ? "#059669" : "#05966944"}`, padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600 }}>
            🔥 {active.batchNum} {running ? `· ${fmtS(elapsed)}` : "· En pause"}
          </button>
        )}
      </div>

      {view === "list"    && <VueListe    batches={batches} onNew={() => setView("create")} onOpen={handleOpen} />}
      {view === "create"  && <VueCreer   batches={batches} onStart={handleCreate} onCancel={() => setView("list")} />}
      {view === "journal" && active && <VueJournal batch={active} entries={entries} events={events} setEntries={setEntries} setEvents={setEvents} elapsed={elapsed} running={running} onStart={startTimer} onPause={pauseTimer} onFin={handleFin} curve={curve} />}
      {view === "fin"     && active && <VueFin batch={active} entries={entries} events={events} elapsed={elapsed} curve={curve} onSave={handleSave} onBack={() => { startTimer(); setView("journal"); }} />}
      {view === "detail"  && detail && <VueDetail batch={detail} curve={curve} onBack={() => { setDetail(null); setView("list"); }} onSaveDegustation={handleSaveDegustation} onSaveBatchInfo={handleSaveBatchInfo} />}
      {view === "settings"           && <VueParams curve={curve} onSave={handleSaveCurve} />}
    </div>
  );
}