'use client';

import { useEffect, useMemo, useState } from 'react';
import { calculateRecipe, codexPrompt, runHarness, suggestNextChange } from '@/lib/brew';
import type { AppData, Bean, Recipe, Tasting } from '@/lib/brew';

type View = 'today' | 'recipes' | 'beans' | 'guide';
type Scores = Pick<Tasting, 'acidity' | 'sweetness' | 'bitterness' | 'astringency' | 'body' | 'aroma' | 'overall'>;

const emptyScores: Scores = { acidity: 3, sweetness: 3, bitterness: 1, astringency: 1, body: 3, aroma: 3, overall: 3 };
const nav: { id: View; label: string; short: string }[] = [
  { id: 'today', label: '오늘의 레시피', short: '오늘' },
  { id: 'recipes', label: '레시피 보관함', short: '레시피' },
  { id: 'beans', label: '원두 & 컵', short: '보관함' },
  { id: 'guide', label: 'Harness 원칙', short: '원칙' },
];

const api = async (body?: unknown) => {
  const response = await fetch('/api/data', body ? { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) } : undefined);
  const json = await response.json();
  if (!response.ok) throw new Error(json.error || '요청을 처리하지 못했습니다.');
  return json;
};

const dateLabel = (iso: string) => new Intl.DateTimeFormat('ko-KR', { month: 'short', day: 'numeric' }).format(new Date(iso));
const styleLabel: Record<Recipe['beverageStyle'], string> = { flash: 'Flash brew', iced: 'Iced', hot: 'Hot', cold: 'Cold brew' };

function Rating({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <div className="rating-row">
      <span>{label}</span>
      <div className="score-buttons" aria-label={`${label} 점수`}>
        {[1, 2, 3, 4, 5].map((score) => <button type="button" className={value === score ? 'active' : ''} onClick={() => onChange(score)} key={score}>{score}</button>)}
      </div>
    </div>
  );
}

