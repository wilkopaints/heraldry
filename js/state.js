// URL hash state encoding/decoding

// Encode current control state to URL hash
// Format: shape-col1-col2-device-count-layout-chargeCols
// Example: chief-d4af34-790000-12-3-d-d4af34-790000
function encodeState() {
  const shape = document.getElementById("ctrl-shape").value;
  const col1 = document.getElementById("ctrl-col1").value.slice(1);
  const col2 = document.getElementById("ctrl-col2").value.slice(1);
  const device = document.getElementById("ctrl-device").value;
  const count = document.getElementById("ctrl-count").value;
  const layout =
    document.getElementById("ctrl-layout").value === "division" ? "d" : "s";

  // Get device index
  const devices = getAllDevices();
  const deviceIdx = devices.indexOf(device);

  // Get charge colours
  const chargeCols = [];
  for (let i = 0; i < parseInt(count); i++) {
    const sel = document.getElementById(`charge-col-${i}`);
    if (sel) chargeCols.push(sel.value.slice(1));
  }

  const parts = [shape, col1, col2, deviceIdx, count, layout];
  if (chargeCols.length > 0) parts.push(chargeCols.join("."));
  return parts.join("-");
}

// Decode state from URL hash
function decodeState(hash) {
  const parts = hash.split("-");
  if (parts.length < 6) return null;

  const [shape, col1, col2, deviceIdx, count, layout, ...rest] = parts;
  const devices = getAllDevices();
  const device = devices[parseInt(deviceIdx)] || devices[0];
  const chargeCols = rest.length > 0 ? rest.join("-").split(".") : [];

  return {
    shape,
    col1,
    col2,
    device,
    count,
    layout: layout === "d" ? "division" : "standard",
    chargeCols,
  };
}

// Update URL hash with current state
function updateHashFromControls() {
  const hash = encodeState();
  history.replaceState(null, "", "#" + hash);
}
