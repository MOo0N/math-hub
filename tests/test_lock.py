#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""锁定交互测试：画布默认锁定且完全不可编辑（拖点/平移/缩放均禁）+ 明确提示；
解锁后全部恢复；实例间独立。

用法：python3 tests/test_lock.py    退出码 0=通过，2=失败。
"""
import sys
from playwright.sync_api import sync_playwright
from _env import URL, SHOTS, launch


def view(pg):
    return pg.evaluate("() => document.getElementById('mh-svg').getAttribute('viewBox')")


def readout(pg):
    return pg.evaluate("document.getElementById('mh-readout').textContent")


def svg2screen(pg, x, y):
    return pg.evaluate("""(pt)=>{var s=document.getElementById('mh-svg');
      var p=s.createSVGPoint();p.x=pt[0];p.y=pt[1];
      var q=p.matrixTransform(s.getScreenCTM());return {x:q.x,y:q.y};}""", [x, y])


def handleA_svg(pg):
    return pg.evaluate("""()=>{
      var t=[].slice.call(document.querySelectorAll('#mh-svg text'))
              .filter(x=>x.textContent==='A')[0];
      if(!t)return null;
      return [ +t.getAttribute('x'), +t.getAttribute('y')-14 ];
    }""")


def drag_scr(pg, scr, dx, dy):
    pg.mouse.move(scr['x'], scr['y']); pg.mouse.down()
    pg.mouse.move(scr['x'] + dx, scr['y'] + dy, steps=6); pg.mouse.up()
    pg.wait_for_timeout(150)


def main():
    with sync_playwright() as p:
        b = launch(p)
        pg = b.new_page(viewport={'width': 1440, 'height': 900})
        errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.goto(URL, wait_until='load'); pg.wait_for_timeout(300)
        pg.evaluate("location.hash='#/m/cong-hand-equilateral'"); pg.wait_for_timeout(250)
        btn = pg.locator('#mh-lock')

        def check(cond, msg):
            if not cond:
                raise AssertionError(msg)

        # ---- 1. 默认锁定态 ----
        check('已锁定' in btn.inner_text() and btn.get_attribute('aria-pressed') == 'true',
              '画布应默认锁定（按钮显示已锁定）')
        check('mh-canvas-locked' in pg.get_attribute('#mh-svg', 'class'), '默认锁定 class 缺失')
        check(pg.locator('#mh-lock-veil').is_visible(), '默认应显示锁定提示遮罩')
        check('画布已锁定' in pg.locator('#mh-lock-veil').inner_text(), '锁定提示文案缺失')

        # 锁定态：平移 / 拖点 / 按钮缩放 / 滚轮 全部禁止
        vb = view(pg)
        drag_scr(pg, svg2screen(pg, 800, 500), 60, 40)
        check(vb == view(pg), '锁定时画布平移应被禁止')
        a = handleA_svg(pg); s = svg2screen(pg, a[0], a[1])
        r0 = readout(pg); drag_scr(pg, s, 50, 40)
        check(r0 == readout(pg), '锁定时节点拖动应被禁止（读数不应变化）')
        pg.click('#mh-zi'); pg.click('#mh-zo'); pg.wait_for_timeout(60)
        check(vb == view(pg), '锁定时按钮缩放应被禁止')
        pg.mouse.move(svg2screen(pg, 450, 300)['x'], svg2screen(pg, 450, 300)['y'])
        pg.mouse.wheel(0, -300); pg.wait_for_timeout(80)
        check(vb == view(pg), '滚轮不得缩放画布（任何状态）')
        pg.screenshot(path=__import__('os').path.join(SHOTS, 'lock-default.png'), full_page=False)

        # ---- 2. 解锁后：平移/按钮缩放/节点拖动恢复，但滚轮仍不缩放 ----
        pg.click('#mh-lock'); pg.wait_for_timeout(100)
        check('解锁' in btn.inner_text() and btn.get_attribute('aria-pressed') == 'false', '解锁按钮状态错误')
        check(not pg.locator('#mh-lock-veil').is_visible(), '解锁后遮罩应隐藏')
        vb = view(pg); drag_scr(pg, svg2screen(pg, 800, 500), 60, 40)
        check(vb != view(pg), '解锁后画布平移应恢复')
        pg.click('#mh-reset'); pg.wait_for_timeout(60)     # 重置视图
        vb = view(pg); pg.click('#mh-zi'); pg.wait_for_timeout(60)
        check(vb != view(pg), '解锁后 ＋ 按钮缩放应恢复且视图同步')
        vb2 = view(pg); pg.mouse.move(svg2screen(pg, 450, 300)['x'], svg2screen(pg, 450, 300)['y'])
        pg.mouse.wheel(0, -300); pg.wait_for_timeout(80)
        check(vb2 == view(pg), '解锁后滚轮仍不得缩放画布')
        pg.click('#mh-reset'); pg.wait_for_timeout(60)     # 重置视图
        a = handleA_svg(pg); s = svg2screen(pg, a[0], a[1])
        r0 = readout(pg); drag_scr(pg, s, 50, 40)
        check(r0 != readout(pg), '解锁后节点应可拖动')
        pg.screenshot(path=__import__('os').path.join(SHOTS, 'lock-unlocked.png'), full_page=False)

        # ---- 3. 实例独立：每个新画布默认锁定，互不影响 ----
        pg.evaluate("location.hash='#/m/pythagoras'"); pg.wait_for_timeout(200)
        check('已锁定' in pg.locator('#mh-lock').inner_text(), '新画布应默认锁定')
        check(pg.locator('#mh-lock-veil').is_visible(), '新画布应显示锁定遮罩')
        pg.click('#mh-lock'); pg.wait_for_timeout(60)   # 解锁勾股
        check('解锁' in pg.locator('#mh-lock').inner_text(), '新画布应可独立解锁')
        pg.evaluate("location.hash='#/m/cong-hand-equilateral'"); pg.wait_for_timeout(200)
        check('已锁定' in pg.locator('#mh-lock').inner_text(), '切回画布应仍为默认锁定态')
        pg.click('#mh-lock'); pg.wait_for_timeout(60)   # 再解锁手拉手
        pg.evaluate("location.hash='#/m/pythagoras'"); pg.wait_for_timeout(200)
        check('已锁定' in pg.locator('#mh-lock').inner_text(), '切回勾股应重新默认锁定（实例独立）')

        check(not errs, '存在运行时错误: %s' % errs[:3])
        b.close()
    print('锁定交互测试: ALL PASS')
    sys.exit(0)


if __name__ == '__main__':
    try:
        main()
    except Exception as e:
        print('锁定交互测试: FAIL ->', e)
        sys.exit(2)
