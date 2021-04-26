const Plans = {
	basic: {
		name: "Basic",
		productIdMonthly: process.env.NEXT_PUBLIC_BASIC_MONTLY_PRODUCT_ID,
		productIdYearly: process.env.NEXT_PUBLIC_BASIC_YEARLY_PRODUCT_ID,
		priceBilledMonthly: process.env.NEXT_PUBLIC_PRICE_BASIC_MONTHLY,
		priceBilledYearly: process.env.NEXT_PUBLIC_PRICE_BASIC_YEARLY,
		overagesCost: process.env.NEXT_PUBLIC_PRICE_BASIC_OVERAGES,
		limit: process.env.NEXT_PUBLIC_BASIC_LIMIT,
	},
	pro: {
		name: "Pro",
		productIdMonthly: process.env.NEXT_PUBLIC_PRO_MONTLY_PRODUCT_ID,
		productIdYearly: process.env.NEXT_PUBLIC_PRO_YEARLY_PRODUCT_ID,
		priceBilledMonthly: process.env.NEXT_PUBLIC_PRICE_PRO_MONTHLY,
		priceBilledYearly: process.env.NEXT_PUBLIC_PRICE_PRO_YEARLY,
		overagesCost: process.env.NEXT_PUBLIC_PRICE_PRO_OVERAGES,
		limit: process.env.NEXT_PUBLIC_PRO_LIMIT,
	},
	premium: {
		name: "Premium",
		productIdMonthly: process.env.NEXT_PUBLIC_PREMIUM_MONTLY_PRODUCT_ID,
		productIdYearly: process.env.NEXT_PUBLIC_PREMIUM_YEARLY_PRODUCT_ID,
		priceBilledMonthly: process.env.NEXT_PUBLIC_PRICE_PREMIUM_MONTHLY,
		priceBilledYearly: process.env.NEXT_PUBLIC_PRICE_PREMIUM_YEARLY,
		overagesCost: process.env.NEXT_PUBLIC_PRICE_PREMIUM_OVERAGES,
		limit: process.env.NEXT_PUBLIC_PREMIUM_LIMIT,
	},
};

export default Plans;
