#!/usr/bin/env bash
# 安全推送脚本：从 GitHub 连接器读取令牌，推送后不在 remote 配置中残留令牌。
# 用法：
#   bash scripts/push.sh develop        推送开发分支
#   bash scripts/push.sh master         推送主分支（发布时）
#   bash scripts/push.sh --tags         推送所有标签
set -euo pipefail

REPO_OWNER="MOo0N"
REPO_NAME="math-hub"
SKILL_TOKEN_SH="/root/.codebuddy/skills/github-connector/scripts/get_token.sh"

cd "$(dirname "$0")/.."

# 读取令牌（不打印）
if [ -f "$SKILL_TOKEN_SH" ]; then
  source "$SKILL_TOKEN_SH" github >/dev/null 2>&1 || true
fi
if [ -z "${GITHUB_TOKEN:-}" ]; then
  echo "错误：未获取到 GitHub 令牌，请在 CodeBuddy 连接器重新授权 GitHub。" >&2
  exit 1
fi

REMOTE="https://oauth2:${GITHUB_TOKEN}@github.com/${REPO_OWNER}/${REPO_NAME}.git"
unset GITHUB_TOKEN 2>/dev/null || true

TARGET="${1:-}"
case "$TARGET" in
  --tags)
    echo "推送标签..."
    GIT_TERMINAL_PROMPT=0 git push "$REMOTE" --tags
    ;;
  develop|master|feature/*|fix/*)
    echo "推送分支 $TARGET..."
    GIT_TERMINAL_PROMPT=0 git push "$REMOTE" "$TARGET:refs/heads/$TARGET"
    ;;
  *)
    echo "用法: bash scripts/push.sh develop|master|--tags|feature/xxx|fix/xxx" >&2
    exit 1
    ;;
esac

echo "完成。远端 URL 未被修改，令牌不会残留。"
