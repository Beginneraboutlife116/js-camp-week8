// ========================================
// API 請求函式
// ========================================

const axios = require('axios');
const { API_PATH, BASE_URL, ADMIN_TOKEN } = require('./config');

const { handleAxiosError } = require('./utils');

// ========== 客戶端 API ==========
const customerApi = axios.create({
	baseURL: `${BASE_URL}/api/livejs/v1/customer/${API_PATH}`,
})

/**
 * 取得產品列表
 * @returns {Promise<Array>}
 */
async function fetchProducts() {
	try {
		const { data: {
			products
		} } = await customerApi.get('/products');

		return products;
	} catch (error) {
		return handleAxiosError(error);
	}
}

/**
 * 取得購物車
 * @returns {Promise<Object>} - 回傳 { carts: [...], total: 數字, finalTotal: 數字 }
 */
async function fetchCart() {
	try {
		const { data: {
			carts,
			total,
			finalTotal,
		} } = await customerApi.get('/carts');

		return {
			carts,
			total,
			finalTotal,
		}
	} catch (error) {
		return handleAxiosError(error);
	}
}

/**
 * 加入購物車
 * @param {string} productId - 產品 ID
 * @param {number} quantity - 數量
 * @returns {Promise<Object>} - 回傳購物車資料
 */
async function addToCart(productId, quantity) {
	try {
		const { data: {
			carts,
			total,
			finalTotal,
		} } = await customerApi.post('/carts', {
			data: {
				productId,
				quantity,
			}
		})

		return {
			carts,
			total,
			finalTotal,
		};
	} catch (error) {
		return handleAxiosError(error);
	}
}

/**
 * 更新購物車商品數量
 * @param {string} cartId - 購物車項目 ID
 * @param {number} quantity - 新數量
 * @returns {Promise<Object>} - 回傳購物車資料
 */
async function updateCartItem(cartId, quantity) {
	try {
		const { data: {
			carts,
			total,
			finalTotal,
		} } = await customerApi.patch('/carts', {
			data: {
				id: cartId,
				quantity,
			}
		});

		return {
			carts,
			total,
			finalTotal,
		}
	} catch (error) {
		return handleAxiosError(error);
	}
}

/**
 * 刪除購物車商品
 * @param {string} cartId - 購物車項目 ID
 * @returns {Promise<Object>} - 回傳購物車資料
 */
async function deleteCartItem(cartId) {
	try {
		const { data: {
			carts,
			total,
			finalTotal,
		} } = await customerApi.delete(`/carts/${cartId}`);

		return {
			carts,
			total,
			finalTotal,
		}
	} catch (error) {
		return handleAxiosError(error);
	}
}

/**
 * 清空購物車
 * @returns {Promise<Object>} - 回傳購物車資料
 */
async function clearCart() {
	try {
		const { data: {
			carts,
			total,
			finalTotal,
		} } = await customerApi.delete('/carts');

		return {
			carts,
			total,
			finalTotal,
		}
	} catch (error) {
		return handleAxiosError(error);
	}
}

/**
 * 建立訂單
 * @param {Object} userInfo - 使用者資料
 * @returns {Promise<Object>}
 */
async function createOrder(userInfo) {
	try {
		const { data } = await customerApi.post('/orders', {
			data: userInfo
		})

		return data;
	} catch (error) {
		return handleAxiosError(error);
	}
}

// ========== 管理員 API ==========

/**
 * 管理員 API 需加上認證
 * 提示：
	headers: {
	  authorization: ADMIN_TOKEN
	}
 */
const adminApi = axios.create({
	baseURL: `${BASE_URL}/api/livejs/v1/admin/${API_PATH}`,
	headers: { Authorization: ADMIN_TOKEN },
})

/**
 * 取得訂單列表
 * @returns {Promise<Array>}
 */
async function fetchOrders() {
	try {
		const { data: {
			orders,
		} } = await adminApi.get('/orders');

		return orders;
	} catch (error) {
		return handleAxiosError(error);
	}
}

/**
 * 更新訂單狀態
 * @param {string} orderId - 訂單 ID
 * @param {boolean} isPaid - 是否已付款
 * @returns {Promise<Object>}
 */
async function updateOrderStatus(orderId, isPaid) {
	try {
		const { data: {
			orders,
		} } = await adminApi.put('/orders', {
			data: {
				id: orderId,
				paid: isPaid,
			}
		});

		return orders;
	} catch (error) {
		return handleAxiosError(error);
	}
}

/**
 * 刪除訂單
 * @param {string} orderId - 訂單 ID
 * @returns {Promise<Object>}
 */
async function deleteOrder(orderId) {
	try {
		const { data: {
			orders,
		} } = await adminApi.delete(`/orders/${orderId}`);

		return orders;
	} catch (error) {
		return handleAxiosError(error);
	}
}

module.exports = {
	fetchProducts,
	fetchCart,
	addToCart,
	updateCartItem,
	deleteCartItem,
	clearCart,
	createOrder,
	fetchOrders,
	updateOrderStatus,
	deleteOrder
};
