"""Draws the maki-roll scroll knob (nori, ~700 shaded rice grains and four
filling cubes: scrambled egg, crab stick, cucumber, carrot) as an SVG.

The site uses a 192px WebP render of it, public/scroll/maki-knob.webp, because
the SVG has ~2,000 shapes. To change the knob: edit, run
    python3 scripts/generate-maki.py
then open public/scroll/maki.svg in a browser, screenshot it at 192 x 192 with a
transparent background and save as public/scroll/maki-knob.webp.
Fixed seed, so the same roll comes out every time.
"""
import os
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'scroll', 'maki.svg')
import random, math
R=random.Random(7)
C=98             # centre, viewBox 0 0 200 200 (room for the side)
RO=96            # outer nori edge
RN=85            # nori/rice boundary (nori ~11 thick)
out=[]
def f(x): return f'{x:.1f}'
defs='''<defs>
<radialGradient id="mk-nori" cx="42%" cy="38%" r="70%"><stop offset="0" stop-color="#2b3426"/><stop offset=".6" stop-color="#1a2117"/><stop offset="1" stop-color="#0d110b"/></radialGradient>
<radialGradient id="mk-rice" cx="45%" cy="40%" r="62%"><stop offset="0" stop-color="#e9e0cf"/><stop offset=".8" stop-color="#d6cab3"/><stop offset="1" stop-color="#a89a80"/></radialGradient>
<radialGradient id="mk-grain" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#f7f2e7"/><stop offset="1" stop-color="#d8cdb8"/></radialGradient>
<linearGradient id="mk-side" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1e261b"/><stop offset="1" stop-color="#070906"/></linearGradient>
<radialGradient id="mk-tuna" cx="40%" cy="35%" r="80%"><stop offset="0" stop-color="#c22a3a"/><stop offset=".5" stop-color="#9e1729"/><stop offset="1" stop-color="#5e0a17"/></radialGradient>
<linearGradient id="mk-egg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe066"/><stop offset=".5" stop-color="#ffd23f"/><stop offset="1" stop-color="#f0b72c"/></linearGradient>
<linearGradient id="mk-crab" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c8321e"/><stop offset=".7" stop-color="#ee5a32"/><stop offset="1" stop-color="#f7a17a"/></linearGradient>
<linearGradient id="mk-cuke" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe08d"/><stop offset="1" stop-color="#e8f4c9"/></linearGradient>
<linearGradient id="mk-carrot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff9a3c"/><stop offset=".5" stop-color="#f57c1f"/><stop offset="1" stop-color="#d9610f"/></linearGradient>
<radialGradient id="mk-light" cx="34%" cy="28%" r="80%"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></radialGradient>

<clipPath id="mk-noriclip"><circle cx="98" cy="98" r="96"/></clipPath>
<filter id="mk-soft" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation=".6"/></filter>
</defs>'''
# the roll's side (it stands a little tall), then the nori disc on top
out.append(f'<circle cx="{C}" cy="{C+4}" r="{RO}" fill="url(#mk-side)"/>')
out.append(f'<circle cx="{C}" cy="{C}" r="{RO}" fill="url(#mk-nori)"/>')
# nori fibres: short curved strokes, slightly green/purple
g=['<g clip-path="url(#mk-noriclip)" fill="none" stroke-linecap="round">']
for i in range(700):
    a=R.uniform(0,2*math.pi); r=R.uniform(RN-1,RO)
    x=C+r*math.cos(a); y=C+r*math.sin(a)
    ang=a+math.pi/2+R.uniform(-.9,.9); L=R.uniform(2,7)
    x2=x+L*math.cos(ang); y2=y+L*math.sin(ang)
    col=R.choice(['#3c4a33','#46553a','#2f3a2a','#4a3f4c','#556347','#0a0d08'])
    g.append(f'<path d="M{f(x)} {f(y)} Q{f((x+x2)/2+R.uniform(-1,1))} {f((y+y2)/2+R.uniform(-1,1))} {f(x2)} {f(y2)}" stroke="{col}" stroke-width="{R.uniform(.3,.8):.2f}" opacity="{R.uniform(.35,.8):.2f}"/>')
# wrinkles
for i in range(14):
    a=R.uniform(0,2*math.pi); r=R.uniform(RN+1,RO-1)
    x=C+r*math.cos(a); y=C+r*math.sin(a)
    ang=a+math.pi/2+R.uniform(-.3,.3); L=R.uniform(8,18)
    g.append(f'<path d="M{f(x)} {f(y)} l{f(L*math.cos(ang))} {f(L*math.sin(ang))}" stroke="#5f6e52" stroke-width=".7" opacity=".35"/>')
