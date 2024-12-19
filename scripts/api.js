class API_provider {
	constructor(){}
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
			img: "https://lh6.googleusercontent.com/proxy/Li9K2eQt2fPJdKNu8cLjx-c0fpQfa0HmFgq_80R280LSPSPITZAGkS2TqV8PyGV0r3WBivFN9lLprhGuy8T80S-BUMY8bN0s5fWyCpsKP-ep7dCUqrARt4Oz",
			price: 20, weight: 100,
		},
		{
			id: "2", name: "Сир плавлений «Гриби»",
			img: "https://www.tablycjakalorijnosti.com.ua/file/image/foodstuff/770b8a447f9043208713e848492a7b0f/85b5be5915894708878f95dc967867e7",
			price: 25, weight: 135,
		},
		{
			id: "3", name: "Десерт сирковий «Кокос»",
			img: "https://lh6.googleusercontent.com/proxy/DpOTTz2gRGy6U-ZQWKrrirfWAo8G2jgsO_WFX60MyMjMAjpYLpOA8bWYwLAZ1bkXqnNSx3u4W0uTUPztzHO8A3_2laybo2fPClocsTwZvTy8qwEuCyGmSzRA3MWEknBkdyGsof2f",
			price: 30, weight: 170,
		},
		{
			id: "4", name: "Десерт сирковий «Родзинки»",
			img: "https://lh6.googleusercontent.com/proxy/ru_2aSQyCVSkf8nGmKE8TawVptBBb-eG531_UQf5mPKbXIL-wtElBWLbrEB3XvzBlwMKM_SfPZmgINXx2H1gQV2I6pWEqxz6UmTLlh0uISddLJKTgpnxiE3rQiQwJD-0-Bxba49AeEeu",
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
