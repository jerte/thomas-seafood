// standard site page

import Head from 'next/head';
import Header from "./Header";
import Footer from "./Footer";

const pageStyle = {
};

const contentStyle = {
};

const Page = props => (
	<div>
      <Head>
	  	<script src="/scripts/jquery.js"></script>
    	<script src="/scripts/popper.js"></script>
  		<script src="/scripts/bootstrap.js"></script>
      </Head>


	<div className="page" style={pageStyle}>
		<Header />
		<div className="content" style={contentStyle}>
			{props.children}
		</div>
		<Footer />
	</div>
    </div>
);

export default Page;
