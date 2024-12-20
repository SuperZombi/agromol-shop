const { useState, useEffect, useRef, Fragment } = React;
const { HashRouter, Switch, Route, Link, useParams, useLocation, useHistory } = ReactRouterDOM;

const API = new API_provider()

const Home = () => (
	<Fragment>
		<h1 align="center">Головна сторінка</h1>
		<div align="center">
			<Link to="/products"><button>Товари</button></Link>
		</div>
	</Fragment>
);
const NotFound = () => (
	<div className="not_found">
		<h1>404</h1>
		<h2>Сторінку не знайдено</h2>
		<h4>¯\_(ツ)_/¯</h4>
		<Link to="/">На головну</Link>
	</div>
);


const App = () => {
	const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
	const [toasts, setToasts] = useState([])
	const addToCart = (item_id)=>{
		setCart(prev=>[...prev, item_id])
		setToasts(prev=>[...prev, "Товар додано у кошик"])
	}
	const removeFromCart = (item_id)=>{
		let index = cart.lastIndexOf(item_id);
		if (index !== -1) {
			let newArray = cart.slice();
			newArray.splice(index, 1)
			setCart(newArray)
		}
	}
	useEffect(_=>{
		localStorage.setItem('cart', JSON.stringify(cart))
	},[cart])

return (
	<HashRouter>
		<nav className="header">
			<Link to="/">
				<img src="images/logo.png"/>
			</Link>
			<Link to="/products">Товари</Link>
			{ cart.length > 0 ?
				<Link to="/cart" className="cart-icon" count={Math.min(9,cart.length)}><i className="fa-solid fa-basket-shopping"></i></Link>
			: ""}
		</nav>

		<Switch>
			<Route path="/" exact component={Home} />
			<Route path="/products" exact component={ProductsPage} />
			<Route path="/product/:key" exact render={() => <ProductPage addToCart={addToCart} />} />
			<Route path="/cart" exact render={() => <Cart items={cart} removeItem={removeFromCart} />} />
			<Route path="*" exact component={NotFound} />
		</Switch>
		<div className="toasts-area">
			{toasts.map((val,i)=>(
				<Toast key={i} text={val}/>
			))}
		</div>
	</HashRouter>
)};

const Modal = ({onClose, children}) => {
	const [modalOpen, setOpen] = useState(false)
	useEffect(_=>{
		setTimeout(_=>setOpen(true), 0)
	}, [])
	const handleClose = () => {
		setOpen(false)
		setTimeout(_=>onClose(), 500)
	}
	return (
		<div className={`modal ${modalOpen ? "open" : ""}`} onClick={handleClose}>
			<div className="content" onClick={e => e.stopPropagation()}>
				<i className="fa-solid fa-circle-xmark close" onClick={handleClose}></i>
				{children}
			</div>
		</div>
	)
}
const Toast = ({text}) => {
	const [hidden, setHidden] = useState(false)
	const [display, setDisplay] = useState(true)
	useEffect(_=>{
		setTimeout(_=>{
			setHidden(true)
			setTimeout(_=>setDisplay(false), 500)
		}, 3000)
	})
	return display ? (
		<div className={`toast ${hidden ? "hidden" : ""}`}>
			{text}
		</div>
	) : ""
}


const ProductsPage = () => {
	const [products, setProducts] = useState([])
	const [loading, setLoading] = useState(true)
	const [filters_menu_open, setFiltersMenuOpen] = useState(false)
	const [all_filters, setAllFilters] = useState([])
	const [selectedFilters, setSelectedFilters] = useState({})
	const location = useLocation()
	const history = useHistory()
	const requestId = useRef(0)
	const get_filters = () => {
		return Object.fromEntries(
			Object.entries(selectedFilters).filter(([key, values]) => values.length > 0)
		)
	}
	const updateURLWithFilters = (filters) => {
		const params = new URLSearchParams()
		Object.keys(filters).forEach(key => {
			if (filters[key].length > 0) {
				params.set(key, filters[key].join(','))
			}
		})
		history.push({ search: params.toString() })
	}
	useEffect(_=>{
		API.get_all_filters().then(data=>{
			setAllFilters(data)
			const params = new URLSearchParams(location.search)
			const filtersFromURL = {}
			params.forEach((value, key) => {
				const filterExists = data.find(filter => filter.name === key);
				if (filterExists) {
					filtersFromURL[key] = value.split(',')
				}
			})
			setSelectedFilters(filtersFromURL);
		})
	}, [])
	useEffect(_=>{
		const currentRequestId = requestId.current + 1;
		requestId.current = currentRequestId;
		setLoading(true)
		let filters = get_filters()
		API.get_products(filters).then(data=>{
			if (currentRequestId === requestId.current) {
				setProducts(data)
				setLoading(false)
			}
		})
		updateURLWithFilters(filters)
	}, [selectedFilters])

	const changeFilter = (name, new_values)=>{
		let temp = {}
		temp[name] = new_values
		setSelectedFilters(prev=>Object.assign({}, prev, temp))
	}
	return (
		<div className="products-page">
			<div className={`filters-menu ${filters_menu_open ? "open" : ""}`}>
				<i className="fa-solid fa-circle-xmark close" onClick={_=>setFiltersMenuOpen(false)}></i>
				<div className="scrollable">
					{all_filters.map((val,k)=>(
						<ProductFilter key={k}
							name={val.name}
							title={val.title}
							items={val.items}
							selected={selectedFilters[val.name]}
							onChange={changeFilter}
						/>
					))}
				</div>
			</div>
			<div className="scrollable">
				<div className={`filters-icon ${Object.keys(get_filters()).length > 0 ? "active" : ""}`}>
					<div>
						<button onClick={_=>setFiltersMenuOpen(true)}>
							<i className="fa-solid fa-filter"></i>
						</button>
					</div>
				</div>
				{ loading ? <img src="images/loader.svg" className="loader"/> :
					products.length === 0 ? (
						<div style={{textAlign: "center"}}>
							<hr/>
							<h3>Нічого не знайдено</h3>
							<h3>(◡_◡)</h3>
						</div>
					) : (
						<div className="products-list">
							{products.map((value,i) => (
								<ProductsItem
									name={value.name}
									image={value.img}
									price={value.price}
									id={value.id}
									key={i}
								/>)
							)}
						</div>
					)
				}
			</div>
		</div>
	)
}

