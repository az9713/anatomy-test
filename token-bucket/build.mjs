// Token bucket rate limiter as a token dispenser. node build.mjs [--light]
import { writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import assert from "node:assert/strict";

const SKILL = join(homedir(), ".claude", "skills", "anatomy");
const k = await import(pathToFileURL(join(SKILL, "kit", "iso-kit.mjs")));
const { kitScript } = await import(pathToFileURL(join(SKILL, "scripts", "inline-kit.mjs")));

const HERE = dirname(fileURLToPath(import.meta.url));
const theme = process.argv.includes("--dark") ? "dark" : "light";

// The model: the page runs this same text.
const MODEL = `
const CAP = 20, RATE = 5;
function refill(b, dt) { const add = Math.min(CAP - b.tokens, RATE * dt); b.tokens += add; b.fed += add; }
function request(b) { if (b.tokens >= 1) { b.tokens -= 1; b.ok++; return true; } b.no++; return false; }
`;
{
  const { refill, request } = new Function(MODEL + "return { refill, request };")();
  const b = { tokens: 20, fed: 0, ok: 0, no: 0 };
  for (let i = 0; i < 25; i++) request(b);
  assert.deepEqual([b.tokens, b.ok, b.no], [0, 20, 5]);
  for (let i = 0; i < 60; i++) refill(b, 1 / 60);
  assert.ok(Math.abs(b.tokens - 5) < 1e-9, "5 tokens after 1 s");
  refill(b, 10);
  assert.equal(b.tokens, 20, "capped at 20");
  assert.ok(Math.abs(b.fed - 20) < 1e-9, "feeder stops when full");
}

const WIDTH = 600;
const HEIGHT = 400;

const PLATE = { x: -136, y: -60, w: 206, d: 100, r: 8 };
const PLATE_H = 12;
const FOOT_H = 5;

const CX = -30; // column centre, y = 0
const BED = { x: -122, y: -15, w: 178, d: 30, r: 3 };
const BED_H = 12;
const RAIL_H = 2.4;
const TOKEN_R = 7;
const PITCH = 2.2;
const CAP = 20;
const POST_TOP = 62;
const POSTS = [[CX - 9.5, -12.6], [CX + 9.5, -12.6], [CX - 9.5, 12.6], [CX + 9.5, 12.6]];
const BRIDGE = { x: CX - 14, y: -56, w: 28, d: 70.5, r: 3 };
const BRIDGE_TOP = POST_TOP + 3.5;
const PILLAR = [CX, -52];
const FEED = [CX, -16];
const FEED_R = 25;
const ORBIT = 16;
const DISC_Z = BRIDGE_TOP + 1;
const DISC_TOP = DISC_Z + 3.5;
const HUB_TOP = DISC_TOP + 3;
const BIN = { x: CX - 11, y: -42, w: 22, d: 19, r: 1.5 };
const BIN_Z = DISC_TOP + 3;
const BIN_TOP = 90;
const SOLENOID = { x: -120, y: -8, w: 16, d: 16, r: 1.5 };
const HANDLE = [-80, 0];
const PUSHER = { x: -84, y: -7, w: 42, d: 14, r: 1.5 };
const STROKE = 20;
const SPRING_Z = 20;
const SLOT = { x: 28, y: -7.4, w: 16, d: 14.8, r: 4 };
const SLOT_X = 36;
const FLAG = [CX + 20, -12.8];
const FLAG_RISE = 16;

const P = k.fitProjection(
  [...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0), ...k.boxCorners(BIN, BIN_TOP, BIN_TOP), [PILLAR[0], PILLAR[1], BIN_TOP + 2]],
  WIDTH,
  HEIGHT,
  { pad: 26, azimuth: 58 },
);

const at = (point) => k.iso(point, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const byDepth = (points) => [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));
const face = (points) => k.pathOf(points.map(at), true);

