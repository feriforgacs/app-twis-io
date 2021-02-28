/**
 * orderIndex should be added dinamically, based on the current screens in the campaign
 * screenId should be generated with uuid
 * campaignId should be added based on the current campaign
 */
export const InfoScreenTemplate = {
	type: "info",
	orderIndex: "COUNT",
	background: {
		type: "gradient",
		color: "linear-gradient(45deg, #85FFBD 0%, #FFFB7D 100%)",
	},
	screenId: "GENERATE",
	campaignId: "ADD",
};

/**
 * itemId should be generated with uuid
 * screenId should be added based on the current screen - this is the object id of the screen in the db
 */
export const InfoScreenTemplateItems = [
	{
		type: "text",
		orderIndex: 0,
		itemId: "GENERATE",
		screenId: "ADD",
		content: "This is just a simple info screen. You can add text, buttons, images and stickers to it.",
		src: "",
		settings: {
			fontFamily: "",
			fontSize: 28,
			color: {
				r: 144,
				g: 19,
				b: 254,
				a: 1,
			},
			highlightColor: {
				type: "solid",
				background: {},
				backgroundColor: "",
			},
			bold: true,
			italic: false,
			underline: false,
			uppercase: false,
			align: "center",
			classNames: "",
			width: 251,
			height: 248,
			top: 216,
			left: 38,
			translateX: 17,
			translateY: -79,
			rotate: 0,
		},
	},
	{
		type: "button",
		orderIndex: 1,
		itemId: "GENERATE",
		screenId: "ADD",
		content: "Okay, next",
		src: "",
		settings: {
			fontFamily: "",
			fontSize: 18,
			color: {
				r: 255,
				g: 255,
				b: 255,
				a: 1,
			},
			highlightColor: {
				type: "gradient",
				background: {},
				backgroundColor: "linear-gradient(to bottom, #ed213a, #93291e)",
			},
			bold: true,
			italic: false,
			underline: false,
			uppercase: true,
			align: "center",
			classNames: "screen-button screen-button--classic",
			width: 200,
			height: 50,
			top: 500,
			left: 75,
			translateX: 2,
			translateY: -74,
			rotate: 0,
		},
	},
];
