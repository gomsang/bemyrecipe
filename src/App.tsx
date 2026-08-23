import { onAuthStateChanged } from "firebase/auth";
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  CircleUserRound,
  Cloud,
  Coffee,
  Copy,
  KeyRound,
  LoaderCircle,
  LogOut,
  Menu,
  Snowflake,
  RefreshCw,
  Search,
  Server,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Thermometer,
  Trash2,
  Waves,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { AidenProfile } from "../shared/aiden-profile";
import { ProfileEditor } from "./components/ProfileEditor";
import { LoginDialog } from "./components/LoginDialog";
import { auth, callServer, firebaseConfigured, loadPublicRecipes, logout, type AuthUser } from "./lib/firebase";
import type { Catalog, CatalogRecipe } from "./lib/types";

type View = "recipes" | "aiden" | "manage";
type StatusFilter = "all" | "accepted" | "candidate";

type ApiToken = {
  id: string;
  label: string;
  prefix: string;
  createdAt: string;
  lastUsedAt: string | null;
};

type AidenDevice = { id: string; name: string; firmware?: string; profileCount?: number };
type RemoteProfile = AidenProfile & { id: string };
type Dashboard = {
  aiden: { configured: boolean; maskedEmail: string | null; devices: AidenDevice[]; connectionError?: string | null };
  tokens: ApiToken[];
  profiles: RemoteProfile[];
  recipes: CatalogRecipe[];
};

const EMPTY_DASHBOARD: Dashboard = {
  aiden: { configured: false, maskedEmail: null, devices: [] },
  tokens: [],
  profiles: [],
  recipes: [],
};