export default function BrewApp() {
  const [data, setData] = useState<AppData | null>(null);
  const [view, setView] = useState<View>('today');
  const [selectedId, setSelectedId] = useState('');
  const [modal, setModal] = useState<'tasting' | 'import' | 'profile' | null>(null);
  const [scores, setScores] = useState<Scores>(emptyScores);
  const [drawdown, setDrawdown] = useState<Tasting['drawdown']>('normal');
  const [iceRemaining, setIceRemaining] = useState(true);
  const [notes, setNotes] = useState('');
  const [finalWeight, setFinalWeight] = useState('');
  const [importText, setImportText] = useState('');
  const [toast, setToast] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const next = await api() as AppData;
      setData(next);
      setSelectedId((current) => current || next.recipes[0]?.id || '');
      setError('');
    } catch (cause) { setError(cause instanceof Error ? cause.message : '데이터를 불러오지 못했습니다.'); }
  };
  useEffect(() => { void load(); }, []);
  useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(''), 2600); return () => window.clearTimeout(timer); }, [toast]);

  const recipe = useMemo(() => data?.recipes.find((item) => item.id === selectedId) ?? data?.recipes[0], [data, selectedId]);
  const bean = data?.beans.find((item) => item.id === recipe?.beanId);
  const cup = data?.cups.find((item) => item.id === recipe?.cupId);
  const tastings = useMemo(() => data?.tastings.filter((item) => item.recipeId === recipe?.id) ?? [], [data, recipe]);
  const metrics = recipe ? calculateRecipe(recipe, cup) : null;
  const checks = recipe ? runHarness(recipe, cup) : [];
  const latestTasting = tastings[0];
  const suggestion = recipe && latestTasting ? suggestNextChange(recipe, latestTasting) : null;

  const showToast = (message: string) => { setToast(message); };
  const chooseRecipe = (id: string) => { setSelectedId(id); setView('today'); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const saveTasting = async () => {
    if (!recipe) return;
    setBusy(true);
    try {
      const tasting: Tasting = { id: crypto.randomUUID(), recipeId: recipe.id, brewedAt: new Date().toISOString(), ...scores,
        drawdown, iceRemaining, finalBeverageG: finalWeight ? Number(finalWeight) : null, notes, finish: null };
      await api({ action: 'addTasting', tasting });
      await load(); setModal(null); setNotes(''); setFinalWeight(''); setScores(emptyScores);
      showToast('추출 기록을 저장했습니다.');
    } catch (cause) { setError(cause instanceof Error ? cause.message : '저장하지 못했습니다.'); }
    finally { setBusy(false); }
  };

  const saveRevision = async () => {
    if (!recipe || !suggestion || suggestion.field === 'none') return;
    const revised: Recipe = { ...recipe, id: crypto.randomUUID(), parentId: recipe.id, version: recipe.version + 1,
      status: 'revision', createdAt: new Date().toISOString(), name: recipe.name.replace(/ · v\d+$/, '') + ` · v${recipe.version + 1}` };
    if (suggestion.field === 'lastPulseTemp') revised.pulseTempsC = recipe.pulseTempsC.map((temp, index) => index === recipe.pulseTempsC.length - 1 ? temp - 1 : temp);
    if (suggestion.field === 'brewIceG') revised.brewIceG = Math.max(0, recipe.brewIceG - 10);
    if (suggestion.field === 'servingIceG') revised.servingIceG = recipe.servingIceG + 10;
    if (suggestion.field === 'grindSetting') revised.grindSetting = `${recipe.grindSetting} · ${suggestion.label.includes('굵게') ? '굵게 1클릭' : '곱게 1클릭'}`;
    setBusy(true);
    try { await api({ action: 'createRecipe', recipe: revised }); await load(); setSelectedId(revised.id); showToast(`v${revised.version} 개선안을 저장했습니다.`); }
    catch (cause) { setError(cause instanceof Error ? cause.message : '개선안을 저장하지 못했습니다.'); }
    finally { setBusy(false); }
  };

  const copyCodex = async () => {
    if (!recipe || !bean || !cup) return;
    await navigator.clipboard.writeText(codexPrompt(recipe, bean, cup, tastings));
    showToast('Codex용 개선 프롬프트를 복사했습니다.');
  };

  const importRecipe = async () => {
    if (!data || !recipe) return;
    setBusy(true);
    try {
      const parsed = JSON.parse(importText) as { bean?: Partial<Bean>; recipe?: Partial<Recipe>; cupCapacityMl?: number };
      let beanId = parsed.recipe?.beanId || recipe.beanId;
      if (parsed.bean?.name) {
        const newBean: Bean = { id: crypto.randomUUID(), name: parsed.bean.name, origin: parsed.bean.origin || '미기록',
          process: parsed.bean.process || '미기록', roastLevel: parsed.bean.roastLevel || '미기록',
          tastingNotes: parsed.bean.tastingNotes || [], region: parsed.bean.region, farm: parsed.bean.farm,
          altitude: parsed.bean.altitude, variety: parsed.bean.variety, roastDate: parsed.bean.roastDate };
        await api({ action: 'createBean', bean: newBean }); beanId = newBean.id;
      }
      const resolvedCup = data.cups.find((item) => item.capacityMl === parsed.cupCapacityMl) || data.cups.find((item) => item.id === parsed.recipe?.cupId) || cup;
      if (!resolvedCup) throw new Error('사용할 컵을 찾지 못했습니다.');
      const incoming = parsed.recipe || parsed as Partial<Recipe>;
      const next: Recipe = { ...recipe, ...incoming, id: crypto.randomUUID(), parentId: null, beanId, cupId: resolvedCup.id,
        version: 1, status: 'baseline', createdAt: new Date().toISOString(), pulseTempsC: incoming.pulseTempsC || recipe.pulseTempsC };
      await api({ action: 'createRecipe', recipe: next }); await load(); setSelectedId(next.id); setModal(null); setImportText(''); setView('today');
      showToast('Codex 레시피를 보관함에 추가했습니다.');
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'JSON 형식을 확인해 주세요.'); }
    finally { setBusy(false); }
  };

  if (!data || !recipe || !bean || !cup || !metrics) return (
    <main className="loading-screen"><div className="brand-mark">O</div><p>{error || '나의 브루 로그를 준비하는 중…'}</p>{error && <button onClick={() => void load()}>다시 시도</button>}</main>
  );

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark">O</span><div><small>Aiden brew log</small><strong>oh my coffee</strong></div></div>
        <div className="header-actions"><button className="ghost-button hide-mobile" onClick={copyCodex}>Codex로 개선</button><button className="primary-button" onClick={() => setModal('import')}>+ 레시피 추가</button></div>
      </header>

      <div className="app-grid">
        <aside className="sidebar">
          <nav>{nav.map((item) => <button className={view === item.id ? 'active' : ''} onClick={() => setView(item.id)} key={item.id}><span>{item.label}</span>{item.id === 'recipes' && <em>{data.recipes.length}</em>}</button>)}</nav>
          <div className="sidebar-note"><small>Dial-in rule</small><p>한 번에 한 변수만.<br />맛의 변화를 레시피 이력으로 남깁니다.</p></div>
          <div className="firmware"><span className="status-dot" />Aiden 1.5.9 기준 확인</div>
        </aside>

        <section className="content">
          {view === 'today' && <>
            <div className="page-heading"><div><p>{dateLabel(recipe.createdAt)} · 다음 추출</p><h1>{recipe.name}</h1></div><span className="status-chip">v{recipe.version} · {recipe.status === 'baseline' ? '베이스라인' : '개선안'}</span></div>

            <div className="today-grid">
              <article className="recipe-hero">
                <div className="recipe-main">
                  <div className="bean-summary"><span>{bean.origin} · {bean.process}</span><h2>{bean.name}</h2><p>{bean.tastingNotes.join(' · ')}<br />{bean.roastLevel}</p>
                    <div className="big-numbers"><div><small>원두</small><strong>{recipe.doseG}g</strong></div><div><small>Aiden 물</small><strong>{recipe.brewWaterG}ml</strong></div><div><small>브루 얼음</small><strong>{recipe.brewIceG}g</strong></div><div><small>서빙 얼음</small><strong>{recipe.servingIceG}g</strong></div></div>
                  </div>
                  <div className="profile-panel"><div className="panel-title"><strong>온도 프로파일</strong><small>{recipe.grinder} · {recipe.grindSetting}</small></div>
                    <ol><li><i>1</i><span><strong>Bloom</strong><small>{recipe.bloomSeconds}초 · nominal 1:{recipe.bloomRatio}</small></span><b>{recipe.bloomTempC}°</b></li>
                      {recipe.pulseTempsC.map((temp, index) => <li key={index}><i>{index + 2}</i><span><strong>Pulse {index + 1}</strong><small>{recipe.pulseIntervalSeconds}초 간격</small></span><b>{temp}°</b></li>)}</ol>
                  </div>
                </div>
                <div className="recipe-footer"><span><strong>실제 hot 1:{metrics.actualHotRatio}</strong> · 전체 물 1:{metrics.totalRecipeRatio} · 예상 잔 무게 {metrics.finalLoadG}g</span><button onClick={() => setModal('profile')}>Aiden 설정 보기</button></div>
              </article>

              <aside className="harness-card"><div className="section-kicker">Harness check</div><h2>추출 전에 확인하세요</h2><div className="check-list">{checks.slice(0, 4).map((check) => <div className={`check ${check.tone}`} key={check.title}><span>{check.tone === 'good' ? '✓' : check.tone === 'danger' ? '!' : '△'}</span><div><strong>{check.title}</strong><p>{check.detail}</p></div></div>)}</div><button className="accent-button" onClick={() => setModal('tasting')}>이 레시피로 추출 기록</button></aside>
            </div>

            <section className="lower-grid">
              <article className="next-card"><div className="section-kicker">Next variable</div><h2>{suggestion?.label || '첫 잔을 기준으로 삼기'}</h2><p>{suggestion?.reason || '향미·질감·drawdown·얼음 잔존을 기록하면 다음 변경 하나를 추천합니다.'}</p><div className="inline-actions">{suggestion && suggestion.field !== 'none' && <button className="primary-button" disabled={busy} onClick={saveRevision}>개선안 v{recipe.version + 1} 저장</button>}<button className="ghost-button" onClick={copyCodex}>Codex 프롬프트 복사</button></div></article>
              <article className="history-card"><div className="section-kicker">Recent tasting</div>{latestTasting ? <><div className="taste-score"><strong>{latestTasting.overall}.0</strong><span>overall<br />{dateLabel(latestTasting.brewedAt)}</span></div><p>{latestTasting.notes || '메모 없이 점수만 기록됨'}</p><div className="mini-scores"><span>단맛 {latestTasting.sweetness}</span><span>산미 {latestTasting.acidity}</span><span>떫음 {latestTasting.astringency}</span></div></> : <div className="empty-state"><strong>아직 시음 기록이 없습니다.</strong><p>첫 잔은 성공/실패가 아니라 비교 기준입니다.</p></div>}</article>
            </section>
          </>}

          {view === 'recipes' && <RecipeLibrary data={data} selectedId={recipe.id} onChoose={chooseRecipe} />}
          {view === 'beans' && <BeanLibrary data={data} />}
          {view === 'guide' && <Guide />}
        </section>
      </div>

      <nav className="mobile-nav">{nav.map((item) => <button className={view === item.id ? 'active' : ''} onClick={() => setView(item.id)} key={item.id}>{item.short}</button>)}</nav>
      {toast && <div className="toast" role="status">{toast}</div>}
      {error && <div className="error-banner" role="alert">{error}<button onClick={() => setError('')}>닫기</button></div>}

      {modal === 'tasting' && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setModal(null)}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="tasting-title"><button className="modal-close" onClick={() => setModal(null)} aria-label="닫기">×</button><div className="section-kicker">Brew log</div><h2 id="tasting-title">이번 잔은 어땠나요?</h2><p className="modal-lead">절대 점수보다 지난 잔과의 차이가 중요합니다.</p><div className="ratings">{(Object.keys(scores) as (keyof Scores)[]).map((key) => <Rating key={key} label={{ acidity: '산미', sweetness: '단맛', bitterness: '쓴맛', astringency: '떫음', body: '바디', aroma: '향', overall: '종합' }[key]} value={scores[key]} onChange={(value) => setScores({ ...scores, [key]: value })} />)}</div>
        <div className="form-grid"><label>Drawdown<select value={drawdown} onChange={(event) => setDrawdown(event.target.value as Tasting['drawdown'])}><option value="fast">빠름</option><option value="normal">보통</option><option value="slow">느림</option></select></label><label>최종 음료 무게 (g)<input inputMode="decimal" value={finalWeight} onChange={(event) => setFinalWeight(event.target.value)} placeholder="선택" /></label></div>
        <label className="check-control"><input type="checkbox" checked={iceRemaining} onChange={(event) => setIceRemaining(event.target.checked)} /> 다 마실 때까지 얼음이 남았어요</label><label className="field">메모<textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="예: 베르가못 향은 좋았지만 끝이 조금 마름" /></label><button className="accent-button full" disabled={busy} onClick={saveTasting}>{busy ? '저장 중…' : '기록하고 다음 변수 찾기'}</button></section></div>}

      {modal === 'import' && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setModal(null)}><section className="modal import-modal" role="dialog" aria-modal="true" aria-labelledby="import-title"><button className="modal-close" onClick={() => setModal(null)} aria-label="닫기">×</button><div className="section-kicker">Codex → Database</div><h2 id="import-title">생성한 레시피 가져오기</h2><p className="modal-lead">Codex가 만든 JSON을 붙여 넣습니다. 새 원두 정보가 포함되면 원두 보관함에도 함께 저장됩니다.</p><label className="field">Recipe JSON<textarea className="code-input" value={importText} onChange={(event) => setImportText(event.target.value)} placeholder={'{\n  "bean": { "name": "...", "origin": "...", "process": "...", "roastLevel": "...", "tastingNotes": ["..."] },\n  "cupCapacityMl": 315,\n  "recipe": { "name": "...", "doseG": 20, "brewWaterG": 225, "brewIceG": 90, "servingIceG": 20, "nominalRatio": 14, "pulseTempsC": [96,95,94] }\n}'} /></label><div className="import-help"><strong>필수 확인</strong><span>doseG · brewWaterG · nominalRatio · bloomRatio · pulseTempsC</span></div><button className="primary-button full" disabled={busy || !importText.trim()} onClick={importRecipe}>{busy ? '가져오는 중…' : '검사하고 보관함에 추가'}</button></section></div>}

      {modal === 'profile' && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setModal(null)}><section className="modal profile-modal" role="dialog" aria-modal="true" aria-labelledby="profile-title"><button className="modal-close" onClick={() => setModal(null)} aria-label="닫기">×</button><div className="section-kicker">Machine input</div><h2 id="profile-title">Aiden 입력 순서</h2><ol className="machine-steps"><li><span>01</span><div><small>Profile ratio</small><strong>1:{recipe.nominalRatio}</strong><p>화면 안내 원두량 {metrics.machineDoseG}g — 실제로는 {recipe.doseG}g 투입</p></div></li><li><span>02</span><div><small>Bloom</small><strong>1:{recipe.bloomRatio} · {recipe.bloomSeconds}초 · {recipe.bloomTempC}°C</strong><p>실제 dose 기준 물 {metrics.actualBloomWaterG}g, 약 1:{metrics.actualBloomRatio}</p></div></li><li><span>03</span><div><small>Single serve pulses</small><strong>{recipe.pulseCount}회 · {recipe.pulseIntervalSeconds}초</strong><p>{recipe.pulseTempsC.join(' → ')}°C</p></div></li><li><span>04</span><div><small>Before brew</small><strong>{recipe.brewIceG}g + 서빙 {recipe.servingIceG}g</strong><p>완료 후 반드시 swirl, 첫 잔은 낙하 온도와 최종 무게 기록</p></div></li></ol><button className="accent-button full" onClick={() => { setModal('tasting'); }}>추출 후 기록하기</button></section></div>}
    </main>
  );
}

