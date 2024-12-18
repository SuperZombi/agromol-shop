const { useState, useEffect, Fragment } = React;
const { HashRouter, Switch, Route, Link, useParams} = ReactRouterDOM;

const products = [
	{id: "1", name: "Сир плавлений «Гриби»", img: "http://agromol.com.ua/wp-content/uploads/2020/04/sir-griby.jpg", price: 20},
	{id: "2", name: "Сирок 2", img: "https://www.tablycjakalorijnosti.com.ua/file/image/foodstuff/934d8f1e142440f18f52c0c314a18161/eea6f2493d1944b88d8e6e7c073cacaa", price: 20},
]

const Home = () => <h1>Home</h1>;
const NotFound = () => (
	<div className="not_found">
		<h1>404</h1>
		<h2>Not Found</h2>
		<Link to="/">Go Home</Link>
	</div>
);

const App = () => (
	<HashRouter>
		<nav>
			<ul>
				<li><Link to="/">Home</Link></li>
				<li><Link to="/products">Products List</Link></li>
			</ul>
		</nav>

		<Switch>
			<Route path="/" exact component={Home} />
			<Route path="/products" exact component={ProductsList} />
			<Route path="/product/:key" exact component={ProductPage} />
			<Route path="*" exact component={NotFound} />
		</Switch>
	</HashRouter>
);

const ProductsList = () => (
	<div className="products-list">
		{products.map((value,i) => (
			<ProductsItem
				name={value.name}
				image={value.img}
				price={value.price}
				id={value.id}
				key={i}
			/>
		))}
	</div>
)

const ProductsItem = ({name, image, price, id}) => (
	<Link to={`/product/${id}`} className="product-item">
		<img src={image}/>
		<div className="info">
			<div className="name">{name}</div>
			<div className="price">{price}₴</div>
		</div>
	</Link>
)

const ProductPage = () => {
	const { key } = useParams();
	const product = products.find(item=>item.id === key);
	if (!product) return (<Fragment><NotFound/></Fragment>)

	return (
		<h1>This is product {product.name}</h1>
	)
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
