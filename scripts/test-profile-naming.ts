import assert from "node:assert/strict";
import { profileNameForRecipe as profileNameForBrowser, validateAidenProfile } from "../shared/aiden-profile";
import { profileNameForRecipe as profileNameForServer, validateProfile } from "../functions/src/aiden-profile";
import { buildCatalog } from "./catalog-lib";

const recipe = buildCatalog().recipes.find((item) => item.brewReady);
assert.ok(recipe);

const candidateName = profileNameForBrowser(recipe.profile.profile_name, "candidate");
const acceptedName = profileNameForBrowser(candidateName, "accepted");

assert.equal(candidateName.startsWith("[C] "), true);
assert.equal(acceptedName.startsWith("[A] "), true);
assert.equal(acceptedName.includes("[C]"), false);
assert.equal(profileNameForServer(recipe.profile.profile_name, "candidate"), candidateName);
assert.equal(profileNameForServer(candidateName, "accepted"), acceptedName);
assert.equal(profileNameForBrowser("x".repeat(80), "candidate").length, 50);

const prefixedProfile = { ...recipe.profile, profile_name: candidateName };
assert.deepEqual(validateAidenProfile(prefixedProfile), []);
assert.doesNotThrow(() => validateProfile(prefixedProfile));
assert.throws(() => validateProfile({ ...prefixedProfile, profile_name: "[X] invalid" }));

console.log("✓ Aiden recipe profile naming: [C] / [A] / replacement / 50-char limit");
