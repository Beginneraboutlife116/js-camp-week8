// ========================================
// 購物車服務
// ========================================

const { fetchCart, addToCart, updateCartItem, deleteCartItem, clearCart } = require('../api');
const { validateCartQuantity, formatCurrency } = require('../utils');

/**
 * 取得購物車
 * @returns {Promise<Object>}
 */
async function getCart() {
	const data = await fetchCart();

	return data;
}

/**
 * 加入商品到購物車
 * @param {string} productId - 產品 ID
 * @param {number} quantity - 數量
 * @returns {Promise<Object>}
 */
async function addProductToCart(productId, quantity) {
	if (!productId) {
		return {
			success: false,
			error: 'id 為必填',
		}
	}

	const { isValid, error } = validateCartQuantity(quantity);

	if (!isValid) {
		return {
			success: isValid,
			error,
		}
	}

	const data = await addToCart(productId, quantity);

	return {
		success: true,
		data,
	};
}

/**
 * 更新購物車商品數量
 * @param {string} cartId - 購物車項目 ID
 * @param {number} quantity - 新數量
 * @returns {Promise<Object>}
 */
async function updateProduct(cartId, quantity) {
	if (!cartId) {
		return {
			success: false,
			error: 'id 為必填',
		}
	}

	const { isValid, error } = validateCartQuantity(quantity);

	if (!isValid) {
		return {
			success: isValid,
			error,
		}
	}

	const data = await updateCartItem(cartId, quantity);

	return {
		success: true,
		data,
	};
}

/**
 * 移除購物車商品
 * @param {string} cartId - 購物車項目 ID
 * @returns {Promise<Object>}
 */
async function removeProduct(cartId) {
	if (!cartId) {
		return {
			success: false,
			error: 'id 為必填',
		}
	}

	const data = await deleteCartItem(cartId);

	return {
		success: true,
		data,
	}
}

/**
 * 清空購物車
 * @returns {Promise<Object>}
 */
async function emptyCart() {
	const data = await clearCart();

	return {
		success: true,
		data,
	}
}

/**
 * 計算購物車總金額
 * @returns {Promise<Object>}
 */
async function getCartTotal() {
	const {
		carts,
		total,
		finalTotal,
	} = await fetchCart();

	return {
		total,
		finalTotal,
		itemCount: carts.length,
	}
}

/**
 * 顯示購物車內容
 * @param {Object} cart - 購物車資料
 */
function displayCart(cart) {
	const {
		carts,
		total,
		finalTotal,
	} = cart;

	if (!carts.length) {
		console.log('購物車是空的');
		return;
	}

	const formattedCarts = carts.map(item => {
		const {
			quantity,
			product: {
				title,
				price,
			}
		} = item;

		return {
			title,
			quantity,
			price: formatCurrency(price),
			subtotal: formatCurrency(price * quantity),
		}
	});

	let print = `
		購物車內容：
		----------------------------------------
	`;

	formattedCarts.forEach(({
		title,
		quantity,
		price,
		subtotal,
	}, index) => {
		const printItem = `
		${index + 1} ${title}
			數量：${quantity}
			單價：${price}
			小計：${subtotal}
		----------------------------------------
		`;

		print += printItem;
	});

	print += `
		商品總計：${formatCurrency(total)}
		折扣後金額：${formatCurrency(finalTotal)}
	`;

	console.log(print);
}

module.exports = {
	getCart,
	addProductToCart,
	updateProduct,
	removeProduct,
	emptyCart,
	getCartTotal,
	displayCart
};
