# Renders src/app/opengraph-image.png (and twitter-image.png) in the site fonts.
# Run the site on localhost:3111 (next build && next start -p 3111), then: python3 scripts/og-image.py
# and copy og.png over both image files. Update the numbers here when facts.stats change.
import asyncio
from playwright.async_api import async_playwright
HTML = r'''
<div id="og" style="position:relative;width:1200px;height:630px;overflow:hidden;background:#0d0d12;color:#f2f2f2;font-family:var(--font-inter),system-ui,sans-serif">
  <div style="position:absolute;inset:0;background-image:radial-gradient(#1f1f28 1.2px,transparent 1.2px);background-size:26px 26px;-webkit-mask-image:radial-gradient(ellipse 80% 80% at 30% 50%,#000 30%,transparent 100%)"></div>
  <div style="position:absolute;right:-120px;top:40px;width:720px;height:720px;border-radius:50%;background:radial-gradient(closest-side,rgba(59,130,246,0.32),transparent)"></div>
  <div style="position:absolute;left:72px;top:64px;display:flex;align-items:center;gap:14px;color:#f2f2f2">LOGO</div>
  <div style="position:absolute;left:72px;top:176px;width:720px">
    <div style="font-family:var(--font-label-face),sans-serif;font-size:17px;letter-spacing:0.16em;color:#8a91a0;text-transform:uppercase">Performance-based clipping agency</div>
    <div style="margin-top:26px;font-family:var(--font-manrope),sans-serif;font-weight:800;font-size:64px;line-height:1.04;letter-spacing:-0.035em">Short-form reach,<br>paid per verified view.</div>
    <div style="margin-top:22px;font-size:23px;line-height:1.4;color:#8a91a0">On TikTok, Reels, Shorts and X.</div>
  </div>
  <div style="position:absolute;left:72px;bottom:60px;display:flex;gap:44px;align-items:flex-end">
    STATS
  </div>
  <div style="position:absolute;right:56px;bottom:62px;font-family:var(--font-label-face),sans-serif;font-size:14px;letter-spacing:0.16em;color:#5f6675">NOVA-EYES.COM</div>
  <div style="position:absolute;right:96px;top:120px;width:330px;height:400px">CARDS</div>
</div>'''
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={"width": 1200, "height": 630}, device_scale_factor=1)
        await pg.goto("http://localhost:3111/", wait_until="networkidle")
        logo = await pg.evaluate("document.querySelector('header a').innerHTML")
        mark = await pg.evaluate("document.querySelector('header a svg').outerHTML")
        stats = "".join(
            f'<div><div style="font-family:var(--font-manrope),sans-serif;font-weight:800;font-size:40px;letter-spacing:-0.03em">{v}</div><div style="margin-top:4px;font-size:16px;color:#7a8190">{l}</div></div>'
            for v, l in [("20,000+", "Active clippers"), ("600M+", "Views delivered"), ("21,000+", "Clips distributed")]
        )
        cards = ""
        for rot, x, op in [(-11, -40, 0.55), (11, 70, 0.7), (0, 15, 1)]:
            cards += f'''<div style="position:absolute;left:{60 + x}px;top:10px;width:210px;height:374px;border-radius:26px;transform:rotate({rot}deg);transform-origin:50% 100%;opacity:{op};
              background:linear-gradient(160deg,#1e2232 0%,#0f1018 55%,#13213f 100%);border:1px solid rgba(255,255,255,0.12);box-shadow:0 30px 60px rgba(0,0,0,0.55),0 0 50px rgba(59,130,246,0.18);overflow:hidden">
              <div style="position:absolute;inset:0;background:linear-gradient(115deg,transparent 35%,rgba(59,130,246,0.22) 48%,rgba(255,255,255,0.06) 52%,transparent 66%)"></div>
              <div style="position:absolute;left:50%;top:50%;width:46%;transform:translate(-50%,-50%);color:rgba(255,255,255,0.18)">{mark}</div>
              <div style="position:absolute;left:14px;right:14px;bottom:14px;height:4px;border-radius:4px;background:rgba(255,255,255,0.15)"><div style="width:62%;height:100%;border-radius:4px;background:#3b82f6;box-shadow:0 0 10px rgba(59,130,246,0.9)"></div></div>
            </div>'''
        html = HTML.replace("LOGO", logo).replace("STATS", stats).replace("CARDS", cards)
        await pg.evaluate("""(h) => { document.body.innerHTML = h; document.body.style.margin = 0; document.body.style.background = '#0d0d12'; }""", html)
        await pg.evaluate("""() => { const l = document.querySelector('#og > div:nth-child(3)'); l.querySelectorAll('svg')[0].style.height='30px'; l.querySelectorAll('svg')[0].style.width='auto'; l.querySelectorAll('svg')[1].style.height='22px'; l.querySelectorAll('svg')[1].style.width='auto'; }""")
        await pg.evaluate("document.fonts.ready")
        await pg.wait_for_timeout(500)
        await pg.locator("#og").screenshot(path="og.png")
        await b.close()
asyncio.run(main())
