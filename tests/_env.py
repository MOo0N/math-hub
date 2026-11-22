#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""测试公共配置：路径、URL、无头浏览器启动参数。"""
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
URL = "file://" + os.path.join(ROOT, "dist", "index.html").replace(os.sep, "/")
SHOTS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "shots")
REPORT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "report.json")

BROWSER_ARGS = ["--no-sandbox", "--disable-dev-shm-usage", "--allow-file-access-from-files"]


def launch(pw):
    """优先用系统 chromium，找不到时回退到 Playwright 自带浏览器。"""
    for exe in ("/usr/bin/chromium", "/usr/bin/chromium-browser", "/usr/bin/google-chrome"):
        if os.path.exists(exe):
            return pw.chromium.launch(headless=True, executable_path=exe, args=BROWSER_ARGS)
    return pw.chromium.launch(headless=True, args=BROWSER_ARGS)
