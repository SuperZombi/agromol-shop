class API_provider {
	constructor(){

	}
	get_all_products(){
		return this._timeout(this.products, 1000)
	}
	get_product_by_id(id){
		return this._timeout(
			this.products.find(item=>item.id == id)
		, 1000)
	}
	_timeout(answer, time){
		return new Promise(resolve=>{
			setTimeout(_=>{
				resolve(answer)
			}, time)
		})
	}
	products = [
		{
			id: "1", name: "Сир плавлений «Гриби»",
			img: "http://agromol.com.ua/wp-content/uploads/2020/04/sir-griby.jpg",
			price: 20, weight: 100,
		},
		{
			id: "2", name: "Сир плавлений «Гриби»",
			img: "https://www.tablycjakalorijnosti.com.ua/file/image/foodstuff/770b8a447f9043208713e848492a7b0f/85b5be5915894708878f95dc967867e7",
			price: 25, weight: 135,
		},
		{
			id: "3", name: "Десерт сирковий «Кокос»",
			img: "http://agromol.com.ua/wp-content/uploads/2020/04/desert-sirkoviy-kokos-1024x683.jpg",
			price: 30, weight: 170,
		},
		{
			id: "4", name: "Десерт сирковий «Родзинки»",
			img: "http://agromol.com.ua/wp-content/uploads/2020/04/desert-sirkoviy-rodzinki-1024x683.jpg",
			price: 30, weight: 170,
		},
		{
			id: "5", name: "Сметана 15%",
			img: "https://s.pn.com.ua/i/md/9309/4138557/4138557_00p.jpg",
			price: 45, weight: 380,
		},
		{
			id: "6", name: "Сметана 20%",
			img: "https://s.pn.com.ua/i/md/9309/4138564/4138564_00p.jpg",
			price: 50, weight: 380,
		},
	]
}
