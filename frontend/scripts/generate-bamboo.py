#!/usr/bin/env python3
"""
Generates the realistic bamboo groves used behind the counter section
(frontend/public/bamboo/grove-left.svg and grove-right.svg).

The drawing is procedural but seeded, so every run gives the same result.
Change SEED_LEFT / SEED_RIGHT for a different arrangement, then run from the
frontend folder:

    python3 scripts/generate-bamboo.py

Each grove: tapered stalks with per-section tints, raised joints (light on top,
shadow below) with the pale waxy band, branches and twigs, and drooping leaves
in three depth layers (blurred back, stalks, sharp front with soft shadows).
"""
import math, random

# Wind through the leaves, in centimetres per second (5 = very light breath,
# 14 = lively breeze, 25+ = gusty): each leaf pivots gently at its stalk, leaning a little
# downwind (wind blowing from the left), each at its own pace so the canopy
# shimmers instead of moving in step. Higher values sway further and faster.
WIND_CM_PER_S = 18  # 5 very light, 14 lively, 18 brisk breeze (current)

# Eight wind motions, so leaves move in different directions: (direction,
# size, speed, twist). Direction +1 sways downwind (right), -1 upwind (left);
# size and speed scale the base sway; twist adds a slight skew like a leaf
# turning on its stalk. Each leaf cluster picks one by position (keeps the layout).
WIND_VARIANTS = [
    (+1, 1.0, 1.00, 0), (-1, 0.8, 1.15, 0), (+1, 1.4, 1.35, 4), (-1, 1.2, 0.85, -3),
    (+1, 0.5, 0.55, 0), (-1, 0.6, 0.60, 2), (+1, 1.1, 1.20, -4), (-1, 1.5, 1.45, 5),
]

def wind_style(speed):
    swing = 1.5 + speed * 0.5             # base sway in degrees (4 deg at 5 cm/s)
    lean = speed * 0.2                    # overall drift downwind (1 deg at 5 cm/s)
    period = max(1.6, 6.5 - speed * 0.3)  # base seconds per sway (5 s at 5 cm/s)
    css = []
    for i, (direction, size, pace, twist) in enumerate(WIND_VARIANTS):
        amp = swing * size
        start = lean - direction * amp * 0.4
        end = lean + direction * amp * 0.6
        mid = lean + direction * amp * 0.15
        css.append(
            f"@keyframes leafWind{i}{{"
            f"0%{{transform:rotate({start:.2f}deg) skewX(0deg)}}"
            f"45%{{transform:rotate({mid:.2f}deg) skewX({twist * 0.5:.1f}deg)}}"
            f"100%{{transform:rotate({end:.2f}deg) skewX({twist:.1f}deg)}}}}"
            f".w{i}{{animation:leafWind{i} {period * pace:.2f}s ease-in-out -{(i * 0.73) % (period * pace):.2f}s infinite alternate}}")
    classes = ','.join(f'.w{i}' for i in range(len(WIND_VARIANTS)))
    return ("<style>" + ''.join(css) +
            "@media (prefers-reduced-motion: reduce){" + classes + "{animation:none}}"
            "</style>")

def f(v): return f"{v:.1f}"

def leaf_path(L, w, droop):
    # Lance-shaped bamboo leaf pointing +x: narrow stalk at the base, widest
    # around 30%, long pointed tip that droops by `droop`.
    tipy = droop
    return (f"M0,0 C{f(L*.08)},{f(-w*.55)} {f(L*.28)},{f(-w*1.05)} {f(L*.5)},{f(-w*.85+tipy*.25)} "
            f"C{f(L*.72)},{f(-w*.55+tipy*.55)} {f(L*.9)},{f(tipy*.8-w*.15)} {f(L)},{f(tipy)} "
            f"C{f(L*.88)},{f(tipy*.85+w*.2)} {f(L*.7)},{f(w*.55+tipy*.5)} {f(L*.5)},{f(w*.7+tipy*.22)} "
            f"C{f(L*.28)},{f(w*.85)} {f(L*.08)},{f(w*.45)} 0,0 Z")

