# 更新日志

本页用于记录本站较重要的内容更新、结构调整与页面优化。

## September 6, 2026 (提升效率)

- September 6, 2026，在Vs code中编辑文档，图片仅需名称即可，而后交由AI完成特定路径下的图片的引用，当然只需要<mark>给出一个示例引用即可</mark>。
- September 7, 2026，由Copilot AI协助在VS code IDE中实现如下快捷键功能：
    - Markdown 选中文本后，右键选择 Highlight Mark: Toggle Selection，可实现<mark>黄色背景强调内容</mark>
    - 快捷键：Ctrl+Alt+H
    - 再次执行可移除已有的 <mark> 标签
    - 仅在 Markdown 文件且存在选区时显示。
    - October 17, 2026，基于同样的逻辑，<mark>扩展右键菜单新增 Admonitions 子菜单</mark>，包含 note、abstract、info 等 12 种类型；选择 Markdown 文本和类型后，可自动生成相应的 Admonition 块。
    - October 17, 2026，<mark>新增 Insert Figures 图片插入子菜单</mark>，支持 Single Figure 与 Two Parallel，后者需要选择2张图片用于并排；选择图片后，自动生成图片引用、相对路径和图注，并记住上次选择的图片文件夹。双图布局在宽屏下并排显示，在窄屏下自动切换为单列。注意：图片替代文本和题注仅保留文件名最后一个“ _ ”后的部分（不含扩展名），如 `bbe_docs_design_tolerances-on-linear-sizes_Fundamental-Deviation-Schematic-Figure.jpg` 显示为 `Fundamental-Deviation-Schematic-Figure`；图片引用路径仍保留完整文件名。若文件名没有“ _ ”或其后无内容，则使用完整文件名。
- May 25, 2026，创建工具：建立了push-to-github.bat批处理文件，在修改commit的内容后，能自动截取日期+ commit，而后push到GitHub，提升了效率。每次需要输入新的commit。
    - September 11, 2026，创建工具：基于May 25, 2026的工作，利用AI制作一个简易的弹窗，能输入commit，并且能记录每次的commit，供后面复用。
    - 在terminal里，相应文件夹下，运行 .\push-to-github.bat即可。
    - 历史提交列表只显示“实质内容”，日期会由脚本自动补到最终提交信息里。

## August 29, 2026 (关于栏目文章)

- 增加页面底部浏览量统计的显示功能。
- 精简了关于/about栏目下的所有文章(包括本更新日志)，使信息更简洁、高效。

## July 11, 2026 (制造栏目文章)

- 自May 25, 2026以来，逐步完善了制造栏目下的部分文章。
- 如[热处理知识框架](../manufacturing/heat-treatment.md)、[热处理基础](../manufacturing/heat-treatment-foundations.md) 等页面。

## June 7, 2026 (建模与图纸栏目文章)

- 新增该栏目下软件版权 页面，作为 SolidWorks 建模与图纸系列的补充文章。
- 后续也有补充该系列的其余文章。

## May 31, 2026 (文档站合规性记录)

- 记录微信外部链接访问警告与申诉恢复过程，并补充审核结果截图，方便日后回看站点公开访问链路中的实际问题。
- 调整页脚脚本与样式，在底部增加“关于备案”入口，并继续保留“版权与许可”链接。

## May 4, 2026 (建模与图纸栏目文章)

- 自March 24, 2026提交 [命名标准](../modeling/naming-standards.md) 初稿，业余时间断续补充[建模与图纸](../modeling/index.md) 系列文章。
- 五一节假期更集中的完成了部分内容，May 4, 2026完成[建模与图纸](../modeling/index.md) 系列文章初版。

## April 5, 2026 (关于AI的讨论)

- 与王芳佳讨论，新增 [AI 协作工作流](../design/ai-workflow.md) 页面，并补充行业资讯提问方法、OpenClaw 日报整理思路、`skill` 蒸馏与知识库沉淀方法。

## March 22, 2026 (文档站建站记录)

- 自March 22, 2026，参考 [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) 的模板思路，结合项目内容完成首页的最小化重构。
- 并陆续完成如下内容：
    - 为非首页内容页增加 `Print` 按钮，并补充打印样式。
    - 接入文档元数据插件，为页面底部补充最近更新、创建时间与贡献者信息，并同步调整构建依赖与 CI 配置。创建时间的数据来源比较复杂，codex在后期完善了两轮(May 4, 2026)方逐步稳定。
    - 新增 `vercel.json` 与 `.python-version`，逐步理顺 Vercel 的构建与部署配置。
    - 统一站点公开联系邮箱为 `contact@bridgezhang.com`。
    - April 4, 2026，王芳佳协助完成搜索优化与日间、夜间模式切换优化。
    - 完成关于/about栏目下的介绍文章。
    - September 27, 2026，新增 cookie 同意管理功能，提升用户隐私保护体验。
    - October 31, 2026，GitHub Actions 的 `python-version: 3.x` 自动选择了 Python 3.15，导致当前 Pillow 依赖无法安装：没有适配的预编译包，源码构建又缺少 JPEG 开发库，因而 MkDocs 部署未执行。随后将 CI Python 固定为 3.13。网站仍可访问是因为 Vercel 部署链路独立于该 Actions 工作流，并不代表 GitHub Actions 成功。
- 上述内容的初步完成，基本使文档站形成雏形。
