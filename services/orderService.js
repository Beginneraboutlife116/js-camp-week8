// ========================================
// 訂單服務
// ========================================

const { createOrder, fetchOrders, updateOrderStatus, deleteOrder } = require('../api');
const { validateOrderUser, formatDate, getDaysAgo, formatCurrency } = require('../utils');

/**
 * 建立新訂單
 * @param {Object} userInfo - 使用者資料
 * @returns {Promise<Object>}
 */
async function placeOrder(userInfo) {
	const { isValid, errors } = validateOrderUser(userInfo);

	if (!isValid) {
		return {
			success: false,
			errors,
		}
	}

	try {
		const order = await createOrder(userInfo);

		return {
			success: true,
			data: order,
		}
	} catch (err) {
		return {
			success: false,
			errors: [err.message],
		}
	}
}

/**
 * 取得所有訂單
 * @returns {Promise<Array>}
 */
async function getOrders() {
	const orders = await fetchOrders();

	return orders;
}

/**
 * 取得未付款訂單
 * @returns {Promise<Array>}
 */
async function getUnpaidOrders() {
	const orders = await fetchOrders();

	return orders.filter(order => !order.paid);
}

/**
 * 取得已付款訂單
 * @returns {Promise<Array>}
 */
async function getPaidOrders() {
	const orders = await fetchOrders();

	return orders.filter(order => order.paid);
}

/**
 * 更新訂單付款狀態
 * @param {string} orderId - 訂單 ID
 * @param {boolean} isPaid - 是否已付款
 * @returns {Promise<Object>}
 */
async function updatePaymentStatus(orderId, isPaid) {
	if (!orderId) {
		return {
			success: false,
			error: 'id 為必填',
		}
	}

	try {
		const orders = await updateOrderStatus(orderId, isPaid);

		return {
			success: true,
			data: orders,
		}
	} catch (err) {
		return {
			success: false,
			error: err.message,
		}
	}
}

/**
 * 刪除訂單
 * @param {string} orderId - 訂單 ID
 * @returns {Promise<Object>}
 */
async function removeOrder(orderId) {
	if (!orderId) {
		return {
			success: false,
			error: 'id 為必填',
		}
	}

	try {
		const orders = await deleteOrder(orderId);

		return {
			success: true,
			data: orders,
		}
	} catch (err) {
		return {
			success: false,
			error: err.message,
		}
	}
}

/**
 * 格式化訂單資訊
 * @param {Object} order - 訂單物件
 * @returns {Object} - 格式化後的訂單
 *
 * 回傳物件包含以下欄位：
 * - id: 訂單 ID
 * - user: 使用者資料
 * - products: 商品陣列
 * - total: 總金額（原始數字）
 * - totalFormatted: 格式化金額，使用 utils formatCurrency()
 * - paid: 付款狀態（布林值）
 * - paidText: 付款狀態文字，true → '已付款'，false → '未付款'
 * - createdAt: 格式化後的建立時間，使用 utils formatDate()
 * - daysAgo: 距離今天為幾天前，使用 utils getDaysAgo()
 */
function formatOrder(order) {
	if (!order) {
		return null;
	}

	const {
		id,
		user,
		products,
		total,
		paid,
		createdAt,
	} = order;

	return {
		id,
		user,
		products,
		total,
		totalFormatted: formatCurrency(total),
		paid,
		paidText: paid ? '已付款' : '未付款',
		createdAt: formatDate(createdAt),
		daysAgo: getDaysAgo(createdAt),
	}
}

/**
 * 顯示訂單列表
 * @param {Array} orders - 訂單陣列
 */
function displayOrders(orders) {
	if (!orders.length) {
		console.log('沒有訂單');
		return;
	}

	const formattedOrders = orders.map(order => formatOrder(order));

	let print = `
		訂單列表：
		========================================
	`;

	formattedOrders.forEach(({
		id,
		user: {
			name,
			tel,
			address,
			payment,
		},
		products,
		totalFormatted,
		paidText,
		createdAt,
		daysAgo,
	}, index) => {
		let printOrder = `
		訂單 ${index + 1}
		----------------------------------------
		訂單編號：${id}
		顧客姓名：${name}
		聯絡電話：${tel}
		寄送地址：${address}
		付款方式：${payment}
		訂單金額：${totalFormatted}
		付款狀態：${paidText}
		建立時間：${createdAt} (${daysAgo})
		----------------------------------------
		商品明細：
		`;

		products.forEach(({
			title,
			quantity,
		}) => {
			const printProduct = `
			- ${title} x ${quantity}
			`;

			printOrder += printProduct;
		})

		print += printOrder + `
		========================================
		`;
	})

	console.log(print);
}

module.exports = {
	placeOrder,
	getOrders,
	getUnpaidOrders,
	getPaidOrders,
	updatePaymentStatus,
	removeOrder,
	formatOrder,
	displayOrders
};