def leaf(x, y, ang, L, w, grad, rng, detail=True):
    droop = L*rng.uniform(.05,.16)
    d = leaf_path(L, w, droop)
    sway = "<g>"
    out = [f"<g transform='translate({f(x)} {f(y)}) rotate({f(ang)})'>", sway,
           f"<path d='{d}' fill='url(#{grad})'/>"]
    if detail:
        # midrib, two faint side veins, a light edge on the upper margin
        out.append(f"<path d='M{f(L*.04)},0 Q{f(L*.5)},{f(droop*.2)} {f(L*.96)},{f(droop*.95)}' stroke='#eef6c8' stroke-opacity='.55' stroke-width='.9' fill='none'/>")
    out.append("</g></g>")
    return ''.join(out)

def fan(x, y, base_ang, n, scale, rng, grads, detail=True):
    # A fan of drooping leaves at a twig tip; short petioles first.
    s=[]
    for i in range(n):
        a = base_ang + rng.uniform(-15, 120) * (1 if base_ang < 90 or base_ang > 270 else -1)
        a = base_ang + (i/(max(n-1,1)))*rng.uniform(70,120) - 20 + rng.uniform(-10,10)
        L = rng.uniform(58, 96)*scale
        w = rng.uniform(6.5, 9.5)*scale
        px, py = x + math.cos(math.radians(a))*4*scale, y + math.sin(math.radians(a))*4*scale
        s.append(f"<path d='M{f(x)},{f(y)} L{f(px)},{f(py)}' stroke='#6d8a2c' stroke-width='{f(1.2*scale)}'/>")
        s.append(leaf(px, py, a, L, w, rng.choice(grads), rng, detail))
    return ''.join(s)

def leaves_along(x0, y0, ang, length, n, scale, rng, grads, detail):
    """Leaves alternate along the outer part of a twig and hang downward.
    In the front layers the whole cluster sways in the wind as one group,
    pivoting at the start of the twig."""
    out=[]
    for i in range(n):
        t = 0.35 + 0.65*(i/(max(n-1,1)))
        px = x0 + math.cos(math.radians(ang))*length*t
        py = y0 + math.sin(math.radians(ang))*length*t
        side = 1 if i % 2 == 0 else -1
        a = ang + side*rng.uniform(28, 62)
        # gravity: pull the leaf direction toward straight down (90deg)
        down = 90 if math.cos(math.radians(a)) >= 0 else 90
        diff = ((down - a + 180) % 360) - 180
        a = a + diff*rng.uniform(.32, .58)
        L = rng.uniform(62, 100)*scale
        w = rng.uniform(6.5, 9.5)*scale
        out.append(leaf(px, py, a, L, w, rng.choice(grads), rng, detail))
    # terminal leaf continuing the twig
    ex = x0 + math.cos(math.radians(ang))*length
    ey = y0 + math.sin(math.radians(ang))*length
    out.append(leaf(ex, ey, ang + rng.uniform(10, 35), rng.uniform(70,105)*scale, rng.uniform(7,9.5)*scale, rng.choice(grads), rng, detail))
    if not detail:
        return ''.join(out)
    # wind motion picked from the twig's position, so the layout is unchanged
    variant = int(abs(x0) * 7 + abs(y0) * 13 + abs(ang) * 3) % len(WIND_VARIANTS)
    return f"<g class='w{variant}' style='transform-origin:{f(x0)}px {f(y0)}px'>" + ''.join(out) + "</g>"

