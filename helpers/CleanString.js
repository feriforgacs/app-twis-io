export default function CleanString(string) {
	return string
		.replace(/&nbsp;/g, " ")
		.replace(/&amp;/g, "&")
		.replace(/&gt;/g, ">")
		.replace(/&lt;/g, "<‎"); // there is a hidden whitespace in this replace, don't modify it!
}