const ProductsItem = ({name, image, price, id}) => (
	<Link to={`/product/${id}`} className="product-item">
		<div className="image back-loader">
			<img src={image}/>
		</div>
		<div className="info">
			<div className="name">{name}</div>
			<div className="price">{price}₴</div>
		</div>
	</Link>
)
const ProductFilter = ({name, title, items, selected, onChange}) => {
	const [selectedValues, setSelectedValues] = useState(selected || [])
	const handler = (event)=>{
		const value = event.target.value;
		setSelectedValues((prev) =>
			event.target.checked
				? [...prev, value]
				: prev.filter((v) => v != value)
		);
	}
	const isFirstRender = useRef(true);
	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
		} else {
			onChange(name, selectedValues)
		}
	}, [selectedValues])
	return (
		<details className={`filter ${selectedValues.length > 0 ? "active": ""}`} open={true}>
			<summary><span>{title}</span></summary>
			<div className="content">
				{items.map((val, i)=>(
					<label key={i}>
						<input type="checkbox" name={name} value={val.id}
							onChange={handler} 
							checked={selectedValues.includes(val.id) ? true : false}
						/>
						<span>{val.name}</span>
					</label>
				))}
			</div>
		</details>
	)
}

const ProductPage = ({addToCart}) => {
	const { key } = useParams();
	const [product, setProduct] = useState()
	const [show_not_found, setNotFounded] = useState(false)
	const [imgViewOpen, setImgView] = useState(false)

	useEffect(_=>{
		API.get_product_by_id(key).then(data=>{
			if (data){
				setProduct(data)
			} else {
				setNotFounded(true)
			}
		})
	}, [key])
	if (show_not_found) return (<Fragment><NotFound/></Fragment>)
	if (!product) return (<img src="images/loader.svg" className="loader"/>)

	const addToCartHandler = () => {
		addToCart(product.id)
	}
	return (
		<div className="product-page-wrapper">
			<div className="product-page">
				{imgViewOpen ? <Modal onClose={_=>setImgView(false)}><img src={product.img}/></Modal> : ""}
				<div className="image back-loader" onClick={_=>setImgView(true)}>
					<img src={product.img}/>
				</div>
				<div className="info">
					<div className="name">{product.name}</div>
					<table>
					<tbody>
						<tr>
							<td>Вага:</td>
							<td>{product.weight}г</td>
						</tr>
						<tr>
							<td>Ціна:</td>
							<td className="price">{product.price}грн</td>
						</tr>
					</tbody>
					</table>
					<button onClick={addToCartHandler}>Додати в кошик</button>
				</div>
			</div>
		</div>
	)
}


const CartItem = ({id, name, img, price, amount, total_price, removeItem}) => {
	return (
		<div className="item">
			<img src={img} className="back-loader"/>
			<div className="info">
				<span className="name">{name}</span>
				<span className="price">{price}грн/шт</span>
			</div>
			<div className="total-info">
				<span className="price">{total_price}грн</span>
				<span className="amount">{amount}шт</span>
			</div>
			<i className="fa-solid fa-trash delete" onClick={_=>removeItem(id)}></i>
		</div>
	)
}
const Cart = ({items, removeItem}) => {
	const [cart_items, setCartItems] = useState([])
	const [total_price, setTotalPrice] = useState(0)
	const [loading, setLoading] = useState(true)
	useEffect(_=>{
		API.get_cart_from_items(items).then(data=>{
			setTotalPrice(data.total_price)
			setCartItems(data.products)
			setLoading(false)
		})
	},[items])
	return (
		<div className="cart-page">
			<h2>Кошик</h2>
			{items.length === 0 ? <h3>Ваш кошик пустий</h3> :
				loading ? <img src="images/loader.svg" className="loader"/> :
				<Fragment>
					<h3 style={{marginTop:0}}>Товарів у кошику: {items.length}</h3>
					<div className="cart-items">
						{cart_items.map((item, key)=>(
							<CartItem {...item} key={key} removeItem={removeItem}/>
						))}
					</div>
					<div className="total-price">
						<span>Разом:</span><span className="price">{total_price}грн</span>
					</div>
				</Fragment>
			}
		</div>
	)
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
