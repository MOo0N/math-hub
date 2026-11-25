#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""新增教学设计专项测试：变化率残影 / 看图猜式计分 / 线性规划最优解 / 进阶页预测模式。

用法：python3 tests/test_teaching.py    退出码 0=通过，2=失败。
"""
import sys
import re
from playwright.sync_api import sync_playwright
from _env import URL, launch


def go(pg, model_id):
    pg.evaluate("id => location.hash='#/m/' + id", model_id)
    pg.wait_for_timeout(250)


def readout(pg):
    return pg.evaluate("document.getElementById('mh-readout').textContent")


def svg_text(pg):
    return pg.eval_on_selector('#mh-svg', 'e => e.textContent')


def btn(pg, label):
    return pg.locator('#mh-controls button', has_text=label).first


def click(pg, label):
    btn(pg, label).click()
    pg.wait_for_timeout(120)


def main():
    with sync_playwright() as p:
        b = launch(p)
        pg = b.new_page(viewport={'width': 1440, 'height': 900})
        errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.goto(URL, wait_until='load')
        pg.wait_for_timeout(300)

        def check(cond, msg):
            if not cond:
                raise AssertionError(msg)

        # ============ ① 变化率与残影 ============
        go(pg, 'linear-function-rate')
        r = readout(pg)
        check('Δy/Δx=' in r and '恒为 k' in r, '残影模型读数应含 Δy/Δx 恒为 k：' + r[:120])
        check('坡度 k=' in r and '起点 b=' in r, '残影模型读数应含坡度与起点')
        mk = re.search(r'坡度 k=(-?[\d.]+)', r)
        check(mk is not None, '读数应含坡度 k 数值：' + r[:120])
        before = float(mk.group(1))
        click(pg, 'k 变号')
        # 变号带 0.55s 缓动，等待结算
        pg.wait_for_timeout(750)
        ma = re.search(r'坡度 k=(-?[\d.]+)', readout(pg))
        after = float(ma.group(1)) if ma else None
        check(after is not None and abs(abs(before) - abs(after)) < 0.02 and before * after < 0,
              'k 变号应改变符号且保持绝对值：%s -> %s' % (before, after))
        click(pg, '清除残影')
        check('Δy/Δx=' in readout(pg), '清除残影后模型应仍正常')
        print('  ✓ ① 变化率与残影：读数/变号/清屏 OK')

        # ============ ② 看图猜式（计分） ============
        go(pg, 'linear-function-guess')
        check(pg.locator('#mh-quiz-score').count() == 1, '看图猜式应有连对计分牌')
        check('连对' in pg.locator('#mh-quiz-score').inner_text(), '计分牌文案缺失')
        check(pg.locator('#mh-controls [data-choice]').count() == 3, '应有三组单选（k/b/象限）')
        # 未答完就揭晓：提示先答完
        click(pg, '揭晓答案')
        check('请先答完三题' in readout(pg), '未答完应提示先答完三题：' + readout(pg)[:120])
        # 依次选三项
        pg.locator('[data-choice="qAnsK"] button').first.click()
        pg.locator('[data-choice="qAnsB"] button').first.click()
        pg.locator('[data-choice="qAnsQ"] button').first.click()
        pg.wait_for_timeout(100)
        check(pg.locator('[data-choice="qAnsK"] button.on').count() == 1, '选择应写入 .on 选中态')
        click(pg, '揭晓答案')
        r = readout(pg)
        check('已揭晓' in r and ('全对' in r or '再看一眼' in r), '揭晓后应给出对错反馈：' + r[:140])
        click(pg, '换一题')
        check(pg.locator('[data-choice] button.on').count() == 0, '换一题后应清除选项选中态')
        check('请先判断' in readout(pg), '换一题后应回到未揭晓状态')
        print('  ✓ ② 看图猜式：选项/揭晓/计分/换题 OK')

        # ============ ③ 线性规划最优解 ============
        go(pg, 'linear-programming')
        r = readout(pg)
        check('最大 26 元' in r and '四个角点利润' in r, '线性规划读数应含角点与最大值：' + r[:120])
        click(pg, '跳到最优 P=26')
        check('✓ 已到最优' in readout(pg), '跳到最优后应标记已到最优：' + readout(pg)[:160])
        click(pg, '顶点代入表')
        check('角点代入 P=3x+4y' in svg_text(pg), '顶点代入表应在画布显示代入过程')
        click(pg, '顶点代入表')
        check('角点代入 P=3x+4y' not in svg_text(pg), '再次点击应收起代入表')
        print('  ✓ ③ 线性规划：角点/最优解/代入表 OK')

        # ============ ④ 进阶页预测模式 ============
        go(pg, 'linear-function-advanced')
        check('#2f7d74' not in pg.eval_on_selector('#mh-svg', 'e => e.outerHTML'),
              '默认不应显示青色目标线')
        check(pg.locator('#mhc-predictMode').count() == 1, '进阶页应有预测模式开关')
        pg.locator('#mhc-predictMode').check()
        pg.wait_for_timeout(150)
        svg = pg.eval_on_selector('#mh-svg', 'e => e.outerHTML')
        check('stroke="#2f7d74"' in svg and 'stroke-dasharray="8 5"' in svg,
              '开启预测模式应出现青色虚线目标线')
        check('目标线（先猜，别看答案）' in svg_text(pg), '未揭晓时目标解析式应隐藏')
        click(pg, '揭晓目标式')
        t1 = svg_text(pg)
        check('目标：y=' in t1, '揭晓后应显示目标解析式：' + t1[:160])
        click(pg, '换一个目标')
        t2 = svg_text(pg)
        check('目标：y=' not in t2, '换目标后应重置为未揭晓状态')
        check('目标线（先猜，别看答案）' in t2, '换目标后目标解析式应重新隐藏')
        print('  ✓ ④ 预测模式：开关/虚线/揭晓/换目标 OK')

        check(not errs, '页面运行出现异常：' + ' | '.join(errs[:3]))
        b.close()
    print('新增教学设计专项测试：ALL PASS')


if __name__ == '__main__':
    try:
        main()
    except Exception as e:
        print('FAIL:', e, file=sys.stderr)
        sys.exit(2)
