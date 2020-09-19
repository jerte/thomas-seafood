// standard site page

import Header from "./Header";
import Footer from "./Footer";

const pageStyle = {
};

const contentStyle = {
};

const Page = props => (
	<div className="page" style={pageStyle}>
		<Header>home, seafood & recipes, about us, contact</Header>
		<div className="content" style={contentStyle}>
			{props.children}
		</div>
		<Footer />
	</div>
);

export default Page;
