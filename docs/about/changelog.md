# 更新日志

本页用于记录本站较重要的内容更新、结构调整与页面优化。

## 2026-08-29

- 增加页面底部浏览量统计的显示功能。
- 精简了about栏目下的所有文章，使信息更简洁、高效。

## 2026-07-11

- 重写并扩展[热处理知识框架](../manufacturing/heat-treatment.md)，补充热处理标准线索、工艺分类、图纸表达示例与设计风险提示。
- 新增[热处理基础](../manufacturing/heat-treatment-foundations.md) 页面，整理铁碳相图、相变、TTT 曲线、A2-70 / A4-70 与沉淀硬化不锈钢等基础概念，作为热处理专题的补充说明。
- 更新[表面处理概述](../manufacturing/surface-finish.md)，加入常见表面处理样卡图片、授权使用说明与参考来源。
- 新增 `scripts/add_watermark.py` 图片水印脚本，并补充 Pillow 依赖，用于对站内图片素材做更统一的标识处理。

## 2026-06-16

- 继续修订[基本标注](../modeling/dimensioning.md)，将尺寸标注从“设计表达”进一步收束到加工、检验和可读性复核。
- 局部调整[热处理知识框架](../manufacturing/heat-treatment.md) 与[表面处理概述](../manufacturing/surface-finish.md)，为后续制造专题的细分页面做铺垫。

## 2026-06-07

- 新增[软件版权](../modeling/software-copyright.md) 页面，作为 SolidWorks 建模与图纸系列的补充文章，讨论专业软件授权、工程协作环境与职业边界。
- 同步调整[建模与图纸](../modeling/index.md) 系列目录，将软件版权、模型检查与效率提升三篇补充文章重新编号并纳入导航。
- 对[模型检查](../modeling/model-checking.md) 与[提升效率](../modeling/improve-efficiency.md) 的标题编号做一致化处理。

## 2026-05-31

