/**
 * 日期工具函数
 */

/**
 * 获取当前日期的 YYYY-MM-DD 格式字符串
 */
export function getCurrentDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * 格式化日期为中文格式：YYYY年MM月DD日
 */
export function formatDateChinese(dateStr: string): string {
    const [year, month, day] = dateStr.split('-');
    return `${year}年${month}月${day}日`;
}

/**
 * 获取当前时间戳
 */
export function getCurrentTimestamp(): string {
    return new Date().toISOString();
}

/**
 * 检查两个日期字符串是否为同一天
 */
export function isSameDay(date1: string, date2: string): boolean {
    return date1 === date2;
}

/**
 * 将 YYYY-MM-DD 转换为 Date 对象
 */
function parseDate(dateStr: string): Date {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
}

/**
 * 将 Date 转换为 YYYY-MM-DD
 */
function formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

/**
 * 获取某日期所在周的周一（作为一周开始），若未传入则以今天为基准
 */
export function getWeekStart(baseDateStr?: string): string {
    const base = baseDateStr ? parseDate(baseDateStr) : new Date();
    const day = base.getDay(); // 0: 周日, 1-6: 周一到周六
    const diffToMonday = day === 0 ? -6 : 1 - day; // 将周日归到上周，周一为起点
    const monday = new Date(base);
    monday.setDate(base.getDate() + diffToMonday);
    return formatDate(monday);
}

/**
 * 获取一周 7 天的日期数组（YYYY-MM-DD），从周一开始
 */
export function getWeekDates(baseDateStr?: string): string[] {
    const start = parseDate(getWeekStart(baseDateStr));
    const dates: string[] = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        dates.push(formatDate(d));
    }
    return dates;
}

/**
 * 中文周几标签：周一、周二...
 */
export function getChineseWeekday(dateStr: string): string {
    const date = parseDate(dateStr);
    const map = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return map[date.getDay()];
}

/**
 * 短日期格式：MM/DD
 */
export function formatDateShort(dateStr: string): string {
    const [, m, d] = dateStr.split('-');
    return `${m}/${d}`;
}

/**
 * 获取某日期所在周范围字符串：YYYY-MM-DD ~ YYYY-MM-DD
 */
export function getWeekRangeLabel(baseDateStr?: string): string {
    const week = getWeekDates(baseDateStr);
    return `${week[0]} ~ ${week[6]}`;
}

