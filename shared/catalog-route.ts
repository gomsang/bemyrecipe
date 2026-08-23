export type RecipeDetailView = "brew" | "guide";

export type CatalogRoute = {
  recipeId: string;
  detailView: RecipeDetailView;
};

export function parseCatalogRoute(pathname: string): CatalogRoute | null {
  const match = pathname.match(/^\/recipes\/([^/]+)\/(brew|guide)\/?$/);
  if (!match) return null;
  try {
    return {
      recipeId: decodeURIComponent(match[1]),
      detailView: match[2] as RecipeDetailView,
    };
  } catch {
    return null;
  }
}

export function buildCatalogRoute(recipeId: string, detailView: RecipeDetailView): string {
  return `/recipes/${encodeURIComponent(recipeId)}/${detailView}`;
}

export function canonicalRecipeId(recipe: { id: string; localId?: string | null }): string {
  return recipe.localId?.trim() || recipe.id;
}
