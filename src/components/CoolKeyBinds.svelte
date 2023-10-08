<script>
  import { onMount } from "svelte";
  import keybinds from "../lib/keybinds";
  let count = 0;

  let obj = {
    up: 0,
    down: 0,
    left: 0,
    right: 0,
  };

  onMount(() => {
    keybinds.setFunction("add", () => (count += 1));
    keybinds.setFunction("sub", () => (count -= 1));
    keybinds.setFunction("reset", () => (count = 0));

    keybinds.setFunction("up", () => (obj.up += 1));
    keybinds.setFunction("down", () => (obj.down += 1));
    keybinds.setFunction("left", () => (obj.left += 1));
    keybinds.setFunction("right", () => (obj.right += 1));

    keybinds.start();
  });
</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<div id="form" tabindex="0">
  <p>{count}</p>
  <p>{JSON.stringify(obj)}</p>
  <input placeholder="focus" />
</div>