def branch(x, y, ang, length, scale, rng, grads, detail, side):
    # Thin tapered branch with a couple of sub-twigs, each ending in a leaf fan.
    s=[]
    ex, ey = x+math.cos(math.radians(ang))*length, y+math.sin(math.radians(ang))*length
    cx, cy = (x+ex)/2 + rng.uniform(-8,8), (y+ey)/2 + rng.uniform(-6,6)
    s.append(f"<path d='M{f(x)},{f(y)} Q{f(cx)},{f(cy)} {f(ex)},{f(ey)}' stroke='url(#twig)' stroke-width='{f(2.6*scale)}' stroke-linecap='round' fill='none'/>")
    leaves=[]
    for t in (0.3, 0.55, 0.8):
        tx, ty = x+(ex-x)*t, y+(ey-y)*t
        ta = ang + rng.choice([1,-1])*rng.uniform(25,60)
        tl = length*rng.uniform(.45,.75)
        tex, tey = tx+math.cos(math.radians(ta))*tl, ty+math.sin(math.radians(ta))*tl
        s.append(f"<path d='M{f(tx)},{f(ty)} Q{f((tx+tex)/2)},{f((ty+tey)/2-4)} {f(tex)},{f(tey)}' stroke='#7d9a35' stroke-width='{f(1.4*scale)}' stroke-linecap='round' fill='none'/>")
        leaves.append(leaves_along(tx, ty, ta, tl, rng.randint(4,6), scale, rng, grads, detail))
    leaves.append(leaves_along(x, y, ang, length, rng.randint(5,7), scale, rng, grads, detail))
    return ''.join(s), ''.join(leaves)

def culm(x0, ybot, ytop, w0, lean, rng, tints, nodes_gap=(96,128)):
    # One stalk: tapered internodes with their own tint, streaks, raised
    # joints (light top, shadow below) and the pale waxy band under each joint.
    s=[]
    joints=[]
    y=ybot
    segs=[]
    while y > ytop:
        g = rng.uniform(*nodes_gap)
        segs.append((max(y-g, ytop), y)); y -= g
    H = ybot-ytop
    for (a,b) in segs:
        tmid = (ybot-(a+b)/2)/H
        w = w0*(1-.22*tmid)
        cx = x0 + lean*(ybot-(a+b)/2)
        s.append(f"<rect x='{f(cx-w/2)}' y='{f(a)}' width='{f(w)}' height='{f(b-a)}' fill='url(#culm)'/>")
        s.append(f"<rect x='{f(cx-w/2)}' y='{f(a)}' width='{f(w)}' height='{f(b-a)}' fill='{rng.choice(tints)}' opacity='{rng.uniform(.06,.2):.2f}'/>")
        for _ in range(3):
            sx = cx + rng.uniform(-.3,.3)*w
            s.append(f"<path d='M{f(sx)},{f(a+6)} L{f(sx+rng.uniform(-1,1))},{f(b-6)}' stroke='{rng.choice(['#ffffff','#1b2a08'])}' stroke-opacity='.07' stroke-width='1'/>")
        # pale waxy bloom just below the joint at the top of this section
        s.append(f"<rect x='{f(cx-w/2)}' y='{f(a+4)}' width='{f(w)}' height='14' fill='url(#bloom)'/>")
        # shadow cast down from the joint ring
        s.append(f"<rect x='{f(cx-w/2)}' y='{f(a+4)}' width='{f(w)}' height='9' fill='url(#jshade)'/>")
        if a > ytop+2:
            jw = w*1.1
            s.append(f"<rect x='{f(cx-jw/2)}' y='{f(a-3)}' width='{f(jw)}' height='7' rx='3' fill='url(#culm)'/>")
            s.append(f"<rect x='{f(cx-jw/2)}' y='{f(a-3)}' width='{f(jw)}' height='7' rx='3' fill='url(#joint)'/>")
            joints.append((cx, a, w))
    # tapered top that fades into the foliage
    tw = w0*.7
    tcx = x0 + lean*H
    s.append(f"<path d='M{f(tcx-tw/2)},{f(ytop)} L{f(tcx-1)},{f(ytop-70)} L{f(tcx+1)},{f(ytop-70)} L{f(tcx+tw/2)},{f(ytop)} Z' fill='url(#culm)'/>")
    return ''.join(s), joints, (tcx, ytop-70)