function RecipeLibrary({ data, selectedId, onChoose }: { data: AppData; selectedId: string; onChoose: (id: string) => void }) {
  return <><div className="page-heading"><div><p>Recipe database</p><h1>레시피 보관함</h1></div><span className="status-chip">{data.recipes.length}개</span></div><div className="library-grid">{data.recipes.map((recipe) => { const bean = data.beans.find((item) => item.id === recipe.beanId); const cup = data.cups.find((item) => item.id === recipe.cupId); const taste = data.tastings.find((item) => item.recipeId === recipe.id); return <button className={`library-card ${selectedId === recipe.id ? 'selected' : ''}`} key={recipe.id} onClick={() => onChoose(recipe.id)}><div className="card-top"><span>{styleLabel[recipe.beverageStyle]}</span><em>v{recipe.version}</em></div><h2>{recipe.name}</h2><p>{bean?.name}</p><div className="recipe-stats"><span>{recipe.doseG}g</span><span>{recipe.brewWaterG}ml</span><span>{cup?.capacityMl}ml cup</span></div><div className="card-bottom"><span>{recipe.pulseTempsC.join('→')}°</span><strong>{taste ? `${taste.overall}.0 / 5` : '미평가'}</strong></div></button>; })}</div></>;
}

function BeanLibrary({ data }: { data: AppData }) {
  return <><div className="page-heading"><div><p>Personal setup</p><h1>원두 & 컵</h1></div></div><h2 className="subheading">원두</h2><div className="bean-grid">{data.beans.map((bean) => <article className="bean-card" key={bean.id}><span>{bean.origin} · {bean.process}</span><h2>{bean.name}</h2><p>{bean.region}<br />{bean.altitude} · {bean.variety}</p><div>{bean.tastingNotes.map((note) => <em key={note}>{note}</em>)}</div><small>{bean.roastLevel}</small></article>)}</div><h2 className="subheading cups-title">음용 컵</h2><div className="cup-grid">{data.cups.map((cup) => <article className="cup-card" key={cup.id}><div className={`cup-shape ${cup.kind}`}><span /></div><div><strong>{cup.name}</strong><p>{cup.notes}</p></div><b>{cup.capacityMl}<small>ml</small></b></article>)}</div></>;
}

