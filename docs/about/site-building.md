# 建站说明

- 在页面底层样式控制、部分组件(如页面底部的社交媒体图标/链接)的实现等网站技术方面，都得益于Codex、GitHub Copilot Chat的帮助，甚至很多是它们直接生成的；也得益于好友王芳佳的指导。自己集成了这些技术，绝大部分精力集中在对机械内容的思考、整理、交流方面。
- 在利用GitHub作为源站及信息呈现方面，受到 [SurviveSJTU/SurviveSJTUManual](https://github.com/SurviveSJTU/SurviveSJTUManual) 项目的启发较多，表示感谢。
- 本文档站首页采用了 Material for MkDocs 的模板思路（`template: home.html` + `overrides/home.html`），并结合本站内容做了最小化重构。感谢 [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) 提供的优秀主题与设计参考。



## 1. 建站简述

目前本站的基本链路及其作用依次呈现为下表：

| 环节 | 主要工具 | 作用 |
| --- | --- | --- |
| 写作 | Markdown、[VS Code](https://code.visualstudio.com/) | 负责内容生产与结构整理 |
| 预览 | [MkDocs](https://www.mkdocs.org/) | 本地查看页面渲染效果 |
| 版本管理 | Git、[GitHub](https://github.com/) | 记录修改、同步内容、保留历史 |
| 部署 | GitHub Actions、[Vercel](https://vercel.com/) | 自动构建并发布站点 |
| 访问 | [NameSilo](https://namesilo.com/)、[Cloudflare](https://www.cloudflare.com/) | 域名注册、Cloudflare | 域名持有、DNS 解析与访问链路管理 |

- VS Code本地写作，实现实时预览 MkDocs 渲染效果，更方便地管理图片、样式和目录结构，集成AI助手。
- Vercel,`CDN` 解决“内容如何更高效分发”的问题，对于提升文档站的可访问性有较大帮助。
- GitHub 适合做版本管理、迁移成本相对较低、具备较强的公开协作属性。
- MkDocs 本质上是一个基于 Python 的静态文档站点生成器，而 Material for MkDocs 则提供了成熟、专业、统一的视觉框架。

## 2. 经验小结

### 2.1. 渲染差异不是“写错了”，而是规则不同

GitHub 与 MkDocs Material 对 Markdown 的处理并不完全一致，尤其体现在列表、缩进、超链接样式等方面。

其中有两点特别值得记住：

1. 列表要写得更规范，尤其是嵌套列表前后的空行与缩进。
2. 链接是否带下划线，很多时候不是 Markdown 语法问题，而是 CSS 样式选择问题。

例如，为了让部分链接样式更清晰，AI增加了 `docs/stylesheets/extra.css`，并在 `mkdocs.yml` 中引用它。这属于表现层优化，而不是内容层错误。

!!! example "更稳妥的写法习惯"
    子列表前后保留空行，缩进保持一致，能显著减少不同渲染器下的显示偏差。

### 2.2. 命名规则必须尽早统一

如果文件命名、标题格式和链接路径一开始不统一，后面维护成本会明显增加。

!!! tip "规则先行的价值"
    早一点统一命名和排版规则，后面每新增一篇文档都会更轻松。

### 2.3. 心得体会

- 个人网站首先是内容工程，其次才是页面工程。
- 稳定的工作流，比一次性堆很多功能更重要。
- AI 最适合处理整理、格式化、重写、对比与解释工作，但最终判断仍要靠人自己。

## 3. 工具层面的认识

### 3.1. Python

这里的 Python 主要不是为了做复杂开发，而是作为 MkDocs 的运行基础。

常用检查命令如下：

```powershell
python --version                     # 检查 Python 是否已安装及版本信息
python -m pip install mkdocs-material  # 安装 MkDocs Material 及其依赖
python -m mkdocs --version           # 检查 MkDocs 是否可正常调用
git --version                        # 检查 Git 是否已安装
```

如果环境变量配置不完整，直接使用 `python -m ...` 往往比单独调用 `pip` 或 `mkdocs` 更稳妥。

若依赖安装受网络环境影响，也可以考虑使用合适的国内镜像源。

!!! tip "一个更稳妥的习惯"
    在 Windows 环境中，即使 `python` 已经可用，`pip` 或 `mkdocs` 也不一定能直接作为独立命令使用。

    如果碰到这种情况，优先尝试 `python -m pip ...` 与 `python -m mkdocs ...`，通常更稳定。

### 3.2. Python / pip / MkDocs 环境问题极简总结

1. 核心问题往往不是“装没装过”，而是安装类型和 `PATH` 是否正确。
2. 安装 Python 时，应选择完整版安装包，而不是 `Python Install Manager`。
3. 安装过程中，`Add Python to PATH` 是最关键的一步。
4. 环境是否正常，最直接的判断方式是看以下命令能否正常输出：

```powershell
python --version              # 检查 Python 是否可用
python -m pip --version       # 检查 pip 是否可通过 Python 调用
python -m mkdocs --version    # 检查 MkDocs 是否可通过 Python 调用
```

一句话理解就是：命令能不能直接使用，取决于它是否在 `PATH` 中，而不只是“是否安装过”。