function base() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 22))) {
    out.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: "mid" }));
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
  const screws = k.corners(PLATE, 10);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  // ruler strip along the front edge: one major tick per second of refill (5 tokens)
  const strip = { x: -128, y: PLATE.y + PLATE.d - 15, w: 150, d: 7, r: 1 };
  out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
  const ticks = k.topTicks(strip.x + 4, strip.x + strip.w - 4, 4, 5, strip.y + 0.8, 0.6, [2, 3.6], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  out.push(D([at([strip.x + 2, strip.y + 3.5, 0.6]), at([strip.x + strip.w - 2, strip.y + 3.5, 0.6])], { size: 0.45 }));
  // label plate
  const label = { x: 30, y: 22, w: 32, d: 12, r: 1.2 };
  out.push(S(k.slabOf(label, 0, 0.8, P, 4), { tone: "lo", crease: "none" }));
  out.push(L(k.planOutline(k.insetPlan(label, 1.6), 0.8, P, 4), { tone: "faint" }));
  [[4, 18], [7, 12], [10, 15]].forEach(([dy, w]) => out.push(L(k.lineOnTop([label.x + 6, label.y + dy], [label.x + 6 + w, label.y + dy], 0.8, P), { tone: "lo", free: true })));
  out.push(D([at([label.x + label.w - 3.5, label.y + 3.5, 0.8]), at([label.x + label.w - 3.5, label.y + label.d - 3.5, 0.8])], { size: 0.45 }));
  return out.join("");
}

function pillarLow() {
  const [x, y] = PILLAR;
  return [
    S(k.cylinder(x, y, 5, 0, 3, P, 28), { tone: "mid" }),
    S(k.cylinder(x, y, 3.2, 3, POST_TOP - 3, P, 28), { tone: "mid", crease: "none" }),
    L([20, 40].map((z) => k.sideArc(x, y, 3.2, z, P, 16)).join(""), { tone: "faint" }),
  ].join("");
}

function bed() {
  const out = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(BED, 2), 0, 0.1, P)}" style="filter:blur(3px)"/>`];
  out.push(S(k.slabOf(BED, 0, BED_H, P, 6, 1), { tone: "mid", inner: L(k.sideSeam(BED, 4, P, 6), { tone: "faint" }) }));
  out.push(D(k.corners(BED, 4).map(([x, y]) => at([x, y, BED_H])), { size: 0.5 }));
  // exit slot into the spent-token drawer
  out.push(S(k.slabOf(SLOT, BED_H, 0.05, P, 6), { tone: "lo", flat: true }));
  out.push(L(k.planOutline(k.insetPlan(SLOT, -1), BED_H, P, 6), { tone: "faint" }));
  // drawer on the front face
  const drawer = { x: 22, y: BED.y + BED.d, w: 28, d: 1.2, r: 0.4 };
  out.push(S(k.slabOf(drawer, 2.4, 7.2, P, 2, 0.3), { tone: "mid" }));
  const fy = drawer.y + drawer.d;
  out.push(L(face([[drawer.x + 3, fy, 8], [drawer.x + 11, fy, 8], [drawer.x + 11, fy, 4.4], [drawer.x + 3, fy, 4.4]]), { tone: "lo" }));
  out.push(D([at([drawer.x + 2, fy, 6.2]), at([drawer.x + 12, fy, 6.2])], { size: 0.4 }));
  for (const px of [drawer.x + 16, drawer.x + 24]) out.push(S(k.slabOf({ x: px, y: fy, w: 1.6, d: 2.4, r: 0.4 }, 5, 2, P, 2), { tone: "mid", crease: "none" }));
  out.push(S(k.slabOf({ x: drawer.x + 15.6, y: fy + 2.4, w: 10.4, d: 1.4, r: 0.6 }, 5, 2, P, 3), { tone: "mid" }));
  return out.join("");
}

