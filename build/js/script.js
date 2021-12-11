// function testWebP(callback) {
// 	var webP = new Image();
// 	webP.onload = webP.onerror = function () {
// 		callback(webP.height == 2);
// 	};
// 	webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
// }
// //если браузер поддерживает формат webp - то HTML добавить соответствующий класс
// // testWebP(function (support) {
// // 	if (support == true) {
// // 		document.querySelector('html').classList.add('_webp');
// // 	} else {
// // 		document.querySelector('html').classList.add('_no-webp');
// // 	}
// // });

// //Menu-burger
// let iconMenu = document.querySelector(".icon-menu");
// if (iconMenu != null) {
// 	let menuBody = document.querySelector(".menu__body");
// 	iconMenu.addEventListener("click", function (e) {
// 			iconMenu.classList.toggle("_active");
// 			menuBody.classList.toggle("_active");
// 	});
// };
// function menu_close() {
// 	let iconMenu = document.querySelector(".icon-menu");
// 	let menuBody = document.querySelector(".menu__body");
// 	iconMenu.classList.remove("_active");
// 	menuBody.classList.remove("_active");
// }

//Menu-burger
let iconMenu = document.querySelector(".icon-menu");
if (iconMenu != null) {
	let menuBody = document.querySelector(".menu__wrapper");
	iconMenu.addEventListener("click", function (e) {
			iconMenu.classList.toggle("_active");
			menuBody.classList.toggle("_active");
	});
};
function menu_close() {
	let iconMenu = document.querySelector(".icon-menu");
	let menuBody = document.querySelector(".menu__wrapper");
	iconMenu.classList.remove("_active");
	menuBody.classList.remove("_active");
}