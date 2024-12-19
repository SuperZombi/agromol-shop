const { useState, useEffect, Fragment } = React;
const { HashRouter, Switch, Route, Link, useParams} = ReactRouterDOM;

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
			<Route path="/products" exact component={ProductsList} />
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
		<div className={`modal ${modalOpen ? "open" : ""}`}>
			<div className="content">
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

const ProductsList = () => {
	const [products, setProducts] = useState([])
	useEffect(_=>{
		API.get_all_products().then(data=>{
			setProducts(data)
		})
	}, [])
	return (
		<div className="products-list">
			{products.length === 0 ?
				(
					<img src="images/loader.svg" className="loader"/>
				) : products.map((value,i) => (
					<ProductsItem
						name={value.name}
						image={value.img}
						price={value.price}
						id={value.id}
						key={i}
					/>)
				)
			}
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
		setLoading(true)
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