const rail = (x0, x1, y) => S(k.slabOf({ x: x0, y, w: x1 - x0, d: 2.6, r: 0.8 }, BED_H, RAIL_H, P, 3, 0.4), { tone: "mid" });
const railScrews = (x0, x1, y) => D([x0 + 3, x1 - 3].map((x) => at([x, y + 1.3, BED_H + RAIL_H])), { size: 0.4 });

function rails(y) {
  return [rail(-104, CX - 11, y), railScrews(-104, CX - 11, y), rail(CX + 11, 50, y), railScrews(CX + 11, 50, y)].join("");
}

function endStop() {
  const plan = { x: 50, y: -11, w: 3.4, d: 22, r: 0.8 };
  return S(k.slabOf(plan, BED_H, 4, P, 3, 0.4), { tone: "mid" }) + D([at([51.7, -7, BED_H + 4]), at([51.7, 7, BED_H + 4])], { size: 0.45 });
}

function post([x, y]) {
  return [
    S(k.cylinder(x, y, 2.4, BED_H, 2, P, 20), { tone: "mid" }),
    S(k.cylinder(x, y, 1.5, BED_H + 2, POST_TOP - BED_H - 2, P, 20), { tone: "mid", crease: "none" }),
  ].join("");
}

function solenoid() {
  const out = [];
  out.push(S(k.slabOf(SOLENOID, BED_H, 14, P, 4, 0.6), { tone: "mid", inner: L(k.sideSeam(SOLENOID, BED_H + 4, P, 4) + k.sideSeam(SOLENOID, BED_H + 10, P, 4), { tone: "faint" }) }));
  const top = BED_H + 14;
  for (const y of [-4, 4]) {
    out.push(S(k.cylinder(SOLENOID.x + 5, y, 1.6, top, 2.2, P, 16), { tone: "mid" }));
    out.push(D([at([SOLENOID.x + 5, y, top + 2.2])], { size: 0.45, tone: "hi" }));
  }
  out.push(D([at([SOLENOID.x + 12, -5.5, top]), at([SOLENOID.x + 12, 5.5, top])], { size: 0.45 }));
  out.push(L(k.sideRing([SOLENOID.x + SOLENOID.w, 0, SPRING_Z], 3.6, "x", P), { tone: "lo" }));
  return out.join("");
}

function pusher() {
  const out = [];
  out.push(S(k.slabOf(PUSHER, BED_H, PITCH, P, 3, 0.4), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan({ ...PUSHER, x: PUSHER.x + 8, w: PUSHER.w - 10 }, 3), BED_H + PITCH, P, 3), { tone: "faint" }));
  const [hx, hy] = HANDLE;
  out.push(S(k.cylinder(hx, hy, 3.2, BED_H + PITCH, 26 - BED_H - PITCH, P, 24), { tone: "mid", crease: "none" }));
  out.push(L(k.sideArc(hx, hy, 3.2, SPRING_Z, P, 16), { tone: "faint" }));
  out.push(S(k.cylinder(hx, hy, 4.6, 26, 4, P, 32), { tone: "mid" }));
  out.push(L(k.knurl(hx, hy, 4.6, 26, 30, 30, P), { tone: "lo" }));
  out.push(L(k.ring(hx, hy, 1.4, 30, P, 16), { tone: "mid" }));
  return out.join("");
}

const tokenSvg = (z) =>
  S(k.cylinder(CX, 0, TOKEN_R, z, PITCH, P, 48, 0.4), { tone: "hi", crease: "lo", inner: "" }) + L(k.ring(CX, 0, TOKEN_R - 2, z + PITCH, P, 32), { tone: "faint" });

