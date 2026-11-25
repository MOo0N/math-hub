#!/usr/bin/env bash
# MathHub 提交前一键门禁：语法检查 → 重建 → 逐模型渲染+恒等式 → 锁定交互。
# 用法：bash tests/check.sh
set -e
cd "$(dirname "$0")/.."

echo "=== [1/5] node --check 全量 JS 语法 ==="
for f in src/*.js; do
  node --check "$f" || { echo "FAIL: $f"; exit 1; }
done
echo "全部 JS 语法 OK"

echo "=== [2/5] python3 build.py 重建单文件 ==="
python3 build.py

echo "=== [3/5] 逐模型渲染 + 几何恒等式断言 ==="
python3 tests/verify.py

echo "=== [4/5] 锁定/解锁交互测试 ==="
python3 tests/test_lock.py

echo "=== [5/5] 新增教学设计专项测试（残影/猜式/线性规划/预测模式）==="
python3 tests/test_teaching.py

echo "=== 门禁全部通过 ==="
