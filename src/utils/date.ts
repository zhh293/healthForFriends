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