g.append('</g>')
out+=g
# nori sheen arc + rim
out.append(f'<path d="M{C-80} {C-50} A94 94 0 0 1 {C+30} {C-90}" stroke="#a9b89a" stroke-width="2.2" fill="none" opacity=".35" stroke-linecap="round" filter="url(#mk-soft)"/>')
out.append(f'<circle cx="{C}" cy="{C}" r="{RO-.5}" fill="none" stroke="#000" stroke-opacity=".5" stroke-width="1"/>')
# rice base + inner nori edge shadow
rp=[]
for i in range(90):
    t=2*math.pi*i/90
    rr=RN+R.uniform(-1.6,1.2)
    rp.append((C+rr*math.cos(t),C+rr*math.sin(t)))
rpath='M'+' L'.join(f'{f(x)} {f(y)}' for x,y in rp)+'Z'
out.append(f'<clipPath id="mk-riceclip"><path d="{rpath}"/></clipPath>')
out.append(f'<path d="{rpath}" fill="url(#mk-rice)"/>')
# grains
grains=[]
# Futomaki-style filling: (name, dx, dy, w, h, rotation°) around the centre.
FILL=[
    ('tamago',   -19, -18, 36, 36, -6),
    ('crab',      19, -19, 36, 36,  5),
    ('cucumber', -18,  20, 36, 36,  4),
    ('carrot',    20,  19, 36, 36, -5),
]
def in_shape(x,y,sh,pad=0):
    _,dx,dy,w,h,rot=sh
    t=math.radians(-rot); px,py=x-(C+dx),y-(C+dy)
    u=px*math.cos(t)-py*math.sin(t); v=px*math.sin(t)+py*math.cos(t)
    return abs(u)<=w/2+pad and abs(v)<=h/2+pad
def in_tuna(x,y,pad=0):
    return any(in_shape(x,y,sh,pad) for sh in FILL)
tries=0
while len(grains)<720 and tries<90000:
    tries+=1
    a=R.uniform(0,2*math.pi); r=math.sqrt(R.uniform(0,1))*(RN+2)
    x=C+r*math.cos(a); y=C+r*math.sin(a)
    if in_tuna(x,y,-5): continue
    rx,ry=R.uniform(5.2,6.6),R.uniform(2.6,3.2)
    if any((x-gx)**2+(y-gy)**2<(2.7)**2 for gx,gy,*_ in grains): continue
    grains.append((x,y,R.uniform(0,180),rx,ry))
gg=['<g clip-path="url(#mk-riceclip)">']
for x,y,rot,rx,ry in grains:
    d=math.hypot(x-C,y-C)/RN   # shade towards edge
    gg.append(f'<g transform="translate({f(x)} {f(y)}) rotate({rot:.0f})">'
              f'<ellipse cx=".7" cy="1.2" rx="{rx:.1f}" ry="{ry:.1f}" fill="#5e5340" opacity="{.22+.25*d:.2f}"/>'
              f'<ellipse rx="{rx:.1f}" ry="{ry:.1f}" fill="url(#mk-grain)" stroke="#cfc3ab" stroke-width=".3"/>'
              f'<ellipse cx="-{rx*.3:.1f}" cy="-{ry*.38:.1f}" rx="{rx*.42:.1f}" ry="{ry*.22:.1f}" fill="#fff" opacity=".95"/></g>')
gg.append('</g>')
out+=gg
# shadow where rice meets nori
out.append(f'<circle cx="{C}" cy="{C}" r="{RN-1.5}" fill="none" stroke="#3b3324" stroke-opacity=".35" stroke-width="3" filter="url(#mk-soft)"/>')
# fillings
def rrect(sh,pad=0,r=3):
    _,dx,dy,w,h,rot=sh
    return f'<rect x="{f(-w/2-pad)}" y="{f(-h/2-pad)}" width="{f(w+2*pad)}" height="{f(h+2*pad)}" rx="{r}"', f'transform="translate({f(C+dx)} {f(C+dy)}) rotate({rot})"'
fl=[]
# soft contact shadow under the whole cluster
for sh in FILL:
    r,tf=rrect(sh,1.5,4)
    fl.append(f'<g {tf}>{r} fill="#4a3a22" opacity=".35" filter="url(#mk-soft)"/></g>')