function Guide() {
  return <><div className="page-heading"><div><p>Evidence & decisions</p><h1>Harness 원칙</h1></div><span className="status-chip">검증일 2026-08-23</span></div><div className="principle-grid"><article><span>01</span><h2>기기값 ≠ 실제값</h2><p>Aiden의 비율은 안내 dose와 bloom 계산에 쓰입니다. 실제 원두량을 바꾸면 hot ratio와 실제 bloom을 다시 계산합니다.</p></article><article><span>02</span><h2>목표 맛이 먼저</h2><p>온도 자체가 맛을 정한다는 단순 규칙보다, 최종 농도·추출·감각 평가를 우선합니다.</p></article><article><span>03</span><h2>한 번에 한 변수</h2><p>떫음·느린 drawdown은 분쇄도부터, 후미의 쓴맛은 마지막 pulse부터 조정합니다.</p></article><article><span>04</span><h2>아이스도 열수지</h2><p>브루 얼음과 서빙 얼음을 분리하고 컵 용량, 낙하 온도, 실제 얼음 잔존을 함께 기록합니다.</p></article></div><section className="sources"><div className="section-kicker">Research basis</div><h2>문서보다 현재 근거를 우선했습니다</h2><p>첨부한 Aiden.md는 가설과 입력 자료로만 사용했습니다. 공식 자료 → 측정 리뷰 → 커뮤니티 경험 순서로 교차검증하며, 커뮤니티 수치는 경고/실험 아이디어로만 씁니다.</p><div className="source-links"><a href="https://fellowproducts.com/products/aiden-precision-coffee-maker" target="_blank" rel="noreferrer"><strong>Fellow 공식 제품/프로파일</strong><span>온도·pulse·용량·basket</span></a><a href="https://help.fellowproducts.com/hc/en-us/articles/29101533994267-How-should-I-dial-in-my-grinder-when-brewing-with-Aiden-Getting-Started-With-Aiden-Pt-3" target="_blank" rel="noreferrer"><strong>Fellow Grinder Guide</strong><span>Ode Gen 2 출발점</span></a><a href="https://sca.coffee/sca-news/read/just-published-brewing-temperature-and-the-sensory-profile-of-brewed-coffee-37dt6" target="_blank" rel="noreferrer"><strong>SCA / UC Davis 연구</strong><span>온도, 농도, 추출의 관계</span></a><a href="https://coffeechronicler.com/fellow-aiden-review/" target="_blank" rel="noreferrer"><strong>Coffee Chronicler 측정 리뷰</strong><span>온도 정확도·추출·카라페</span></a><a href="https://www.reddit.com/r/FellowProducts/comments/1j5d40m/aiden_iced_coffee_profile/" target="_blank" rel="noreferrer"><strong>Aiden 커뮤니티</strong><span>Flash brew 경험값 — 낮은 신뢰도</span></a></div></section></>;
}
