#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
add-course.py - 课程管理脚本

用法:
    python3 add-course.py                    # 交互式添加新课程
    python3 add-course.py <course-dir>       # 从课程目录同步信息到主页
    python3 add-course.py --list             # 列出所有课程
    python3 add-course.py --remove           # 删除课程
    python3 add-course.py --help             # 帮助

同步模式说明:
    扫描 <course-dir>/lessons/ 下的 HTML 文件，提取课程标题，
    自动更新 courses.js。如果课程已存在，保留原有阶段划分和元信息，
    只更新课节列表；如果课程不存在，交互式录入元信息。
"""
import json
import os
import re
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
COURSES_FILE = os.path.join(BASE_DIR, "courses.js")

PRESET_GRADIENTS = {
    "1": ("蓝", "#1e3a8a, #0ea5e9"),
    "2": ("橙", "#7c2d12, #f97316"),
    "3": ("绿", "#14532d, #22c55e"),
    "4": ("紫", "#581c87, #a855f7"),
    "5": ("红", "#7f1d1d, #ef4444"),
    "6": ("青", "#134e4a, #14b8a6"),
    "7": ("粉", "#831843, #ec4899"),
    "8": ("灰", "#1f2937, #6b7280"),
}


# ─── 数据读写 ───────────────────────────────────────

def load_courses():
    """从 courses.js 读取 COURSES 数组，返回 list。"""
    with open(COURSES_FILE, "r", encoding="utf-8") as f:
        content = f.read()
    m = re.search(r"const\s+COURSES\s*=\s*(\[.*\])\s*;", content, re.DOTALL)
    if not m:
        print("错误：无法从 courses.js 解析 COURSES 数组")
        sys.exit(1)
    js_array = m.group(1)
    fixed = re.sub(r"([{,]\s*)([a-zA-Z_]\w*)\s*:", r'\1"\2":', js_array)
    return json.loads(fixed)


def save_courses(courses):
    """把 courses list 写回 courses.js。"""
    lines = [
        "// courses.js —— 个人主页「作品墙」数据（由 add-course.py 生成/维护，可手动补充 github/video/date/highlights）",
        "// index.html 会把这里的每一门课程渲染成作品墙里的一张卡片。",
        "// 字段说明：",
        "//   title/gradient  —— 卡片标题、封面渐变色",
        "//   status/desc    —— 卡片状态标签、简介",
        "//   stats/stages   —— 卡片弹窗里的统计与课节目录",
        "//   path           —— 课程目录名（教程入口据此打开 lessons/*.html）",
        "//   github         —— 可选：GitHub 仓库链接；留空/删除则卡片不显示 GitHub 角标",
        "//   video          —— 可选：视频链接；留空/删除则卡片不显示视频角标",
        "//   date           —— 可选：预告项目的预计上线时间",
        "//   highlights     —— 可选：作者亮点标签（多个，抓眼球）",
        "// 数组内部不要写 // 行内注释（本脚本按 JSON 解析数组）。",
        "const COURSES = [",
    ]
    for i, course in enumerate(courses):
        lines.append("  {")
        lines.append(f'    title: {json.dumps(course["title"], ensure_ascii=False)},')
        lines.append(f'    status: {json.dumps(course["status"], ensure_ascii=False)},')
        lines.append(f'    desc: {json.dumps(course["desc"], ensure_ascii=False)},')
        stats_str = ", ".join(
            f'{{ big: {json.dumps(s["big"], ensure_ascii=False)}, lbl: {json.dumps(s["lbl"], ensure_ascii=False)} }}'
            for s in course["stats"]
        )
        lines.append(f"    stats: [{stats_str}],")
        lines.append(f'    gradient: {json.dumps(course["gradient"], ensure_ascii=False)},')
        lines.append(f'    path: {json.dumps(course["path"], ensure_ascii=False)},')
        # 可选关联入口（在 courses.js 手动配置，同步时原样保留，不丢失）
        for key in ("github", "video", "date", "highlights"):
            if course.get(key):
                lines.append(f'    {key}: {json.dumps(course[key], ensure_ascii=False)},')
        lines.append("    stages: [")
        for j, stage in enumerate(course["stages"]):
            lines.append(f'      {{ name: {json.dumps(stage["name"], ensure_ascii=False)}, lessons: [')
            for k, lesson in enumerate(stage["lessons"]):
                comma = "," if k < len(stage["lessons"]) - 1 else ""
                lines.append(
                    f'        {{ n: {json.dumps(lesson["n"], ensure_ascii=False)}, '
                    f't: {json.dumps(lesson["t"], ensure_ascii=False)}, '
                    f'f: {json.dumps(lesson["f"], ensure_ascii=False)} }}{comma}'
                )
            stage_comma = "," if j < len(course["stages"]) - 1 else ""
            lines.append(f"      ]}}{stage_comma}")
        lines.append("    ]")
        course_comma = "," if i < len(courses) - 1 else ""
        lines.append(f"  }}{course_comma}")
    lines.append("];")
    with open(COURSES_FILE, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")


# ─── 提取工具 ───────────────────────────────────────

def extract_lesson_title(filepath):
    """从 HTML 文件提取课程标题。优先 <title>，其次 <h1>，最后用文件名。"""
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read(2000)  # 只读前 2000 字符够找 title 了
    except Exception:
        return None

    # <title>第 N 课 · 标题</title> → 标题
    m = re.search(r"<title>(.*?)</title>", content, re.DOTALL)
    if m:
        title = m.group(1).strip()
        # 去掉 "第 N 课 · " 前缀
        title = re.sub(r"^第\s*\d+\s*课\s*[·•：:]\s*", "", title)
        return title if title else None

    # <h1>标题</h1>
    m = re.search(r"<h1[^>]*>(.*?)</h1>", content, re.DOTALL)
    if m:
        title = re.sub(r"<[^>]+>", "", m.group(1)).strip()
        title = re.sub(r"^第\s*\d+\s*课\s*[·•：:]\s*", "", title)
        return title if title else None

    return None


def extract_course_title_from_mission(course_dir):
    """尝试从 MISSION.md 提取课程标题。"""
    mission_path = os.path.join(course_dir, "MISSION.md")
    if not os.path.exists(mission_path):
        return None
    try:
        with open(mission_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line.startswith("#"):
                    # # Mission: 从零构建... → 从零构建...
                    title = re.sub(r"^#+\s*(Mission|使命)\s*[:：]?\s*", "", line, flags=re.IGNORECASE)
                    return title if title else None
    except Exception:
        pass
    return None


def scan_lessons(lessons_dir):
    """扫描 lessons 目录，返回排序后的 [{n, t, f}] 列表。"""
    html_files = sorted([f for f in os.listdir(lessons_dir) if f.endswith(".html")])
    lessons = []
    for i, fname in enumerate(html_files, 1):
        title = extract_lesson_title(os.path.join(lessons_dir, fname))
        if not title:
            # 用文件名兜底
            title = fname.replace(".html", "").replace("-", " ")
        lessons.append({"n": f"{i:02d}", "t": title, "f": fname})
    return lessons


def calc_stats(stages):
    """根据阶段数据计算 stats。"""
    total = sum(len(s["lessons"]) for s in stages)
    return [
        {"big": str(total), "lbl": "节课"},
        {"big": str(len(stages)), "lbl": "阶段"},
        {"big": f"~{total * 15}min", "lbl": "总时长"},
    ]


# ─── 同步模式 ───────────────────────────────────────

def sync_course(path):
    """从课程目录同步信息到 courses.js。"""
    course_dir = os.path.join(BASE_DIR, path)
    lessons_dir = os.path.join(course_dir, "lessons")

    print(f"\n{'='*50}")
    print(f"  同步课程: {path}")
    print(f"{'='*50}")

    if not os.path.isdir(lessons_dir):
        print(f"错误：找不到 {path}/lessons/ 目录")
        return

    # 扫描 HTML 文件
    scanned_lessons = scan_lessons(lessons_dir)
    if not scanned_lessons:
        print(f"错误：{path}/lessons/ 下没有 HTML 文件")
        return

    print(f"\n扫描到 {len(scanned_lessons)} 个课节:")
    for l in scanned_lessons:
        print(f"  {l['n']}  {l['t']}  ({l['f']})")

    courses = load_courses()
    existing_idx = None
    for i, c in enumerate(courses):
        if c["path"] == path:
            existing_idx = i
            break

    if existing_idx is not None:
        _sync_existing(courses, existing_idx, scanned_lessons)
    else:
        _sync_new(courses, path, course_dir, scanned_lessons)


def _sync_existing(courses, idx, scanned_lessons):
    """更新已有课程：保留元信息和阶段划分，同步课节列表。"""
    course = courses[idx]
    print(f"\n课程已存在: {course['title']}")
    print(f"保留原有元信息（标题、标签、描述、渐变色、阶段划分）\n")

    # 收集已有课节文件名 → 位置映射
    old_lesson_map = {}  # filename → (stage_idx, lesson_idx, lesson_obj)
    for si, stage in enumerate(course["stages"]):
        for li, lesson in enumerate(stage["lessons"]):
            old_lesson_map[lesson["f"]] = (si, li, lesson)

    scanned_files = {l["f"] for l in scanned_lessons}
    old_files = set(old_lesson_map.keys())

    new_files = scanned_files - old_files
    deleted_files = old_files - scanned_files

    # 更新已有课节标题
    updated_count = 0
    for l in scanned_lessons:
        if l["f"] in old_lesson_map:
            si, li, old_lesson = old_lesson_map[l["f"]]
            if old_lesson["t"] != l["t"]:
                old_lesson["t"] = l["t"]
                updated_count += 1

    # 处理新增课节
    if new_files:
        print(f"发现 {len(new_files)} 个新课节文件:")
        new_lessons = [l for l in scanned_lessons if l["f"] in new_files]
        for l in new_lessons:
            print(f"  + {l['n']}  {l['t']}  ({l['f']})")

        # 重新编号所有课节并分配到阶段
        # 新课节追加到最后一个阶段
        last_stage = course["stages"][-1]
        for l in new_lessons:
            last_stage["lessons"].append(l)
        print(f"  → 已添加到「{last_stage['name']}」")

    # 处理已删除课节
    if deleted_files:
        print(f"\n发现 {len(deleted_files)} 个已删除的课节:")
        for fname in sorted(deleted_files):
            si, li, old_lesson = old_lesson_map[fname]
            print(f"  - {old_lesson['n']}  {old_lesson['t']}  ({fname})")
        confirm = input("\n从课程中移除这些课节？(y/n) [y]: ").strip().lower() or "y"
        if confirm == "y":
            for stage in course["stages"]:
                stage["lessons"] = [l for l in stage["lessons"] if l["f"] not in deleted_files]
            # 清理空阶段
            course["stages"] = [s for s in course["stages"] if s["lessons"]]
            print("  → 已移除")
        else:
            print("  → 保留（但文件已不存在，链接会失效）")

    # 重新编号
    counter = 0
    for stage in course["stages"]:
        for lesson in stage["lessons"]:
            counter += 1
            lesson["n"] = f"{counter:02d}"

    # 更新 stats
    course["stats"] = calc_stats(course["stages"])

    if updated_count:
        print(f"\n更新了 {updated_count} 个课节的标题")

    courses[idx] = course
    save_courses(courses)

    total = sum(len(s["lessons"]) for s in course["stages"])
    print(f"\n✓ 已同步「{course['title']}」: {total} 课 / {len(course['stages'])} 阶段")
    print(f"  打开 index.html 查看效果")


def _sync_new(courses, path, course_dir, scanned_lessons):
    """新课程：交互式录入元信息。"""
    print(f"\n课程不存在于 courses.js，开始录入元信息。\n")

    # 尝试从 MISSION.md 提取标题
    guessed_title = extract_course_title_from_mission(course_dir)

    title = input(f"课程标题{f' [{guessed_title}]' if guessed_title else ''}: ").strip()
    if not title:
        title = guessed_title or path
    if not title:
        print("标题不能为空，已取消。")
        return

    status = input(f"状态标签 [筹备中 · 1阶段]: ").strip() or "筹备中 · 1阶段"
    desc = input("课程描述（一句话）: ").strip()
    if not desc:
        desc = title

    # 渐变色
    print("\n预设渐变色:")
    for k, (name, colors) in PRESET_GRADIENTS.items():
        print(f"  {k}. {name}  ({colors})")
    gradient_input = input("选择编号，或直接输入自定义色 (如 #1e3a8a, #0ea5e9) [1]: ").strip() or "1"
    gradient = PRESET_GRADIENTS.get(gradient_input, (None, gradient_input))[1]

    # 阶段划分
    print(f"\n共 {len(scanned_lessons)} 个课节。")
    print("请划分阶段，格式: 阶段名:起始课号-结束课号,阶段名:...")
    print("例如: 基础:1-6,能用:7-8,进阶:9-14")
    print("留空则全部放入单个阶段")
    stage_input = input("阶段划分: ").strip()

    if not stage_input:
        stages = [{"name": "全部课程", "lessons": scanned_lessons}]
    else:
        stages = []
        # 解析 "基础:1-6,能用:7-8,进阶:9-14"
        for part in stage_input.split(","):
            part = part.strip()
            if not part:
                continue
            # 匹配 名称:起-止
            m = re.match(r"^(.+):(\d+)-(\d+)$", part)
            if m:
                name = m.group(1).strip()
                start = int(m.group(2))
                end = int(m.group(3))
                stage_lessons = [
                    l for l in scanned_lessons
                    if start <= int(l["n"]) <= end
                ]
                if stage_lessons:
                    stages.append({"name": name, "lessons": stage_lessons})
            else:
                print(f"  忽略无法解析的部分: {part}")

        if not stages:
            print("未能解析任何阶段，使用单个阶段。")
            stages = [{"name": "全部课程", "lessons": scanned_lessons}]

    stats = calc_stats(stages)

    course = {
        "title": title,
        "status": status,
        "desc": desc,
        "stats": stats,
        "gradient": gradient,
        "path": path,
        "stages": stages,
    }

    # 预览
    print(f"\n{'─'*50}")
    print(f"课程预览:")
    print(f"  标题: {title}")
    print(f"  标签: {status}")
    print(f"  描述: {desc}")
    print(f"  渐变: {gradient}")
    print(f"  目录: {path}")
    total = sum(len(s["lessons"]) for s in stages)
    print(f"  统计: {total} 课 / {len(stages)} 阶段")
    for s in stages:
        print(f"    {s['name']} ({len(s['lessons'])} 课)")
    print(f"{'─'*50}")

    confirm = input("\n确认添加？(y/n) [y]: ").strip().lower() or "y"
    if confirm != "y":
        print("已取消。")
        return

    courses.append(course)
    save_courses(courses)
    print(f"\n✓ 已添加课程「{title}」到 courses.js")
    print(f"  打开 index.html 查看效果")


# ─── 交互式添加 ─────────────────────────────────────

def prompt(msg, default=None):
    if default is not None:
        s = input(f"{msg} [{default}]: ").strip()
        return s if s else default
    return input(f"{msg}: ").strip()


def pick_gradient():
    print("\n预设渐变色:")
    for k, (name, colors) in PRESET_GRADIENTS.items():
        print(f"  {k}. {name}  ({colors})")
    choice = prompt("\n选择编号，或直接输入自定义色", "1")
    if choice in PRESET_GRADIENTS:
        return PRESET_GRADIENTS[choice][1]
    return choice


def slugify(text):
    s = re.sub(r"[^\w\s-]", "", text.lower())
    s = re.sub(r"[\s_]+", "-", s).strip("-")
    s = re.sub(r"[^a-z0-9-]", "", s)
    return s or "lesson"


def add_course_interactive():
    """交互式从零创建新课程（含目录和占位文件）。"""
    print(f"\n{'='*50}")
    print("  添加新课程")
    print(f"{'='*50}")

    title = prompt("课程标题")
    if not title:
        print("标题不能为空，已取消。")
        return
    status = prompt("状态标签", "筹备中 · 1阶段")
    desc = prompt("课程描述（一句话）")
    if not desc:
        desc = title
    gradient = pick_gradient()
    path = prompt("课程目录名 (英文，如 rust-basics)")
    if not path:
        path = slugify(title) or "course"

    course_dir = os.path.join(BASE_DIR, path, "lessons")
    os.makedirs(course_dir, exist_ok=True)
    print(f"\n已创建目录: {path}/lessons/")

    stages = []
    lesson_counter = 0
    stage_idx = 0
    while True:
        stage_idx += 1
        stage_name = prompt(f"\n--- 阶段 {stage_idx} 名称 (留空结束录入)")
        if not stage_name:
            break
        lessons = []
        lesson_idx = 0
        while True:
            lesson_idx += 1
            lesson_counter += 1
            n = f"{lesson_counter:02d}"
            t = prompt(f"  课程 {n} 标题 (留空结束本阶段)")
            if not t:
                lesson_counter -= 1
                break
            default_f = f"{lesson_counter:04d}-{slugify(t)}.html"
            f_name = prompt(f"  文件名", default_f)
            lessons.append({"n": n, "t": t, "f": f_name})
            fpath = os.path.join(course_dir, f_name)
            if not os.path.exists(fpath):
                with open(fpath, "w", encoding="utf-8") as fp:
                    fp.write(f"<!-- {t} -->\n")
        if not lessons:
            print("  该阶段没有课程，已跳过。")
            stage_idx -= 1
            continue
        stages.append({"name": stage_name, "lessons": lessons})

    if not stages:
        print("没有录入任何阶段，已取消。")
        return

    stats = calc_stats(stages)
    course = {
        "title": title, "status": status, "desc": desc,
        "stats": stats, "gradient": gradient, "path": path, "stages": stages,
    }

    print(f"\n{'─'*50}")
    print("课程预览:")
    print(f"  标题: {title}")
    print(f"  标签: {status}")
    print(f"  描述: {desc}")
    print(f"  渐变: {gradient}")
    print(f"  目录: {path}")
    total = sum(len(s["lessons"]) for s in stages)
    print(f"  统计: {total} 课 / {len(stages)} 阶段")
    for s in stages:
        print(f"    {s['name']}")
        for l in s["lessons"]:
            print(f"      {l['n']}  {l['t']}  ({l['f']})")
    print(f"{'─'*50}")
    confirm = prompt("\n确认添加？(y/n)", "y")
    if confirm.lower() != "y":
        print("已取消。")
        return

    courses = load_courses()
    courses.append(course)
    save_courses(courses)
    print(f"\n✓ 已添加课程「{title}」到 courses.js")
    print(f"✓ 已创建 {path}/lessons/ 目录和 {total} 个占位文件")


def list_courses():
    courses = load_courses()
    print(f"\n共 {len(courses)} 门课程:\n")
    for i, c in enumerate(courses):
        total = sum(len(s["lessons"]) for s in c["stages"])
        print(f"  [{i}] {c['title']}")
        print(f"      {c['status']} · {total} 课 · {c['path']}/")
        for s in c["stages"]:
            print(f"        {s['name']} ({len(s['lessons'])} 课)")
        print()


def remove_course():
    list_courses()
    courses = load_courses()
    if not courses:
        return
    idx_str = prompt("输入要删除的课程编号 (留空取消)")
    if not idx_str:
        return
    try:
        idx = int(idx_str)
    except ValueError:
        print("无效编号。")
        return
    if idx < 0 or idx >= len(courses):
        print("编号超出范围。")
        return
    c = courses[idx]
    confirm = prompt(f"确认删除「{c['title']}」？目录 {c['path']}/ 保留 (y/n)", "n")
    if confirm.lower() != "y":
        print("已取消。")
        return
    courses.pop(idx)
    save_courses(courses)
    print(f"\n✓ 已从 courses.js 删除「{c['title']}」")


# ─── 主入口 ─────────────────────────────────────────

def main():
    if len(sys.argv) > 1:
        arg = sys.argv[1]
        if arg == "--list":
            list_courses()
        elif arg == "--remove":
            remove_course()
        elif arg in ("-h", "--help"):
            print(__doc__)
        elif arg.startswith("--"):
            print(f"未知参数: {arg}\n")
            print(__doc__)
        else:
            sync_course(arg)
    else:
        add_course_interactive()


if __name__ == "__main__":
    main()