function ruler() {
  const plan = { x: CX - 22, y: 11.6, w: 7, d: 1.8, r: 0.4 };
  const top = BED_H + CAP * PITCH + 2;
  const fy = plan.y + plan.d;
  const edge = plan.x + plan.w;
  const minor = [];
  const major = [];
  for (let i = 1; i <= CAP; i++) {
    const z = BED_H + i * PITCH;
    (i % 5 === 0 ? major : minor).push(k.segment([edge, fy, z], [edge - (i % 5 === 0 ? 3.4 : 1.8), fy, z], P));
  }
  return [
    S(k.slabOf(plan, BED_H, top - BED_H, P, 2, 0.3), { tone: "mid" }),
    L(minor.join(""), { tone: "lo" }),
    L(major.join(""), { tone: "mid" }),
    D([at([plan.x + 2, fy, top - 1.6])], { size: 0.45 }),
  ].join("");
}

function flagStatic() {
  const [x, y] = FLAG;
  return [S(k.cylinder(x, y, 2.4, BED_H, 1.6, P, 20), { tone: "mid" }), S(k.cylinder(x, y, 1.2, BED_H + 1.6, 40 - BED_H - 1.6, P, 16), { tone: "mid", crease: "none" }), S(k.cylinder(x, y, 2, 40, 2, P, 20), { tone: "mid" })].join("");
}

function flagMoving(lit) {
  const [x, y] = FLAG;
  const z0 = 16;
  return [
    S(k.cylinder(x, y, 2, z0 - 1, 9, P, 20), { tone: "mid", lit }),
    L(k.ring(x, y, 1.2, z0 + 8, P, 16), { tone: "lo" }),
    S(k.slabOf({ x: x + 1.6, y: y - 0.5, w: 11, d: 1, r: 0.3 }, z0, 7, P, 2), { tone: lit ? "hi" : "mid", lit }),
  ].join("");
}

function bridge() {
  const out = [];
  out.push(S(k.slabOf(BRIDGE, POST_TOP, BRIDGE_TOP - POST_TOP, P, 4, 0.6), { tone: "mid" }));
  out.push(L(POSTS.map(([x, y]) => k.ring(x, y, 2, BRIDGE_TOP, P, 16)).join(""), { tone: "lo" }));
  out.push(D(POSTS.map(([x, y]) => at([x, y, BRIDGE_TOP])), { size: 0.45 }));
  return out.join("");
}

function pillarHigh() {
  const [x, y] = PILLAR;
  return [
    S(k.cylinder(x, y, 4.4, BRIDGE_TOP, 2, P, 28), { tone: "mid" }),
    S(k.cylinder(x, y, 3.2, BRIDGE_TOP + 2, BIN_TOP + 2 - BRIDGE_TOP - 2, P, 28), { tone: "mid", crease: "none" }),
    S(k.cylinder(x, y, 3.8, BIN_TOP + 2, 1.4, P, 28), { tone: "mid" }),
  ].join("");
}

function disc() {
  const [x, y] = FEED;
  return [
    S(k.cylinder(x, y, 8, BRIDGE_TOP, 1, P, 32), { tone: "mid" }),
    S(k.cylinder(x, y, FEED_R, DISC_Z, DISC_TOP - DISC_Z, P, 72, 0.6), { tone: "mid", crease: "lo" }),
    L(k.knurl(x, y, FEED_R, DISC_Z + 0.6, DISC_TOP - 0.6, 90, P, 0.3), { tone: "faint" }),
    L(k.ring(x, y, FEED_R - 2, DISC_TOP, P, 72), { tone: "faint" }),
  ].join("");
}

function hopper() {
  const out = [];
  out.push(S(k.slabOf({ x: CX - 3, y: -49.2, w: 6, d: 7.4, r: 0.6 }, BIN_TOP - 8, 8, P, 2, 0.3), { tone: "mid" }));
  out.push(S(k.slabOf(BIN, BIN_Z, BIN_TOP - BIN_Z, P, 4, 0.8), { tone: "mid", inner: L(k.sideSeam(BIN, BIN_Z + 4, P, 4), { tone: "faint" }) }));
  out.push(S(k.slabOf(k.insetPlan(BIN, 1.4), BIN_TOP, 0.05, P, 4), { tone: "lo", flat: true }));
  out.push(D(k.corners(BIN, 0.7).map(([x, y]) => at([x, y, BIN_TOP])), { size: 0.4 }));
  return out.join("");
}

