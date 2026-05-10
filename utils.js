// ========================================
// 工具函式
// ========================================

const axios = require('axios');
const dayjs = require('dayjs');

function handleAxiosError(error) {
	if (axios.isAxiosError(error)) {
		return {
			status: error.response?.status,
			message: error.message,
		}
	}

	throw error;
}

/**
 * 計算產品折扣率
 * @param {Object} product - 產品物件
 * @returns {string} - 例如 '8折'
 */
function getDiscountRate(product) {
	const {
		price,
		origin_price,
	} = product;

	const rate = Math.round(price / origin_price * 10);

	return `${rate}折`;
}

/**
 * 取得所有產品分類（不重複）
 * @param {Array} products - 產品陣列
 * @returns {Array} - 分類陣列
 */
function getAllCategories(products) {
	const categorySet = new Set();

	products.forEach(product => {
		if (!categorySet.has(product.category)) {
			categorySet.add(product.category);
		}
	})

	return Array.from(categorySet);
}

/**
 * 格式化日期
 * @param {number} timestamp - Unix timestamp
 * @returns {string} - 格式 'YYYY/MM/DD HH:mm'，例如 '2024/01/01 08:00'
 */
function formatDate(timestamp) {
	return dayjs.unix(timestamp).format('YYYY/MM/DD HH:mm');
}

/**
 * 計算距今天數
 * @param {number} timestamp - Unix timestamp
 * @returns {string} - 例如 '3 天前'
 */
function getDaysAgo(timestamp) {
	const now = dayjs();
	const diff = now.diff(dayjs.unix(timestamp), 'day');

	if (!diff) {
		return '今天'
	}

	return `${diff} 天前`;
}

/**
 * 驗證訂單使用者資料
 * @param {Object} data - 使用者資料
 * @returns {Object} - { isValid: boolean, errors: string[] }
 *
 * 驗證規則：
 * - name: 不可為空
 * - tel: 必須是 09 開頭的 10 位數字
 * - email: 必須包含 @ 符號
 * - address: 不可為空
 * - payment: 必須是 'ATM', 'Credit Card', 'Apple Pay' 其中之一
 */
function validateOrderUser(data) {
	const errors = [];

	if (!data) {
		errors.push('資料不可為空');

		return {
			isValid: false,
			errors,
		}
	}

	const {
		name,
		tel,
		email,
		address,
		payment,
	} = data;

	const telRegex = /^09\d{8}$/;
	const paymentMethodSet = new Set(['ATM', 'Credit Card', 'Apple Pay']);

	if (!name) {
		errors.push('不可為空');
	}

	if (!tel || !telRegex.test(tel)) {
		errors.push('必須是 09 開頭的 10 位數字');
	}

	if (!email || !email.includes('@')) {
		errors.push('必須包含 @ 符號');
	}

	if (!address) {
		errors.push('不可為空');
	}

	if (!payment || !paymentMethodSet.has(payment)) {
		errors.push('必須是 "ATM", "Credit Card", "Apple Pay" 其中之一');
	}

	return {
		isValid: errors.length === 0,
		errors,
	}
}

/**
 * 驗證購物車數量
 * @param {number} quantity - 數量
 * @returns {Object} - { isValid: boolean, error?: string }
 *
 * 驗證規則：
 * - 必須是正整數
 * - 不可小於 1
 * - 不可大於 99
 */
function validateCartQuantity(quantity) {
	const q = Number(quantity);
	const MIN = 1;
	const MAX = 99;
	let error = '';

	if (quantity === null || Number.isNaN(q)) {
		error = '需為有效數字';
	} else if (!q || !Number.isInteger(q)) {
		error = '必須是正整數';
	} else if (q < MIN) {
		error = `不可小於 ${MIN}`;
	} else if (q > MAX) {
		error = `不可大於 ${MAX}`;
	}

	return {
		isValid: error.length === 0,
		error,
	}
}

/**
 * 格式化金額
 * @param {number} amount - 金額
 * @returns {string} - 格式化後的金額
 *
 * 格式化規則：
 * - 加上 "NT$ " 前綴
 * - 數字需要千分位逗號分隔（例如：1000 → 1,000）
 * - 使用台灣格式（zh-TW）
 *
 * 範例：
 * formatCurrency(1000) → "NT$ 1,000"
 * formatCurrency(1234567) → "NT$ 1,234,567"
 *
 */
function formatCurrency(amount) {
	const formatted = new Intl.NumberFormat('zh-TW').format(amount);
	return `NT$ ${formatted}`;
}

module.exports = {
	handleAxiosError,
	getDiscountRate,
	getAllCategories,
	formatDate,
	getDaysAgo,
	validateOrderUser,
	validateCartQuantity,
	formatCurrency
};
