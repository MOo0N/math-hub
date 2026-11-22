#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""逐模型无头渲染验证 + 几何恒等式断言。

用法：python3 tests/verify.py
退出码：0=全部通过；2=存在渲染错误或恒等式不成立。
报告写入 tests/report.json，关键截图写入 tests/shots/。
"""
import json, os, re, sys
from playwright.sync_api import sync_playwright
from _env import URL, SHOTS, REPORT, launch

KEY_MODELS = ["cong-hand-equilateral", "central-tendency", "pythagoras", "quadratic-function"]

# ---------- 几何恒等式断言：从读数文本解析数值并核对 ----------
def _f(pat, text, flags=0):
    m = re.search(pat, text, flags)
    return float(m.group(1)) if m else None


def _id_hand_eq(r):
    a = _f(r"AC\s*=\s*([\d.]+)", r); b = _f(r"BD\s*=\s*([\d.]+)", r)
    d = _f(r"AC\s*[−-]\s*BD\s*=\s*([-\d.]+)", r)
    if a is None or b is None: return False, "未解析到 AC/BD"
    if abs(a - b) > 0.02: return False, "AC≠BD: %.3f vs %.3f" % (a, b)
    if d is not None and abs(d) > 0.001: return False, "差值非0: %.4f" % d
    return True, "AC=BD=%.2f, 差%.4f" % (a, d if d is not None else abs(a - b))


def _id_hand_right(r):
    a = _f(r"AC\s*=\s*([\d.]+)", r); b = _f(r"BD\s*=\s*([\d.]+)", r)
    if a is None or b is None or abs(a - b) > 0.02: return False, "AC/BD 不等: %s,%s" % (a, b)
    return True, "AC=BD=%.2f" % a


def _id_hand_reverse(r):
    a = _f(r"OA/OB=([\d.]+)", r); b = _f(r"AC/BD=([\d.]+)", r)
    if a is None or b is None or abs(a - b) > 0.003: return False, "相似比不等: %s,%s" % (a, b)
    return True, "OA/OB=AC/BD=%.3f" % a


def _id_pythagoras(r):
    x = _f(r"a²\s*\+\s*b²\s*=\s*([\d.]+)", r); y = _f(r"c²\s*=\s*([\d.]+)", r)
    if x is None or y is None or abs(x - y) > 0.01: return False, "a²+b²≠c²: %s,%s" % (x, y)
    return True, "a²+b²=c²=%.2f" % x


def _id_variance(r):
    v = _f(r"σ²=([\d.]+)", r)
    if v is None: return False, "未解析到方差"
    if abs(v - 3.24) > 0.01: return False, "σ²≠3.24: %.2f" % v
    return True, "σ²=%.2f" % v


def _id_bisector(r):
    a = _f(r"∠BPC=([\d.]+)°", r); b = _f(r"½∠A=([\d.]+)°", r)
    if a is None or b is None or abs(a - b) > 0.15: return False, "∠BPC≠90°+½∠A: %s,%s" % (a, b)
    return True, "∠BPC=90°+½∠A=%.1f°" % a


def _id_quadratic(r):
    m = re.search(r"y\s*=\s*(-?[\d.]+)x²\s*(-?[\d.]+)x\s*(-?[\d.]+)", r)
    ax = _f(r"对称轴\s*x=([-\d.]+)", r); delta = _f(r"Δ=([-\d.]+)", r)
    if not m: return False, "未解析到二次函数系数"
    a, b, c = float(m.group(1)), float(m.group(2)), float(m.group(3))
    axis, disc = -b / (2 * a), b * b - 4 * a * c
    if ax is None or abs(ax - axis) > 0.01: return False, "对称轴错误: %s vs %.2f" % (ax, axis)
    if delta is None or abs(delta - disc) > 0.01: return False, "Δ错误: %s vs %.2f" % (delta, disc)
    return True, "对称轴%.2f, Δ=%.2f" % (axis, disc)


def _id_similarity(r):
    vals = [float(x) for x in re.findall(r"(?:OA/OC|OB/OD|AB/CD)=([\d.]+)", r)]
    if len(vals) < 3 or max(vals) - min(vals) > 0.003: return False, "相似比不等: %s" % vals
    return True, "三比相等=%.3f" % vals[0]


IDENTITIES = [
    ("cong-hand-equilateral", "手拉手 AC−BD=0", _id_hand_eq),
    ("cong-hand-right", "直角手拉手 AC=BD", _id_hand_right),
    ("cong-hand-reverse", "反手拉手 相似比相等", _id_hand_reverse),
    ("pythagoras", "勾股 a²+b²=c²", _id_pythagoras),
    ("central-tendency", "方差 σ²=3.24", _id_variance),
    ("ang-bi-inner", "角平分 ∠BPC=90°+½∠A", _id_bisector),
    ("quadratic-function", "二次函数 对称轴/Δ", _id_quadratic),
    ("sim-x-type", "X型相似 三比相等", _id_similarity),
]


def main():
    os.makedirs(SHOTS, exist_ok=True)
    report = {"total": 0, "errors": [], "models": [], "identities": [], "key_shots": []}
    with sync_playwright() as p:
        browser = launch(p)
        page = browser.new_page(viewport={"width": 1440, "height": 900}, device_scale_factor=1)
        console_errors, page_errors = [], []
        page.on("console", lambda m: console_errors.append(m.text) if m.type == "error" else None)
        page.on("pageerror", lambda e: page_errors.append(str(e)))

        page.goto(URL, wait_until="load")
        page.wait_for_timeout(400)
        ids = page.evaluate("Object.keys(window.MathHub.models)")
        report["total"] = len(ids)
        if not ids:
            print("FATAL: 无模型注册", console_errors, page_errors)
            sys.exit(2)

        for mid in ids:
            console_errors.clear(); page_errors.clear()
            try:
                page.evaluate("function(id){location.hash='#/m/'+id;}", mid)
                page.wait_for_timeout(90)
                readout = page.locator("#mh-readout").inner_text() if page.locator("#mh-readout").count() else ""
                svg_count = page.locator("svg").count()
                bad = []
                if any(t in readout for t in ("NaN", "undefined", "Infinity", "[object Object]")):
                    bad.append("readout_bad_value:" + readout[:160])
                if console_errors: bad.append("console:" + " | ".join(console_errors[:3])[:260])
                if page_errors: bad.append("pageerror:" + " | ".join(page_errors[:3])[:260])
                if svg_count == 0: bad.append("no_svg")
                item = {"id": mid, "readout": readout[:180], "svg": svg_count, "bad": bad}
                report["models"].append(item)
                if bad: report["errors"].append(item)
                if mid in KEY_MODELS:
                    path = os.path.join(SHOTS, mid + ".png")
                    page.screenshot(path=path, full_page=False)
                    report["key_shots"].append(path)
            except Exception as e:
                report["errors"].append({"id": mid, "bad": ["exception:" + str(e)[:260]]})

        # 恒等式断言：在渲染完成后逐项按读数核对
        by_id = {m["id"]: m["readout"] for m in report["models"]}
        for mid, name, fn in IDENTITIES:
            r = by_id.get(mid)
            if r is None:
                report["identities"].append({"id": mid, "name": name, "ok": False, "detail": "模型未渲染"})
                report["errors"].append({"id": mid, "bad": ["identity:模型未渲染"]})
                continue
            ok, detail = fn(r)
            report["identities"].append({"id": mid, "name": name, "ok": ok, "detail": detail})
            if not ok:
                report["errors"].append({"id": mid, "bad": ["identity:" + detail]})
        browser.close()

    with open(REPORT, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    print("模型总数:", report["total"])
    print("恒等式断言:", sum(1 for i in report["identities"] if i["ok"]), "/", len(IDENTITIES))
    for i in report["identities"]:
        print("  %s %-24s %s" % ("✓" if i["ok"] else "✗", i["name"], i["detail"]))
    print("异常数:", len(report["errors"]))
    for e in report["errors"][:30]:
        print("  -", e["id"], ";".join(e["bad"]))
    print("关键截图:", len(report["key_shots"]))
    sys.exit(2 if report["errors"] else 0)


if __name__ == "__main__":
    main()