DEFS = """<defs>
<linearGradient id='culm' x1='0' x2='1' y1='0' y2='0'>
 <stop offset='0' stop-color='#1c2a09'/><stop offset='.1' stop-color='#3f581a'/><stop offset='.26' stop-color='#78952f'/>
 <stop offset='.38' stop-color='#b4ca62'/><stop offset='.44' stop-color='#e3edb0'/><stop offset='.5' stop-color='#a7c055'/>
 <stop offset='.68' stop-color='#63802a'/><stop offset='.84' stop-color='#7d9838'/><stop offset='.93' stop-color='#3d5418'/><stop offset='1' stop-color='#1a2608'/>
</linearGradient>
<linearGradient id='joint' x1='0' x2='0' y1='0' y2='1'>
 <stop offset='0' stop-color='#ffffff' stop-opacity='.75'/><stop offset='.3' stop-color='#f3f6d8' stop-opacity='.35'/>
 <stop offset='.55' stop-color='#000000' stop-opacity='0'/><stop offset='.75' stop-color='#0f1a03' stop-opacity='.45'/><stop offset='1' stop-color='#0f1a03' stop-opacity='.7'/>
</linearGradient>
<linearGradient id='bloom' x1='0' x2='0' y1='0' y2='1'>
 <stop offset='0' stop-color='#f4f2d2' stop-opacity='.55'/><stop offset='1' stop-color='#f4f2d2' stop-opacity='0'/>
</linearGradient>
<linearGradient id='jshade' x1='0' x2='0' y1='0' y2='1'>
 <stop offset='0' stop-color='#0f1a03' stop-opacity='.35'/><stop offset='1' stop-color='#0f1a03' stop-opacity='0'/>
</linearGradient>
<linearGradient id='twig' x1='0' x2='1'><stop offset='0' stop-color='#5d7a24'/><stop offset='1' stop-color='#a5bd5c'/></linearGradient>
<linearGradient id='lfA' x1='0' x2='0' y1='0' y2='1'><stop offset='0' stop-color='#c9e27e'/><stop offset='.45' stop-color='#86b23a'/><stop offset='1' stop-color='#3e6a16'/></linearGradient>
<linearGradient id='lfB' x1='0' x2='0' y1='0' y2='1'><stop offset='0' stop-color='#a9cf5e'/><stop offset='.5' stop-color='#689a28'/><stop offset='1' stop-color='#2f5410'/></linearGradient>
<linearGradient id='lfC' x1='0' x2='0' y1='0' y2='1'><stop offset='0' stop-color='#d7e58f'/><stop offset='.5' stop-color='#9bb846'/><stop offset='1' stop-color='#55761e'/></linearGradient>
<linearGradient id='lfE' x1='0' x2='0' y1='0' y2='1'><stop offset='0' stop-color='#8fb04a'/><stop offset='.5' stop-color='#527f22'/><stop offset='1' stop-color='#26460e'/></linearGradient>
<linearGradient id='lfD' x1='0' x2='0' y1='0' y2='1'><stop offset='0' stop-color='#6f9440'/><stop offset='.5' stop-color='#3e6420'/><stop offset='1' stop-color='#1f3a0c'/></linearGradient>
<filter id='blurBack' x='-10%' y='-10%' width='120%' height='120%'><feGaussianBlur stdDeviation='1.6'/></filter>
<filter id='leafShadow' x='-20%' y='-20%' width='140%' height='140%'><feDropShadow dx='5' dy='8' stdDeviation='4' flood-color='#0b1200' flood-opacity='.4'/></filter>
<filter id='culmShadow' x='-30%' y='-5%' width='160%' height='110%'><feDropShadow dx='14' dy='10' stdDeviation='9' flood-color='#120c00' flood-opacity='.45'/></filter>
</defs>"""