for i,sh in enumerate(FILL):
    name,dx,dy,w,h,rot=sh
    r,tf=rrect(sh,0,2.5 if name!='carrot' and name!='carrot2' else 2)
    cid=f'mk-f{i}'
    g=[f'<g {tf}>', f'<clipPath id="{cid}">{r}/></clipPath>', f'<g clip-path="url(#{cid})">']
    W,H=w/2,h/2
    if name=='tamago':
        # scrambled egg: soft, lumpy curds in several yellows with tiny shadows
        g.append(f'<rect x="{-W}" y="{-H}" width="{w}" height="{h}" fill="#f2c335"/>')
        for k in range(46):
            x=R.uniform(-W,W); y=R.uniform(-H,H); rr=R.uniform(2,4.6)
            pts=[]
            for j in range(7):
                t=2*math.pi*j/7; q=rr*R.uniform(.7,1.15)
                pts.append(f'{f(x+q*math.cos(t))} {f(y+q*math.sin(t))}')
            col=R.choice(['#ffe27a','#ffd84f','#ffe999','#f7c83a','#fff0b8'])
            g.append(f'<path d="M{" L".join(pts)}Z" fill="{col}" stroke="#d99a22" stroke-width=".35" stroke-opacity=".6" stroke-linejoin="round"/>')
        for k in range(18):
            x=R.uniform(-W,W); y=R.uniform(-H,H)
            g.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{R.uniform(.5,1):.1f}" fill="#fff8d8" opacity=".8"/>')
    elif name=='crab':
        # crab stick: milky white flaky meat with the red coat along one side
        g.append(f'<rect x="{-W}" y="{-H}" width="{w}" height="{h}" fill="#f7f1e8"/>')
        for k in range(12):
            yy=-H+R.uniform(1,h-1)
            g.append(f'<path d="M{-W} {f(yy)} Q0 {f(yy+R.uniform(-1.5,1.5))} {W} {f(yy+R.uniform(-.8,.8))}" stroke="#e2d6c4" stroke-width=".7" fill="none"/>')
        g.append(f'<rect x="{-W}" y="{-H}" width="{w}" height="{f(h*.26)}" fill="url(#mk-crab)"/>')
        g.append(f'<rect x="{-W}" y="{f(-H+h*.26)}" width="{w}" height="1.6" fill="#f5b49a" opacity=".7"/>')
    elif name=='cucumber':
        # cucumber: pale green flesh, dark green skin along one edge, seeds
        g.append(f'<rect x="{-W}" y="{-H}" width="{w}" height="{h}" fill="url(#mk-cuke)"/>')
        g.append(f'<rect x="{-W}" y="{-H}" width="4" height="{h}" fill="#1c4f19"/>')
        g.append(f'<rect x="{f(-W+4)}" y="{-H}" width="1.6" height="{h}" fill="#4f9a34"/>')
        for k in range(5):
            y=-H+4+k*(h-8)/4+R.uniform(-.6,.6)
            g.append(f'<ellipse cx="{f(W-8+R.uniform(-1,1))}" cy="{f(y)}" rx=".9" ry="1.6" fill="#f2f8d8" stroke="#a8c776" stroke-width=".3"/>')
    else:
        # carrot: orange with fine growth rings and a slightly lighter core
        g.append(f'<rect x="{-W}" y="{-H}" width="{w}" height="{h}" fill="url(#mk-carrot)"/>')
        g.append(f'<circle cx="{f(-W-6)}" cy="{f(H+6)}" r="{f(w*.75)}" fill="#ffb15a" opacity=".35"/>')
        for k in range(6):
            g.append(f'<circle cx="{f(-W-6)}" cy="{f(H+6)}" r="{f(8+k*6+R.uniform(-1,1))}" fill="none" stroke="#ffa04a" stroke-width=".5" opacity=".55"/>')
    g.append('</g>')
    # edge + gloss, with a bevel so each piece reads as a little cube
    g.append(f'<g clip-path="url(#{cid})"><path d="M{-W} {H} L{W} {H} L{W} {-H}" fill="none" stroke="#000" stroke-opacity=".22" stroke-width="3"/><path d="M{-W} {H} L{-W} {-H} L{W} {-H}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2"/></g>')
    g.append(f'{r} fill="none" stroke="#000" stroke-opacity=".18" stroke-width=".7"/>')
    g.append(f'<rect x="{f(-W+2)}" y="{f(-H+1)}" width="{f(w*.45)}" height="1.2" rx=".6" fill="#fff" opacity=".45"/>')
    g.append('</g>')
    fl+=g
out+=fl
# a few grains pressed over the edge of the tuna, so it sits in the rice
eg=['<g>']
k=0
for i in range(400):
    if k>=5: break
    t=R.uniform(0,2*math.pi); rr=R.uniform(30,62)
    x=C+rr*math.cos(t); y=C+rr*math.sin(t)
    if not (in_tuna(x,y,2.5) and not in_tuna(x,y,0)): continue
    rx,ry=R.uniform(5,6.2),R.uniform(2.5,3)
    eg.append(f'<g transform="translate({f(x)} {f(y)}) rotate({math.degrees(t)+90+R.uniform(-30,30):.0f})">'
              f'<ellipse cx=".7" cy="1.2" rx="{rx:.1f}" ry="{ry:.1f}" fill="#3a0a12" opacity=".35"/>'
              f'<ellipse rx="{rx:.1f}" ry="{ry:.1f}" fill="url(#mk-grain)" stroke="#cfc3ab" stroke-width=".3"/>'
              f'<ellipse cx="-{rx*.3:.1f}" cy="-{ry*.38:.1f}" rx="{rx*.42:.1f}" ry="{ry*.22:.1f}" fill="#fff" opacity=".95"/></g>')
    k+=1
eg.append('</g>')
out+=eg
# global lighting
out.append(f'<circle cx="{C}" cy="{C}" r="{RO}" fill="url(#mk-light)"/>')
svg_body=defs+''.join(out)
open(OUT,'w').write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="400" height="400">{svg_body}</svg>')
print(len(svg_body))