- 在[关于站点](index.md#filing) 中补充“关于备案”说明，记录本站当前 GitHub Actions、Vercel、Cloudflare 与自定义域名之间的部署关系。
- 记录微信外部链接访问警告与申诉恢复过程，并补充审核结果截图，方便日后回看站点公开访问链路中的实际问题。
- 调整页脚脚本与样式，在底部增加“关于备案”入口，并继续保留“版权与许可”链接。
- 修正[基本标注](../modeling/dimensioning.md) 中部分文字表述。

## 2026-05-25

- 新增[表面处理(铝合金阳极氧化)](../manufacturing/anodic-coatings-for-aluminum-and-aluminum-alloy.md) 页面，整理铝合金阳极氧化、硬质阳极氧化、海水浸泡掉色案例与供应商沟通要点。
- 调整制造栏目导航，将表面处理总览与铝合金阳极氧化专题拆分展示。
- 补充[设计案例](../design/design-cases.md)、[热处理知识框架](../manufacturing/heat-treatment.md)、[表面处理概述](../manufacturing/surface-finish.md) 与[基本标注](../modeling/dimensioning.md) 中的部分内容。

## 2026-05-24

- 修正站点底部“最后更新 / 创建日期”的数据来源，取消构建日期兜底，改为优先使用 Git 历史，避免 Vercel 部署时间误覆盖页面真实更新时间。
- 增加自定义 MkDocs 钩子，针对重命名文件场景重新计算创建日期，确保如关于作者这类页面返回最早的真实创建时间。
- 补充底部版权链接与站点页脚相关脚本配置，便于统一页脚展示。

## 2026-05-04

- 完成[建模与图纸](../modeling/index.md) 系列文章初版。

## 2026-04-07

- 从导航中移除 `Getting Started` 栏目，并删除对应的三个页面文件。
- 将首页“开始”按钮改为直接进入 [设计见解](../design/index.md) 栏目首页。
- 新增“普通话沟通与工程表达”页面，整理公开仓库 `mandarin-pronunciation-training` 的主要内容与更新日志，并结合机械设计工作中的沟通需求做归纳。
- 在[关于站点](index.md) 中补充站内提及人物的发布授权说明，并为“普通话沟通与工程表达”页面增加轻量提示与表格。
- 因 GitHub 仓库更名为 `bridge-between-engineers`，同步更新站内仓库链接、仓库元数据配置与本地 `origin` 地址。

## 2026-04-06

- 在 [致谢](acknowledgements.md) 中补充记录好友王芳佳关于 AI 协作、AI Native、任务拆解与知识沉淀方式的建议与启发。

## 2026-04-05

- 继续将站内导航、页面标题与首页文案收束为中文为主，减少不必要的信息负担。(王芳佳建议)
- 调整 About、Getting Started、Design、Manufacturing、Measurement 与 Modeling 栏目中的页面标题与说明文字，尽量统一全站表达风格。
- 明确 Vercel 失败邮件的来源为 `gh-pages` 分支触发的预览部署，而非 `main` 分支的正式构建失败。
- 依据 Vercel 控制台设置，补充 `gh-pages` 分支的跳过预览构建处理，减少无意义的失败提醒邮件。
- 新增 [AI 协作工作流](../design/ai-workflow.md) 页面，并补充行业资讯提问方法、OpenClaw 日报整理思路、`skill` 蒸馏与知识库沉淀方法。

## 2026-04-04

- 记录好友王芳佳通过 Pull Request 参与的功能优化，并在 [致谢](acknowledgements.md) 页面补充相关说明。
- 将远程仓库中已接受的搜索优化与日间、夜间模式切换优化，整合到当前本地较新的文档结构中，尽量同时保留双方成果。
- 在仓库配置文件 `mkdocs.yml` 中补充搜索 worker hook 与主题切换脚本接入。
- 新增 `docs/javascripts/theme-toggle.js`、`hooks/search_worker.py`、`scripts/custom_search_worker.js` 与 `scripts/verify_custom_search.js`。
- 本地执行 `python -m mkdocs build` 完成构建检查，确认搜索 worker 替换成功，当前站点可正常构建。

## 2026-03-31

- 调整 `mkdocs.yml`，统一导航命名与页面显示方式。
- 统一站点公开联系邮箱为 `contact@bridgezhang.com`。
- 重写[关于站点](index.md)与[建站说明](site-building.md)，补充 Logo 图片、版权登记信息、外部链接提示和更清晰的建站说明结构。
- 重构 [建模与图纸](../modeling/index.md) 栏目，按系列文章顺序重排导航，并从导航中移除 `cad-modeling.md`。
- 重写 [命名标准](../modeling/naming-standards.md)，按“引言、范围与目标、标准引用、实操与模板、同名文件冲突、参考来源”的结构重组内容。
- 新增 `modeling-method.md`、`parametric-modeling.md`、`configurations.md`、`drawing-template.md`、`exploded-view.md`、`bom-guide.md` 与 `revision-control.md` 等系列页面骨架。

## 2026-03-28

- 在 [建站说明](site-building.md) 中补充网站的建站缘起，说明本站以 GitHub 作为文档写作与长期维护平台的思路，并记录其受到 [SurviveSJTU/SurviveSJTUManual](https://github.com/SurviveSJTU/SurviveSJTUManual) 的启发与致谢。
- 在 `mkdocs.yml` 中补充仓库信息，并启用页面源码查看与编辑入口。
- 接入文档元数据插件，为页面底部补充最近更新、创建时间与贡献者信息，并同步调整构建依赖与 CI 配置。
- 新增[协作说明](collaboration.md)与版权许可说明。
- 补充 Python、pip 与 MkDocs 环境问题的极简记录。
- 新增 `vercel.json` 与 `.python-version`，逐步理顺 Vercel 的构建与部署配置。

## 2026-03-27

- 拆分[关于站点](index.md)与[建站说明](site-building.md)，将“站点介绍”与“建站复盘”分离。
- 调整 `关于` 导航结构，并统一 `about` 目录下页面的标题、命名与说明文字。
- 为非首页内容页增加 `打印` 按钮，并补充打印样式。
- 为建站说明中的常用命令补充注释，便于日后复用与回看。
- 新增 [致谢](acknowledgements.md) 页面，用于记录他人的建议与帮助。

## 2026-03-26

- 重写[关于站点](index.md)页面，将原先偏流水记录的内容整理为更适合复盘与分享的结构化说明。
- 重构站点建设思路，补充建站目标、工作流、部署关系、关键经验与后续方向等内容。
- 为站点说明页增加 Admonitions、Mermaid 流程图与表格，提升可读性。

## 2026-03-24

- 提交 [命名标准](../modeling/naming-standards.md) 初稿。
- 调整首页部分表述，使措辞更准确。

## 2026-03-22

- 参考 [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) 的模板思路，结合项目内容完成首页的最小化重构。
