/**
 * orderIndex should be added dinamically, based on the current screens in the campaign
 * screenId should be generated with uuid
 * campaignId should be added based on the current campaign
 */
export const QuestionScreenTemplate = {
	type: "question",
	orderIndex: "COUNT",
	background: {
		type: "gradient",
		color: "linear-gradient(45deg, #FA8BFF 0%, #2BD2FF 52%, #2BFF88 90%)",
	},
	screenId: "GENERATE",
	campaignId: "ADD",
};

/**
 * itemId should be generated with uuid
 * screenId should be added based on the current screen - this is the object id of the screen in the db
 */
export const QuestionScreenTemplateItems = [
	{
		type: "answers",
		orderIndex: 1,
		itemId: "GENERATE",
		screenId: "ADD",
		content: "",
		src: "",
		settings: {
			fontFamily: "arial",
			fontSize: 16,
			color: {
				r: 74,
				g: 74,
				b: 74,
				a: 1,
			},
			highlightColor: {
				type: "solid",
				backgroundColor: "rgba(255, 255, 255, 1)",
				background: {
					r: 255,
					g: 255,
					b: 255,
					a: 1,
				},
			},
			bold: false,
			italic: false,
			underline: false,
			uppercase: false,
			align: "left",
			classNames: "",
			width: 319,
			height: 217,
			top: 123,
			left: 18,
			translateX: 4.8542353500004936,
			translateY: 143.1439598150116,
			rotate: 0,
			removeable: false,
			answers: ["double click to edit answer option", "this is the correct answer", "👈 click to set as correct answer", "fourth option&nbsp;😊"],
			correctAnswer: 1,
			successEmoji: "🎉",
		},
	},
	{
		type: "text",
		orderIndex: 0,
		itemId: "GENERATE",
		screenId: "ADD",
		content: "👉 Double click to edit the question 👈",
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
			width: 323,
			height: 89,
			top: 119,
			left: 36,
			translateX: -21,
			translateY: 25,
			rotate: 0,
		},
	},
];