function hub() {
  const [x, y] = FEED;
  return [S(k.cylinder(x, y, 5, DISC_TOP, 3, P, 32), { tone: "mid" }), L(k.knurl(x, y, 5, DISC_TOP, HUB_TOP, 24, P), { tone: "lo" })].join("");
}

const BOTTOM = BED_H;
const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label:
    "A token dispenser on a base plate. A column holds up to 20 tokens. A feeder plate above it turns once a second and drops one token from each of its five pockets, 5 tokens a second, and stops when the column is full. Each request drives a pusher that takes the bottom token out to a drawer; when the column is empty a flag goes up and the request is rejected.",
  body: [
    base(),
    pillarLow(),
    bed(),
    rails(-11),
    post(POSTS[0]),
    post(POSTS[1]),
    flagStatic(),
    `<g data-part="flag" transform="${k.translateAlong(P, [0, 0, 0])}">${flagMoving(false)}<g data-part="flag-lit" opacity="0">${flagMoving(true)}</g></g>`,
    solenoid(),
    `<path data-part="coil-back" class="iso-line" data-tone="lo" d=""/>`,
    `<g data-part="pusher">${pusher()}</g>`,
    `<path data-part="coil-front" class="iso-line" data-tone="mid" d=""/>`,
    `<g data-part="stack">${Array.from({ length: CAP }, (_, i) => `<g data-slot="${i}">${tokenSvg(BOTTOM + i * PITCH)}</g>`).join("")}</g>`,
    `<g data-part="falling" style="display:none">${tokenSvg(BOTTOM)}</g>`,
    `<g data-part="flyers">${Array.from({ length: 12 }, () => `<g style="display:none">${tokenSvg(BOTTOM)}</g>`).join("")}</g>`,
    rails(8.4),
    endStop(),
    ruler(),
    post(POSTS[2]),
    post(POSTS[3]),
    bridge(),
    pillarHigh(),
    disc(),
    `<g data-part="pockets"></g>`,
    hopper(),
    hub(),
    `<path data-part="pointer" class="iso-line" data-tone="hi" data-free="end" d="" style="stroke-width:0.9"/>`,
    D([at([FEED[0], FEED[1], HUB_TOP])], { size: 0.55, tone: "hi" }),
  ],
});

