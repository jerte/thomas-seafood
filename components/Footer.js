// site footer

import info from '../config/info';

const footerStyle = {
	'border-top': "solid black 3px",
	'text-align': "center",
	'line-height': "50%",
};

const Footer = () => (
	<div className="align-center" style={footerStyle}>
		
		{ /* I'd like to align keys & values around '|', something to do later */ }	
		<br/>
		{info.map( (x) => (
			<p key={x.key}>{x.name} | <a href={x.link}>{x.info}</a></p>
		))}
	</div>
);

export default Footer;
