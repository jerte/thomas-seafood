// site header

import nav from '../config/nav';
import NavItem from "./NavItem";

const headerStyle = {
	'border-bottom': "solid black 3px",
	'text-align' : "center"
};

const border = {
	border: "solid black 3px",
};

const Header = props => (
	<div className="font-acme container-fluid" style={headerStyle}>
		<nav className="navbar navbar-expand-md">
			<a className="navbar-brand" href="/">
				<div className="d-none d-md-block">
					<h3>THOMAS TACKLE & SEAFOOD</h3>
				</div>
				<div className="d-none d-sm-block d-md-none">
					<h4>THOMAS TACKLE & SEAFOOD</h4>
				</div>
				<div className="d-block d-sm-none">
					<h4>THOMAS TACKLE</h4>
				</div>
				

			</a>

			<button className="navbar-toggler my-auto" type="button" data-toggle="collapse"
				data-target="#navbar-content" aria-controls="navbar-content"
				aria-expanded="false" aria-label="toggle navigation">
				<span className="navbar-toggler-icon">
					<img width="32px" src="/images/menu.png"></img>
				</span>
			</button>
			
			<div className="collapse navbar-collapse" id="navbar-content" >
				<ul className="navbar-nav width-100 justify-content-end" >	
				{nav.map(item => (
					<NavItem
						key={item.path}
						name={item.name}
						path={item.path}
					/>
				))}
				</ul>
			</div>
		</nav>	
	</div>
);


export default Header;
