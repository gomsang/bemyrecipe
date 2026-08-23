import { getAppData, insertBean, insertRecipe, insertTasting } from '@/db/store';
import type { Bean, Recipe, Tasting } from '@/lib/brew';

export async function GET() {
  try { return Response.json(await getAppData()); }
  catch (error) { return Response.json({ error: error instanceof Error ? error.message : '데이터를 불러오지 못했습니다.' }, { status: 500 }); }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { action?: string; bean?: Bean; recipe?: Recipe; tasting?: Tasting };
    if (body.action === 'createBean' && body.bean) return Response.json(await insertBean(body.bean), { status: 201 });
    if (body.action === 'createRecipe' && body.recipe) return Response.json(await insertRecipe(body.recipe), { status: 201 });
    if (body.action === 'addTasting' && body.tasting) return Response.json(await insertTasting(body.tasting), { status: 201 });
    return Response.json({ error: '지원하지 않는 요청입니다.' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : '저장하지 못했습니다.' }, { status: 500 });
  }
}