DEFS = DEFS.replace("<defs>", "<defs>" + wind_style(WIND_CM_PER_S), 1)

def cluster(seed, W=520, H=980, mirror=False):
    rng = random.Random(seed)
    tints = ['#e8d060','#2f5a10','#c9b54a','#1d3a08','#9ab43c']
    back, culms, front, mid = [], [], [], []
    # back culms (thin, far, blurred), mid, front (thick, near)
    # (x, width, lean, top, leaf scale, layer). Four visible poles per side,
    # each a different thickness and height, plus two faint blurred ones behind.
    specs = [ (250, 11, -0.012, 150, .55, 'back'), (205, 13, 0.008, 90, .7, 'back'),
              (182, 16, 0.014, 300, 1, 'mid'),     # thinnest, shortest
              (136, 22, -0.006, 10, 1, 'mid'),     # tallest
              (92, 19, 0.016, 190, 1, 'mid'),
              (46, 30, 0.01, 80, 1, 'front') ]     # thickest, nearest
    for (x, w, lean, top, scale, layer) in specs:
        if mirror: x, lean = W - x, -lean
        body, joints, tip = culm(x, H+10, top, w, lean, rng, tints)
        grads_back = ['lfD','lfB']
        grads = ['lfA','lfB','lfC','lfB','lfD','lfE'] if layer=='front' else ['lfB','lfD','lfE','lfB']
        target = culms if layer!='back' else back
        target.append(body)
        # branches from upper and middle joints, mostly toward the inside (right)
        for (cx, jy, jw) in joints:
            # fewer branches on the extra thin poles keeps the canopy as full as before, not heavier
            if jy > H*.78 or rng.random() < (.15 if layer=='front' else .45): continue
            side = 1 if rng.random() < .8 else -1
            if mirror: side = -side
            ang = -40*side if side>0 else -140
            ang += rng.uniform(-14, 14)
            length = rng.uniform(70, 150)*scale
            bx = cx + side*jw*.45
            b, lv = branch(bx, jy, ang, length, scale, rng, grads_back if layer=='back' else grads, layer!='back', side)
            (back if layer=='back' else mid).append(b)
            (back if layer=='back' else front).append(lv)
        # crown of foliage around the tip
        tx, ty = tip
        for k in range(8 if layer=='front' else 4 if layer=='mid' else 5):
            a = rng.uniform(-165, -15)
            ln = rng.uniform(60, 150)*scale
            b, lv = branch(tx, ty+rng.uniform(0,60), a, ln, scale, rng, grads_back if layer=='back' else grads, layer!='back', 1 if a>-90 else -1)
            (back if layer=='back' else mid).append(b)
            (back if layer=='back' else front).append(lv)
    return (f"<g filter='url(#blurBack)' opacity='.8'>{''.join(back)}</g>"
            f"<g filter='url(#culmShadow)'>{''.join(culms)}</g>"
            f"<g>{''.join(mid)}</g>"
            f"<g filter='url(#leafShadow)'>{''.join(front)}</g>")

def svg(seed, W=520, H=980, mirror=False, defs=True, style=''):
    return (f"<svg viewBox='-60 -230 {W+120} {H+240}' width='{W+120}' height='{H+240}' xmlns='http://www.w3.org/2000/svg' >"
            + (DEFS if defs else '') + cluster(seed, W, H, mirror) + "</svg>")


SEED_LEFT = 11
SEED_RIGHT = 23

if __name__ == "__main__":
    import os
    out_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "bamboo")
    os.makedirs(out_dir, exist_ok=True)
    for name, seed, mirror in (("grove-left.svg", SEED_LEFT, False), ("grove-right.svg", SEED_RIGHT, True)):
        with open(os.path.join(out_dir, name), "w", encoding="utf-8") as fh:
            fh.write(svg(seed, mirror=mirror))
        print("wrote", name)