const live = `
${MODEL}
const P = ${JSON.stringify(P)};
const CX = ${CX}, PITCH = ${PITCH}, BOTTOM = ${BOTTOM}, DROP_FROM = ${POST_TOP - PITCH}, STROKE = ${STROKE}, SLOT_X = ${SLOT_X};
const FEED = ${JSON.stringify(FEED)}, ORBIT = ${ORBIT}, DISC_TOP = ${DISC_TOP}, HUB_TOP = ${HUB_TOP}, TOKEN_R = ${TOKEN_R};
const SPRING_FROM = ${SOLENOID.x + SOLENOID.w}, SPRING_TO = ${HANDLE[0] - 3.2}, SPRING_Z = ${SPRING_Z}, FLAG_RISE = ${FLAG_RISE};
const MAX_RATE = 15;
const stage = document.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const $ = (name) => svg.querySelector('[data-part="' + name + '"]');
const slots = [...svg.querySelectorAll("[data-slot]")];
const stack = $("stack"), falling = $("falling"), flyers = [...$("flyers").children], pusherEl = $("pusher");
const coilBack = $("coil-back"), coilFront = $("coil-front"), pockets = $("pockets"), pointer = $("pointer");
const flag = $("flag"), flagLit = $("flag-lit");
const readout = document.querySelector("[data-readout]");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const b = { tokens: CAP, fed: 0, ok: 0, no: 0 };
let rate = 0, reqAcc = 0, clock = 0, touring = !still.matches, tourClock = 0, idleTimer = 0;
let fall = null, drop = 0, pulse = 0, push = 0, rejectAt = -9, flagUp = 0;
const flying = [];
const TOUR = [[2, 4], [12, 4], [0, 3], [7, 4]];
const tourRate = (t) => { let s = t % TOUR.reduce((sum, [, d]) => sum + d, 0); for (const [r, d] of TOUR) { if (s < d) return r; s -= d; } return 0; };
const ease = (t) => 1 - Math.pow(1 - t, 3);

function fire() {
  pulse = 1;
  if (request(b)) {
    drop = PITCH;
    let el = flyers.find((f) => !flying.some((x) => x.el === f));
    if (!el) { const old = flying.shift(); el = old.el; }
    flying.push({ el, t: still.matches ? 9 : 0 });
  } else {
    rejectAt = clock;
  }
}

function pocketsAt(theta) {
  let d = "", loaded = "";
  for (let i = 0; i < 5; i++) {
    const phi = theta + i * Math.PI * 2 / 5;
    const x = FEED[0] + ORBIT * Math.sin(phi), y = FEED[1] + ORBIT * Math.cos(phi);
    d += ring(x, y, TOKEN_R + 0.4, DISC_TOP, P, 32);
    const m = ((phi % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    if (m >= Math.PI) loaded += ring(x, y, TOKEN_R - 0.6, DISC_TOP, P, 32) + ring(x, y, TOKEN_R - 2.6, DISC_TOP, P, 24);
  }
  return '<path class="iso-line" data-tone="lo" d="' + d + '"/><path class="iso-line" data-tone="mid" d="' + loaded + '"/>';
}

function draw() {
  const resting = Math.max(0, Math.floor(b.tokens + 1e-9) - (fall ? 1 : 0));
  slots.forEach((el, i) => { const show = i < resting ? "" : "none"; if (el.style.display !== show) el.style.display = show; });
  stack.setAttribute("transform", translateAlong(P, [0, 0, drop]));
  falling.style.display = fall ? "" : "none";
  if (fall) falling.setAttribute("transform", translateAlong(P, [0, 0, fall.z - BOTTOM]));
  flyers.forEach((el) => { if (!flying.some((f) => f.el === el)) el.style.display = "none"; });
  for (const f of flying) {
    const slide = Math.min(1, f.t / 0.45), sink = Math.max(0, Math.min(1, (f.t - 0.45) / 0.2));
    f.el.style.display = "";
    f.el.setAttribute("transform", translateAlong(P, [(SLOT_X - CX) * ease(slide), 0, 0]));
    f.el.setAttribute("opacity", String(1 - sink));
  }
  pusherEl.setAttribute("transform", translateAlong(P, [push, 0, 0]));
  const c = coil(SPRING_FROM, SPRING_TO + push, [0, SPRING_Z], 3, 7, "x", P);
  coilBack.setAttribute("d", c.back);
  coilFront.setAttribute("d", c.front);
  const theta = b.fed * Math.PI * 2 / 5;
  pockets.innerHTML = pocketsAt(theta);
  pointer.setAttribute("d", lineOnTop(FEED, [FEED[0] + 4.2 * Math.sin(theta), FEED[1] + 4.2 * Math.cos(theta)], HUB_TOP, P));
  flag.setAttribute("transform", translateAlong(P, [0, 0, FLAG_RISE * flagUp]));
  flagLit.setAttribute("opacity", flagUp.toFixed(3));
  const text = b.tokens.toFixed(1) + " tokens · " + rate.toFixed(1) + "/s · " + b.ok + " served · " + b.no + " rejected";
  if (readout.textContent !== text) readout.textContent = text;
  stage.setAttribute("aria-valuenow", rate.toFixed(1));
  stage.setAttribute("aria-valuetext", text);
}

let frame = 0, last = 0, visible = false;
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  clock += dt;
  const calm = still.matches;
  if (touring) { tourClock += dt; rate = tourRate(tourClock); }
  const before = Math.floor(b.fed + 1e-9);
  refill(b, dt);
  if (Math.floor(b.fed + 1e-9) > before) fall = calm ? null : { z: DROP_FROM, v: 0 };
  reqAcc += rate * dt;
  while (reqAcc >= 1) { reqAcc -= 1; fire(); }
  if (fall) {
    const land = BOTTOM + PITCH * Math.max(0, Math.floor(b.tokens + 1e-9) - 1);
    if (Math.floor(b.tokens + 1e-9) < 1) fall = null;
    else { fall.v += 4000 * dt; fall.z -= fall.v * dt; if (fall.z <= land) fall = null; }
  }
  drop = calm ? 0 : drop * Math.exp(-dt / 0.03);
  pulse *= Math.exp(-dt / 0.06);
  push = calm ? 0 : push + (STROKE * pulse - push) * (1 - Math.exp(-dt / 0.02));
  for (const f of flying) f.t += dt;
  while (flying.length && flying[0].t > 0.65) flying.shift();
  const want = clock - rejectAt < 0.5 ? 1 : 0;
  flagUp = calm ? want : flagUp + (want - flagUp) * (1 - Math.exp(-dt / (want ? 0.06 : 0.25)));
  draw();
  frame = visible ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
const steer = (next) => {
  touring = false;
  rate = Math.min(MAX_RATE, Math.max(0, next));
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { touring = !still.matches; tourClock = 0; }, 6000);
};
new IntersectionObserver((entries) => { visible = entries[entries.length - 1].isIntersecting; if (visible) run(); }, { rootMargin: "120px 0px" }).observe(stage);
stage.addEventListener("pointermove", (event) => {
  const box = svg.getBoundingClientRect();
  const share = Math.min(1, Math.max(0, ((event.clientX - box.left) / box.width - 0.15) / 0.7));
  steer(Math.round(share * MAX_RATE * 2) / 2);
});
stage.addEventListener("pointerdown", () => { steer(rate); fire(); });
stage.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" || event.key === "ArrowUp") steer(rate + 1);
  else if (event.key === "ArrowLeft" || event.key === "ArrowDown") steer(rate - 1);
  else if (event.key === "Home") steer(0);
  else if (event.key === "End") steer(MAX_RATE);
  else if (event.key === " " || event.key === "Enter") { steer(rate); fire(); }
  else return;
  event.preventDefault();
});
draw();
`;

