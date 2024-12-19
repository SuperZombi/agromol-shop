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


const App = () => (
	<HashRouter>
		<nav className="header">
			<Link to="/">
				<img src="images/logo.png"/>
			</Link>
			<Link to="/products">Товари</Link>
		</nav>

		<Switch>
			<Route path="/" exact component={Home} />
			<Route path="/products" exact component={ProductsList} />
			<Route path="/product/:key" exact component={ProductPage} />
			<Route path="*" exact component={NotFound} />
		</Switch>
	</HashRouter>
);

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

const ProductPage = () => {
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
	}, [])
	if (show_not_found) return (<Fragment><NotFound/></Fragment>)
	if (!product) return (<img src="images/loader.svg" className="loader"/>)

	const addToCartHandler = () => {
		alert("Цей функціонал ще не реалізований")
	}
	return (
		<Fragment>
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
		</Fragment>
	)
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
