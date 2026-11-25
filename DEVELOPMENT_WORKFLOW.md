# MathHub 开发流程规范（develop 分支制）

> 生效日期：2026-11-25 · 适用对象：所有协作者与 AI 助手
> 目标：**避免直接提交到主分支**，让每一次变更都可追踪、可回滚、可审计。

## 一、分支结构

| 分支 | 角色 | 是否允许直接提交 | 说明 |
| --- | --- | --- | --- |
| `master` | 主分支 / 发布分支 | ❌ 禁止 | 只接受来自 `develop` 的合并；每个稳定版打 tag |
| `develop` | 开发主分支 | ✅ 日常集成 | 所有新功能、修复、优化的集成与验证都在这里完成 |
| `feature/xxx` | 功能分支 | ✅ 开发中 | 从 `develop` 切出，做完合并回 `develop` |
| `fix/xxx` | 修复分支 | ✅ 开发中 | 从 `develop` 切出，做完合并回 `develop` |

**核心原则**：`master` 永远是"随时可发布"的稳定状态；任何改动先到 `develop`，验证通过后再合并到 `master`。

## 二、标准流程（每次任务必须走完）

### 1. 从 develop 切分支开发

```bash
git checkout develop
git pull origin develop          # 同步最新开发基线（无远程时跳过）
git checkout -b feature/模型名   # 或 fix/问题描述
```

### 2. 改动 + 验证门禁

只改 `src/` 下源码；`dist/index.html` 由 `build.py` 生成，禁止手改。每次改动后：

```bash
bash tests/check.sh
```

一条命令完成：JS 语法检查 → 重建 → 逐模型无头渲染 → 13 条几何恒等式断言 → 锁定交互测试。任一步失败即停止。

### 3. 合并回 develop（先本地，后远程）

```bash
git checkout develop
git merge --no-ff feature/模型名 -m "merge: 合并功能 <描述>"   # --no-ff 保留分支痕迹，便于追溯
git branch -d feature/模型名
bash tests/check.sh              # 合并后再跑一次门禁，确认集成无回归
```

### 4. 合并 develop 到 master（发布动作）

仅在 develop 的完整门禁通过、改动已确认无误后执行：

```bash
git checkout master
git merge --no-ff develop -m "release: 合并 develop 到 master <版本>"
git tag -a vX.Y.Z -m "<版本说明>"
```

### 5. 推送（需写权限）

```bash
bash scripts/push.sh develop     # 推开发分支
bash scripts/push.sh master      # 发布时推主分支
bash scripts/push.sh --tags      # 推标签
```

> 推送脚本从 GitHub 连接器读取令牌，不把令牌写入远端 URL，避免残留。若报 403 / `Resource not accessible by integration`，说明当前令牌无写权限，见第五节。

## 三、变更可追踪要求

- 提交信息用 Conventional 前缀：`feat:` / `fix:` / `docs:` / `style:` / `chore:` / `refactor:`。
- 合并一律用 `--no-ff`，即使快进也生成合并提交，保留"哪个功能在何时进入主干"的痕迹。
- 每个可发布状态打 `vX.Y.Z` tag，并在 `README.md` 版本记录表登记内容与日期。
- 涉及线上链接的发布，更新前须单独征得确认（发布会覆盖现有内容）。

## 四、一键门禁清单（develop 与 master 都要过）

1. `node --check` 全量 JS 语法。
2. `python3 build.py` 重建单文件。
3. `python3 tests/verify.py` 逐模型无头渲染 + 13 条恒等式断言。
4. `python3 tests/test_lock.py` 锁定/解锁交互。
5. 关键改动截图做视觉确认（居中、无重叠、无图元飞出）。

## 五、当前环境的 GitHub 写权限说明

截至 2026-11-25，本沙箱的 GitHub 令牌为 GitHub App 集成令牌：读权限正常（可列分支、读提交），但**写操作被拒绝**——`git push` 返回 403，`git /refs` API 返回 `Resource not accessible by integration`。

因此本地已建好 `develop` 分支并落地本流程，但**远程分支创建与推送需先恢复写权限**，二选一：

1. 在 CodeBuddy 设置 → 连接器，为 GitHub App 安装仓库并授予 Contents 读写权限后重试；
2. 或提供具备 repo 写权限的 Personal Access Token（PAT）。

恢复后再执行第 5 节推送命令即可，本地提交与分支结构已就绪，无需重做。
