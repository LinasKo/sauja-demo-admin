import { st_authKey } from "$lib/stores";
import { redirect } from "@sveltejs/kit";
import { get } from "svelte/store";

export const load = async () => {
  if (!get(st_authKey)) {
    throw redirect(302, "/auth");
  }
};