function App() {
  const [recipes, setRecipes] = useState<CatalogRecipe[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");
  const [view, setView] = useState<View>("recipes");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authReady, setAuthReady] = useState(!firebaseConfigured);
  const [loginOpen, setLoginOpen] = useState(false);
  const [dashboard, setDashboard] = useState<Dashboard>(EMPTY_DASHBOARD);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/catalog.json")
      .then((response) => response.json() as Promise<Catalog>)
      .then((catalog) => {
        if (!active) return;
        setRecipes(catalog.recipes);
        setSelectedId(catalog.recipes[0]?.id ?? "");
      })
      .catch(() => undefined);
    loadPublicRecipes()
      .then((liveRecipes) => {
        if (!active || !liveRecipes.length) return;
        setRecipes(liveRecipes);
        setSelectedId((current) => current || liveRecipes[0]?.id || "");
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setAuthReady(true);
      if (!nextUser) {
        setView("recipes");
        setDashboard(EMPTY_DASHBOARD);
      }
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    refreshDashboard();
  }, [user]);

  async function refreshDashboard() {
    setDashboardLoading(true);
    try {
      const next = await callServer<Record<string, never>, Dashboard>("getDashboard", {});
      setDashboard(next);
    } catch {
      setDashboard(EMPTY_DASHBOARD);
    } finally {
      setDashboardLoading(false);
    }
  }

  const filtered = useMemo(() => recipes.filter((recipe) => {
    const statusMatches = status === "all" || recipe.status === status;
    const haystack = `${recipe.title} ${recipe.bean.name} ${recipe.bean.origin} ${recipe.bean.tastingNotes.join(" ")}`.toLowerCase();
    return statusMatches && haystack.includes(query.trim().toLowerCase());
  }), [recipes, status, query]);

  const selected = recipes.find((recipe) => recipe.id === selectedId) ?? filtered[0];
  const acceptedCount = recipes.filter((recipe) => recipe.status === "accepted").length;
  const candidateCount = recipes.filter((recipe) => recipe.status === "candidate").length;

  function navigate(next: View) {
    setView(next);
    setMobileNav(false);
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <button className="brand" onClick={() => navigate("recipes")} aria-label="Be My Recipe 홈">
          <span className="brand-mark"><Waves size={18} strokeWidth={1.6} /></span>
          <span>BE MY RECIPE</span>
        </button>
        <nav className={mobileNav ? "top-nav mobile-open" : "top-nav"}>
          <button className={view === "recipes" ? "active" : ""} onClick={() => navigate("recipes")}>Recipes</button>
          {user ? <button className={view === "aiden" ? "active" : ""} onClick={() => navigate("aiden")}>My Aiden</button> : null}
          {user ? <button className={view === "manage" ? "active" : ""} onClick={() => navigate("manage")}>Console</button> : null}
        </nav>
        <div className="header-actions">
          {user ? <span className="user-dot" title={user.email ?? ""} /> : null}
          <button className="icon-button" onClick={() => user ? navigate("manage") : setLoginOpen(true)} aria-label={user ? "관리 화면" : "로그인"}>
            <CircleUserRound size={19} strokeWidth={1.6} />
          </button>
          <button className="icon-button menu-button" onClick={() => setMobileNav((current) => !current)} aria-label="메뉴">
            {mobileNav ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {!authReady ? <div className="route-loader"><LoaderCircle className="spin" /></div> : null}
      {authReady && view === "recipes" ? (
        <PublicRecipes
          recipes={recipes}
          filtered={filtered}
          selected={selected}
          selectedId={selectedId}
          onSelect={setSelectedId}
          status={status}
          onStatus={setStatus}
          query={query}
          onQuery={setQuery}
          acceptedCount={acceptedCount}
          candidateCount={candidateCount}
        />
      ) : null}
      {authReady && user && view === "aiden" ? (
        <AidenView dashboard={dashboard} loading={dashboardLoading} onRefresh={refreshDashboard} recipes={recipes} />
      ) : null}
      {authReady && user && view === "manage" ? (
        <ConsoleView user={user} dashboard={dashboard} loading={dashboardLoading} onRefresh={refreshDashboard} />
      ) : null}

      <footer className="site-footer">
        <span>BE MY RECIPE / SEOUL</span>
        <span>AIDEN PROFILE ARCHIVE</span>
        <span>2026</span>
      </footer>
      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </div>
  );
}

type PublicRecipesProps = {
  recipes: CatalogRecipe[];
  filtered: CatalogRecipe[];
  selected?: CatalogRecipe;
  selectedId: string;
  onSelect: (id: string) => void;
  status: StatusFilter;
  onStatus: (status: StatusFilter) => void;
  query: string;
  onQuery: (query: string) => void;
  acceptedCount: number;
  candidateCount: number;
};

function PublicRecipes(props: PublicRecipesProps) {
  return (
    <main>
      <section className="hero">
        <div className="eyebrow"><span /> PERSONAL BREW INDEX</div>
        <h1>좋은 한 잔은<br /><em>기록에서</em> 시작됩니다.</h1>
        <p>원두의 맥락과 실제 추출 결과를 함께 쌓아가는 Fellow Aiden 레시피 아카이브.</p>
        <div className="hero-counts">
          <button onClick={() => props.onStatus("accepted")}><strong>{String(props.acceptedCount).padStart(2, "0")}</strong><span>ACCEPTED</span><ArrowUpRight size={16} /></button>
          <button onClick={() => props.onStatus("candidate")}><strong>{String(props.candidateCount).padStart(2, "0")}</strong><span>CANDIDATES</span><ArrowDownRight size={16} /></button>
        </div>
      </section>

      <section className="catalog-section">
        <div className="catalog-toolbar">
          <div className="status-tabs" role="tablist">
            {(["all", "accepted", "candidate"] as StatusFilter[]).map((value) => (
              <button className={props.status === value ? "active" : ""} onClick={() => props.onStatus(value)} key={value}>
                {value === "all" ? "All recipes" : value[0].toUpperCase() + value.slice(1)}
                <span>{value === "all" ? props.recipes.length : props.recipes.filter((recipe) => recipe.status === value).length}</span>
              </button>
            ))}
          </div>
          <label className="search-box">
            <Search size={17} />
            <input value={props.query} onChange={(event) => props.onQuery(event.target.value)} placeholder="원두, 산지, 노트 검색" />
          </label>
          <button className="filter-button" aria-label="필터"><SlidersHorizontal size={17} /></button>
        </div>

        <div className="catalog-layout">
          <div className="recipe-list">
            {props.filtered.map((recipe, index) => (
              <button className={props.selectedId === recipe.id ? "recipe-row selected" : "recipe-row"} onClick={() => props.onSelect(recipe.id)} key={recipe.id}>
                <span className="recipe-index">{String(index + 1).padStart(2, "0")}</span>
                <div className="recipe-copy">
                  <div className="recipe-meta"><StatusBadge status={recipe.status} /><ServeModeBadge mode={recipe.serveMode} /><span>{recipe.bean.origin}</span><span>{recipe.bean.process}</span></div>
                  <h2>{recipe.title}</h2>
                  <p>{recipe.bean.tastingNotes.join(" · ")}</p>
                </div>
                <div className="recipe-specs">
                  <span><b>{recipe.brew.doseG}g</b> DOSE</span>
                  <span><b>{recipe.brew.brewWaterG}ml</b> WATER</span>
                  <span><b>1:{recipe.profile.nominal_ratio}</b> RATIO</span>
                </div>
                <ChevronRight className="row-arrow" size={19} />
              </button>
            ))}
            {!props.filtered.length ? <div className="empty-list">조건에 맞는 레시피가 없습니다.</div> : null}
          </div>
          {props.selected ? <RecipeDetail recipe={props.selected} /> : <div className="detail-empty">레시피를 불러오는 중입니다.</div>}
        </div>
      </section>
    </main>
  );
}

function StatusBadge({ status }: { status: CatalogRecipe["status"] }) {
  return <span className={`status-badge ${status}`}>{status === "accepted" ? <Check size={11} /> : null}{status.toUpperCase()}</span>;
}

function ServeModeBadge({ mode }: { mode: CatalogRecipe["serveMode"] }) {
  return <span className={`serve-mode-badge ${mode}`}>{mode === "iced" ? <Snowflake size={10} /> : <Thermometer size={10} />}{mode.replace("_", " ").toUpperCase()}</span>;
}

function vesselLabel(value: string) {
  if (value === "carafe") return "CARAFE";
  return value.replaceAll("-", " ").toUpperCase();
}

function RecipeDetail({ recipe }: { recipe: CatalogRecipe }) {
  return (
    <aside className="recipe-detail">
      <div className="detail-topline"><span>{recipe.serveMode.toUpperCase()} / {recipe.brewMethod.toUpperCase()}</span><span>V{recipe.version}.0</span></div>
      <div className="detail-badges"><StatusBadge status={recipe.status} /><ServeModeBadge mode={recipe.serveMode} /></div>
      <h2>{recipe.bean.name}</h2>
      <p className="detail-summary">{recipe.summary}</p>
      <div className="note-strip">{recipe.bean.tastingNotes.map((note) => <span key={note}>{note}</span>)}</div>

      <div className="metric-grid">
        <Metric icon={<Coffee />} label="DOSE" value={`${recipe.brew.doseG}g`} />
        <Metric icon={<Waves />} label="BREW WATER" value={`${recipe.brew.brewWaterG}ml`} />
        <Metric icon={<Thermometer />} label="BASE TEMP" value={`${recipe.profile.profile_temperature_c}°C`} />
        <Metric icon={<Settings2 />} label="GRIND" value={recipe.brew.grindSetting} />
      </div>

      <section className="brew-program">
        <div className="detail-section-title"><span>BREW PROGRAM</span><span>{recipe.profile.pulse_count + 1} PHASES</span></div>
        <PhaseRow number="B" name="Bloom" detail={`1:${recipe.profile.bloom_ratio} / ${recipe.profile.bloom_seconds}s`} temp={recipe.profile.bloom_temp_c} />
        {recipe.profile.pulse_temps_c.map((temperature, index) => (
          <PhaseRow number={String(index + 1).padStart(2, "0")} name={`Pulse ${index + 1}`} detail={`${recipe.profile.pulse_interval_seconds}s interval`} temp={temperature} key={index} />
        ))}
      </section>

      {recipe.serveMode === "iced" ? (
        <section className="ice-program">
          <div className="detail-section-title"><span>ICE PLAN</span><span>{recipe.preparation.icePlan.strategy.toUpperCase()}</span></div>
          <div className="ice-cards">
            <div>
              <span className="ice-icon"><Snowflake size={15} /></span>
              <small>BREW ICE · {vesselLabel(recipe.preparation.icePlan.brewIce.vessel)} · 추출 전</small>
              <strong>{recipe.preparation.icePlan.brewIce.grams}g</strong>
              <p>카라페에서 뜨거운 추출액을 즉시 식히고 최종 농도를 만듭니다. 녹는 것이 정상입니다.</p>
            </div>
            <div>
              <span className="ice-icon"><Snowflake size={15} /></span>
              <small>SERVING ICE · {vesselLabel(recipe.preparation.icePlan.servingIce.vessel)} · 이송 직전</small>
              <strong>{recipe.preparation.icePlan.servingIce.grams}g</strong>
              <p>음용 컵에 새로 넣어 마시는 동안 차가움과 남은 얼음을 유지합니다.</p>
            </div>
          </div>
        </section>
      ) : null}

      <section className="prep-program">
        <div className="detail-section-title"><span>PREPARATION</span><span>{recipe.preparation.steps.length} STEPS</span></div>
        <div className="rinse-note">
          <span>FILTER RINSE</span>
          <strong>{recipe.preparation.filterRinse.enabled ? "HOT WATER / DISCARD" : "NO RINSE"}</strong>
          <p>{recipe.preparation.filterRinse.enabled
            ? "Paper filter를 적신 뒤 카라페의 린스 물을 완전히 버립니다. 그 다음 Brew ice를 넣어야 계산한 농도가 유지됩니다."
            : "이 레시피는 필터 린싱을 하지 않습니다. 준비 과정에서 별도의 물을 더하지 않습니다."}</p>
        </div>
        {recipe.preparation.steps.map((step, index) => (
          <div className="prep-row" key={step.id}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div><strong>{step.label}</strong><p>{step.instruction}</p></div>
            {step.critical ? <i>KEY</i> : null}
          </div>
        ))}
      </section>

      <section className="brew-balance">
        <div><span>BREW ICE</span><strong>{recipe.brew.brewIceG}g</strong></div>
        <div><span>SERVING ICE</span><strong>{recipe.brew.servingIceG}g</strong></div>
        <div><span>CUP</span><strong>{recipe.brew.cupCapacityMl}ml</strong></div>
      </section>
      <div className="source-line"><ShieldCheck size={15} /><span>{recipe.validation.valid ? "Aiden 입력값 검증 완료" : "입력값 확인 필요"}</span><span>{recipe.created}</span></div>
    </aside>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="metric"><span className="metric-icon">{icon}</span><span>{label}</span><strong>{value}</strong></div>;
}

function PhaseRow({ number, name, detail, temp }: { number: string; name: string; detail: string; temp: number }) {
  return <div className="phase-row"><span className="phase-number">{number}</span><div><strong>{name}</strong><small>{detail}</small></div><span className="phase-temp">{temp}°</span></div>;
}

function AidenView({ dashboard, loading, onRefresh, recipes }: { dashboard: Dashboard; loading: boolean; onRefresh: () => void; recipes: CatalogRecipe[] }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<RemoteProfile | null>(null);
  const [reconnecting, setReconnecting] = useState(false);

  async function saveCredentials() {
    setSaving(true);
    setMessage("");
    try {
      await callServer("saveAidenCredentials", { email: email.trim(), password });
      setPassword("");
      setMessage("Aiden 연결을 확인하고 암호화해 저장했습니다.");
      setReconnecting(false);
      onRefresh();
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : "저장할 수 없습니다.");
    } finally {
      setSaving(false);
    }
  }

  async function saveProfile() {
    if (!editing) return;
    setSaving(true);
    try {
      await callServer("saveAidenProfile", { profileId: editing.id.startsWith("new-") ? null : editing.id, profile: editing });
      setMessage("Aiden에 프로필을 저장했습니다.");
      setEditing(null);
      onRefresh();
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : "프로필을 저장할 수 없습니다.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteProfile() {
    if (!editing || editing.id.startsWith("new-")) return;
    if (!window.confirm(`Aiden에서 '${editing.profile_name}' 프로필을 삭제할까요? 이 작업은 되돌릴 수 없습니다.`)) return;
    setSaving(true);
    try {
      await callServer("deleteAidenProfile", { profileId: editing.id });
      setMessage("Aiden에서 프로필을 삭제했습니다.");
      setEditing(null);
      onRefresh();
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : "프로필을 삭제할 수 없습니다.");
    } finally {
      setSaving(false);
    }
  }

  function newFromRecipe() {
    const profile = recipes.find((recipe) => recipe.brewReady)?.profile;
    if (profile) setEditing({ ...profile, id: `new-${Date.now()}` });
  }

  return (
    <main className="private-main">
      <PrivateHeader eyebrow="DEVICE" title="My Aiden" description="기기 연결 상태와 저장된 프로필을 한곳에서 확인합니다." onRefresh={onRefresh} loading={loading} />
      {!dashboard.aiden.configured || reconnecting ? (
        <section className="connection-card">
          <div className="connection-graphic"><Coffee size={42} strokeWidth={1.1} /><span /></div>
          <div className="connection-copy"><span className="overline">CONNECT YOUR BREWER</span><h2>Fellow 계정을 연결하세요.</h2><p>입력한 계정 정보는 서버 비밀키로 암호화한 뒤 저장합니다. 브라우저나 공개 레시피 데이터에는 남지 않습니다.</p></div>
          <div className="credential-form">
            <label><span>Fellow email</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
            <label><span>Fellow password</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
            <button className="primary-button" onClick={saveCredentials} disabled={saving || !email || !password}>{saving ? "연결 확인 중…" : "연결하고 저장"}</button>
            {dashboard.aiden.configured ? <button className="secondary-button" onClick={() => setReconnecting(false)}>취소</button> : null}
          </div>
        </section>
      ) : (
        <>
          <section className="device-strip">
            <div><span className="online-pulse" /><div><small>CONNECTED ACCOUNT</small><strong>{dashboard.aiden.maskedEmail}</strong></div></div>
            {dashboard.aiden.devices.map((device) => <div key={device.id}><Server size={18} /><div><small>{device.firmware ? `FIRMWARE ${device.firmware}` : "AIDEN"}</small><strong>{device.name}</strong></div></div>)}
            <button className="secondary-button" onClick={() => { setEmail(""); setPassword(""); setReconnecting(true); }}>계정 다시 연결</button>
          </section>
          {dashboard.aiden.connectionError ? <div className="toast-line error">Aiden 연결 확인 실패: {dashboard.aiden.connectionError}</div> : null}
          <section className="private-section">
            <div className="private-section-title"><div><span>PROFILES</span><h2>기기에 저장된 프로필</h2></div><button className="primary-button small" onClick={newFromRecipe}>새 프로필</button></div>
            <div className="profile-table">
              {dashboard.profiles.map((profile) => (
                <button className="profile-table-row" key={profile.id} onClick={() => setEditing(profile)}>
                  <span className="profile-id">{profile.id}</span>
                  <span><strong>{profile.profile_name}</strong><small>1:{profile.nominal_ratio} · {profile.pulse_count} pulses</small></span>
                  <span className="profile-temps">{profile.bloom_temp_c}° → {profile.pulse_temps_c.at(-1)}°</span>
                  <ChevronRight size={17} />
                </button>
              ))}
            </div>
          </section>
        </>
      )}
      {message ? <div className="toast-line">{message}</div> : null}
      {editing ? (
        <div className="editor-drawer-backdrop">
          <div className="editor-drawer">
            <div className="drawer-header"><div><span>AIDEN PROFILE</span><h2>{editing.profile_name}</h2></div><button className="icon-button" onClick={() => setEditing(null)}><X size={20} /></button></div>
            <ProfileEditor value={editing} onChange={(profile) => setEditing({ ...profile, id: editing.id })} onSave={saveProfile} saving={saving} />
            {!editing.id.startsWith("new-") ? <button className="delete-profile-button" onClick={deleteProfile} disabled={saving}><Trash2 size={15} />Aiden에서 프로필 삭제</button> : null}
          </div>
        </div>
      ) : null}
    </main>
  );
}

function ConsoleView({ user, dashboard, loading, onRefresh }: { user: AuthUser; dashboard: Dashboard; loading: boolean; onRefresh: () => void }) {
  const [label, setLabel] = useState("Codex on Mac");
  const [newToken, setNewToken] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  async function createToken() {
    setBusy(true);
    try {
      const result = await callServer<{ label: string }, { token: string }>("createApiToken", { label });
      setNewToken(result.token);
      onRefresh();
    } finally {
      setBusy(false);
    }
  }

  async function revokeToken(id: string) {
    if (!window.confirm("이 토큰을 폐기할까요? 연결된 로컬 Codex는 즉시 동기화할 수 없게 됩니다.")) return;
    await callServer("revokeApiToken", { tokenId: id });
    onRefresh();
  }

  async function copyToken() {
    await navigator.clipboard.writeText(newToken);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <main className="private-main">
      <PrivateHeader eyebrow="WORKSPACE" title="Console" description="로컬 Codex 연결과 레시피 동기화 상태를 관리합니다." onRefresh={onRefresh} loading={loading} />
      <section className="account-grid">
        <div className="account-card"><CircleUserRound /><span>SIGNED IN AS</span><strong>{user.email}</strong></div>
        <div className="account-card"><Cloud /><span>PUBLIC RECIPES</span><strong>{dashboard.recipes.length}</strong></div>
        <div className="account-card"><Coffee /><span>AIDEN</span><strong>{dashboard.aiden.configured ? "CONNECTED" : "NOT SET"}</strong></div>
      </section>

      <section className="private-section token-section">
        <div className="private-section-title"><div><span>LOCAL ACCESS</span><h2>API tokens</h2></div><KeyRound size={22} /></div>
        <p className="section-intro">Codex가 이 계정의 레시피를 읽고 올릴 때 사용합니다. 토큰 원문은 발급 직후 한 번만 표시됩니다.</p>
        <div className="token-create"><input value={label} onChange={(event) => setLabel(event.target.value)} maxLength={40} /><button className="primary-button" onClick={createToken} disabled={busy || !label.trim()}>토큰 발급</button></div>
        {newToken ? (
          <div className="token-reveal"><div><ShieldCheck size={20} /><span><strong>지금 복사해 두세요.</strong><small>닫은 뒤에는 다시 볼 수 없습니다.</small></span></div><code>{newToken}</code><button className="secondary-button" onClick={copyToken}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? "복사됨" : "복사"}</button></div>
        ) : null}
        <div className="token-list">
          {dashboard.tokens.map((token) => (
            <div className="token-row" key={token.id}><KeyRound size={17} /><span><strong>{token.label}</strong><small>{token.prefix}•••• · {token.lastUsedAt ? `최근 사용 ${token.lastUsedAt}` : "사용 기록 없음"}</small></span><time>{token.createdAt}</time><button onClick={() => revokeToken(token.id)}>폐기</button></div>
          ))}
          {!dashboard.tokens.length ? <div className="empty-list compact">아직 발급한 토큰이 없습니다.</div> : null}
        </div>
      </section>

      <section className="private-section sync-section">
        <div className="private-section-title"><div><span>CONTENT</span><h2>내 레시피</h2></div><span className="count-pill">{dashboard.recipes.length}</span></div>
        <div className="profile-table">
          {dashboard.recipes.map((recipe) => (
            <div className="profile-table-row" key={recipe.id}><StatusBadge status={recipe.status} /><span><strong>{recipe.title}</strong><small>{recipe.sourcePath}</small></span><span className="profile-temps">{recipe.profile.profile_name}</span><ShieldCheck size={17} /></div>
          ))}
        </div>
      </section>
      <button className="logout-button" onClick={logout}><LogOut size={16} />로그아웃</button>
    </main>
  );
}

function PrivateHeader({ eyebrow, title, description, onRefresh, loading }: { eyebrow: string; title: string; description: string; onRefresh: () => void; loading: boolean }) {
  return <section className="private-header"><div><span className="overline">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div><button className="secondary-button" onClick={onRefresh} disabled={loading}><RefreshCw className={loading ? "spin" : ""} size={16} />새로고침</button></section>;
}

export default App;
