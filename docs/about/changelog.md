# Changelog / 更新日志

本页用于记录本站较重要的内容更新、结构调整与页面优化。

## 2026-04-04

- 记录好友王芳佳通过 Pull Request 参与的功能优化，并在 [Acknowledgements / 致谢](acknowledgements.md) 页面补充相关说明。
- 将远程仓库中已接受的搜索优化与日间/夜间模式切换优化，整合到当前本地较新的文档结构中，尽量同时保留双方成果。
- 在 [mkdocs.yml](../../mkdocs.yml) 中补充搜索 worker hook 与主题切换脚本接入。
- 新增 `docs/javascripts/theme-toggle.js`、`hooks/search_worker.py`、`scripts/custom_search_worker.js` 与 `scripts/verify_custom_search.js`。
- 本地执行 `python -m mkdocs build` 完成构建检查，确认搜索 worker 替换成功，当前站点可正常构建。

## 2026-03-31

- 调整 `mkdocs.yml`，统一导航命名为 `English / 中文`，并启用与 Material for MkDocs 一致的前后页导航。
- 更新全站公开联系邮箱为 `contact@bridgezhang.com`。
- 重写 [About This Site / 关于站点](site.md) 与 [Building This Site / 建站说明](site-building.md)，补充 Logo 图片、版权登记信息、外部链接提示和更清晰的建站说明结构。
- 重构 [Modeling & Drawings / 建模与图纸](../modeling/index.md) 栏目，按系列文章顺序重排导航，并从导航中移除 `cad-modeling.md`。
- 重写 [Naming Standards / 命名标准](../modeling/naming-standards.md)，按“引言、范围与目标、标准引用、实操与模板、同名文件冲突、参考来源”的结构重组内容。
- 新增 `modeling-method.md`、`parametric-modeling.md`、`configurations.md`、`drawing-template.md`、`exploded-view.md`、`bom-guide.md` 与 `revision-control.md` 等系列页面骨架。
- 将其余占位页的标题统一为英中双语，并补充简要导语，便于后续继续扩写。

## 2026-03-28

- 在 [Building This Site / 建站说明](site-building.md) 中补充网站的建站缘起，说明本站以 GitHub 作为文档写作与长期维护平台的思路，并记录其受到 [SurviveSJTU/SurviveSJTUManual](https://github.com/SurviveSJTU/SurviveSJTUManual) 的启发与致谢。
- 在 `mkdocs.yml` 中补充仓库信息，并启用 `View source of this page` 与 `Edit this page`。
- 接入文档元数据插件，为页面底部补充 `last updated`、`created` 与 `contributors` 信息，并同步调整构建依赖与 CI 配置。
- 调整首页卡片文案，统一为双语表达，并补充协作说明页的跳转入口。
- 新增 [Collaboration / 协作说明](collaboration.md) 与 [Copyright & License / 版权与许可](copyright-license.md) 页面。
- 统一站点中的邮箱地址，并补充 Python / pip / MkDocs 环境问题的简明记录。
- 新增 `vercel.json` 与 `.python-version`，逐步理顺 Vercel 的构建与部署配置。

## 2026-03-27

- 拆分 [About This Site / 关于站点](site.md) 与 [Building This Site / 建站说明](site-building.md)，将“站点介绍”与“建站复盘”分离。
- 调整 `About / 关于` 导航结构，并统一 `about` 目录下页面的标题、命名与说明文字。
- 为非首页内容页增加 `Print / 打印` 按钮，并补充打印样式。
- 为建站说明中的常用命令补充注释，便于日后复用与回顾。
- 新增 [Acknowledgements / 致谢](acknowledgements.md) 页面，用于记录他人的建议与帮助。

## 2026-03-26

- 重写 [About This Site / 关于站点](site.md) 页面，将原先偏流水记录的内容整理为更适合复盘与分享的结构化说明。
- 重构站点建设思路，补充建站目标、工作流、部署关系、关键经验与后续方向等内容。
- 为站点说明页增加 Admonitions、Mermaid 流程图与表格，提升可读性。

## 2026-03-24

- 提交 [Naming Standards / 命名标准](../modeling/naming-standards.md) 初稿。
- 调整首页部分表述，使措辞更准确。

## 2026-03-22

- 参考 [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) 的模板思路，结合项目内容完成首页的最小化重构。