const body = k.plateHtml({
  fig: "Fig 1",
  title: "Token bucket",
  hint: "Hover sets the rate · click sends one",
  readout: "20.0 tokens · 0.0/s · 0 served · 0 rejected",
  keys: [
    { mark: "raised", label: "Tokens: the column holds 20, one is spent per request" },
    { mark: "lit", label: "Reject flag: up while requests find the column empty" },
  ],
  caption:
    "A token bucket as a token dispenser. The feeder plate turns once a second and drops a token from each of its five pockets, so 5 tokens arrive every second, and it stops when the column holds 20. Every request drives the pusher, which takes the bottom token out to the drawer. Below 5 requests a second the column stays full; above it the column drains, and once it is empty each request finds nothing, the flag goes up and the request is rejected. A full column lets a burst of 20 through at once.",
  body: `<div class="iso-stage" tabindex="0" role="slider" aria-label="Token bucket: arrow keys change the request rate, space sends one request" aria-valuemin="0" aria-valuemax="15" aria-valuenow="0">${svg}</div>`,
});

const name = theme === "light" ? "token-bucket-light.html" : "token-bucket.html";
writeFileSync(join(HERE, name), k.pageHtml({ title: "Token bucket", theme, body, script: kitScript() + live }));
console.log("wrote", name);
